"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Crosshair, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppHeader } from "@/components/layout/appHeader";
import { detectGeoBlock, listGeoBlocks, saveGeoBlock, type DetectGeoBlockPayload } from "@/features/geoBlocks/geoBlockService";
import type { GeoBlock, GeoBlockType } from "@/types/geoBlock";

type LeafletLatLng = {
  lat: number;
  lng: number;
};

type LeafletMap = {
  invalidateSize: () => void;
  on: (event: "click", handler: (event: { latlng: LeafletLatLng }) => void) => LeafletMap;
  remove: () => void;
  setView: (center: [number, number], zoom: number) => LeafletMap;
};

type LeafletMarker = {
  addTo: (map: LeafletMap) => LeafletMarker;
  setLatLng: (center: [number, number]) => LeafletMarker;
};

type LeafletRectangle = {
  addTo: (map: LeafletMap) => LeafletRectangle;
  remove: () => void;
  setBounds: (bounds: [[number, number], [number, number]]) => LeafletRectangle;
};

type LeafletCircleMarker = {
  addTo: (map: LeafletMap) => LeafletCircleMarker;
  remove: () => void;
};

type LeafletTileLayer = {
  addTo: (map: LeafletMap) => LeafletTileLayer;
};

type LeafletApi = {
  map: (element: HTMLElement, options?: { scrollWheelZoom?: boolean }) => LeafletMap;
  marker: (center: [number, number]) => LeafletMarker;
  circleMarker: (
    center: [number, number],
    options?: { color?: string; fillColor?: string; fillOpacity?: number; radius?: number; weight?: number },
  ) => LeafletCircleMarker;
  rectangle: (
    bounds: [[number, number], [number, number]],
    options?: { color?: string; fillColor?: string; fillOpacity?: number; weight?: number },
  ) => LeafletRectangle;
  tileLayer: (url: string, options: Record<string, string | number>) => LeafletTileLayer;
};

const blockColors = ["#2563eb", "#dc2626", "#7c3aed", "#d97706", "#059669", "#be123c", "#0891b2", "#4f46e5"];

declare global {
  interface Window {
    L?: LeafletApi;
    rcwnLeafletPromise?: Promise<LeafletApi>;
  }
}

const defaultPayload: DetectGeoBlockPayload = {
  lat: 23.8067,
  lng: 90.3686,
  areaName: "Mirpur",
  precision: 6,
  type: "urban",
  division: "Dhaka",
  district: "Dhaka",
  upazila: "Mirpur",
  ward: "",
  union: "",
  area: {
    widthKm: 2,
    heightKm: 3,
  },
  target: {
    guardians: 2,
    truthKeepers: 10,
    watchers: 40,
  },
};

function valueAsNumber(value: string) {
  const next = Number(value);
  return Number.isFinite(next) ? next : 0;
}

function getRectangleBounds(center: { lat: number; lng: number }, widthKm: number, heightKm: number) {
  const latDelta = heightKm / 111;
  const lngDelta = widthKm / (111 * Math.cos((center.lat * Math.PI) / 180));

  return [
    [center.lat - latDelta / 2, center.lng - lngDelta / 2],
    [center.lat + latDelta / 2, center.lng + lngDelta / 2],
  ] as [[number, number], [number, number]];
}

function colorForBlock(blockCode: string) {
  const index = blockCode.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) % blockColors.length;
  return blockColors[index];
}

function formatConflict(block: GeoBlock) {
  if (!block.overlapConflict) {
    return null;
  }

  return `Overlaps ${block.overlapConflict.areaName} / ${block.overlapConflict.blockCode} by ${block.overlapConflict.overlapPercent}%.`;
}

function getAxiosMessage(error: unknown) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || error.message;
  }

  return error instanceof Error ? error.message : "Unexpected error.";
}

function loadLeaflet() {
  if (window.L) {
    return Promise.resolve(window.L);
  }

  if (window.rcwnLeafletPromise) {
    return window.rcwnLeafletPromise;
  }

  window.rcwnLeafletPromise = new Promise<LeafletApi>((resolve, reject) => {
    if (!document.querySelector('link[href="https://unpkg.com/leaflet/dist/leaflet.css"]')) {
      const link = document.createElement("link");
      link.href = "https://unpkg.com/leaflet/dist/leaflet.css";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://unpkg.com/leaflet/dist/leaflet.js"]',
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => {
        if (window.L) {
          resolve(window.L);
        }
      });
      existingScript.addEventListener("error", () => reject(new Error("Could not load Leaflet.")));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet/dist/leaflet.js";
    script.onload = () => {
      if (window.L) {
        resolve(window.L);
        return;
      }

      reject(new Error("Leaflet did not initialize."));
    };
    script.onerror = () => reject(new Error("Could not load Leaflet."));
    document.body.appendChild(script);
  });

  return window.rcwnLeafletPromise;
}

export function AddGeoBlockView() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  const rectangleRef = useRef<LeafletRectangle | null>(null);
  const existingLayerRefs = useRef<Array<LeafletRectangle | LeafletCircleMarker>>([]);
  const [payload, setPayload] = useState(defaultPayload);
  const [detectedBlock, setDetectedBlock] = useState<GeoBlock | null>(null);
  const [existingBlocks, setExistingBlocks] = useState<GeoBlock[]>([]);
  const [isMapReady, setIsMapReady] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    void loadLeaflet()
      .then((leaflet) => {
        if (!isMounted || !mapContainerRef.current || mapRef.current) {
          return;
        }

        const map = leaflet
          .map(mapContainerRef.current, { scrollWheelZoom: true })
          .setView([defaultPayload.lat, defaultPayload.lng], 13);

        leaflet
          .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "OpenStreetMap",
            maxZoom: 19,
          })
          .addTo(map);

        markerRef.current = leaflet.marker([defaultPayload.lat, defaultPayload.lng]).addTo(map);
        rectangleRef.current = leaflet
          .rectangle(
            getRectangleBounds(
              { lat: defaultPayload.lat, lng: defaultPayload.lng },
              defaultPayload.area.widthKm,
              defaultPayload.area.heightKm,
            ),
            {
              color: "#0f766e",
              fillColor: "#14b8a6",
              fillOpacity: 0.14,
              weight: 2,
            },
          )
          .addTo(map);
        map.on("click", (event) => {
          setPayload((current) => ({
            ...current,
            lat: Number(event.latlng.lat.toFixed(6)),
            lng: Number(event.latlng.lng.toFixed(6)),
          }));
          setDetectedBlock(null);
        });

        mapRef.current = map;
        setIsMapReady(true);
        window.setTimeout(() => map.invalidateSize(), 0);
      })
      .catch((error: unknown) => {
        setMessage(error instanceof Error ? error.message : "Could not load map.");
      });

    return () => {
      isMounted = false;
      mapRef.current?.remove();
      mapRef.current = null;
      setIsMapReady(false);
      markerRef.current = null;
      rectangleRef.current = null;
    };
  }, []);

  useEffect(() => {
    window.setTimeout(() => {
      void listGeoBlocks()
        .then((blocks) => setExistingBlocks(blocks.filter((block) => block.isActive !== false)))
        .catch((error: unknown) => setMessage(getAxiosMessage(error)));
    }, 0);
  }, []);

  useEffect(() => {
    if (!isMapReady || !mapRef.current || !window.L) {
      return;
    }

    existingLayerRefs.current.forEach((layer) => layer.remove());
    existingLayerRefs.current = [];

    for (const block of existingBlocks) {
      const color = colorForBlock(block.blockCode);
      existingLayerRefs.current.push(
        window.L.rectangle(block.area.bounds, {
          color,
          fillColor: color,
          fillOpacity: 0.08,
          weight: 2,
        }).addTo(mapRef.current),
      );
      existingLayerRefs.current.push(
        window.L.circleMarker([block.center.lat, block.center.lng], {
          color,
          fillColor: color,
          fillOpacity: 0.85,
          radius: 5,
          weight: 2,
        }).addTo(mapRef.current),
      );
    }
  }, [existingBlocks, isMapReady]);

  useEffect(() => {
    markerRef.current?.setLatLng([payload.lat, payload.lng]);
    rectangleRef.current?.setBounds(
      getRectangleBounds(
        { lat: payload.lat, lng: payload.lng },
        payload.area.widthKm,
        payload.area.heightKm,
      ),
    );
    mapRef.current?.setView([payload.lat, payload.lng], 13);
  }, [payload.area.heightKm, payload.area.widthKm, payload.lat, payload.lng]);

  function updateField<Key extends keyof DetectGeoBlockPayload>(key: Key, value: DetectGeoBlockPayload[Key]) {
    setPayload((current) => ({ ...current, [key]: value }));
  }

  function updateTarget(key: keyof DetectGeoBlockPayload["target"], value: number) {
    setPayload((current) => ({
      ...current,
      target: {
        ...current.target,
        [key]: value,
      },
    }));
  }

  function updateArea(key: keyof DetectGeoBlockPayload["area"], value: number) {
    setPayload((current) => ({
      ...current,
      area: {
        ...current.area,
        [key]: value,
      },
    }));
  }

  async function handleDetect() {
    try {
      const block = await detectGeoBlock(payload);
      setDetectedBlock(block);
      setMessage(formatConflict(block) || "Block detected from selected coordinates. This area is clear to save.");
    } catch (error) {
      setMessage(getAxiosMessage(error));
    }
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      const block = await saveGeoBlock({
        ...payload,
        blockCode: detectedBlock?.blockCode,
        center: {
          lat: payload.lat,
          lng: payload.lng,
        },
      });
      setDetectedBlock(block);
      setExistingBlocks((current) => {
        const withoutSaved = current.filter((item) => item.blockCode !== block.blockCode);
        return [block, ...withoutSaved];
      });
      setMessage(`Saved block ${block.blockCode}.`);
    } catch (error) {
      setMessage(getAxiosMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  const hasOverlapConflict = Boolean(detectedBlock?.hasOverlapConflict);

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl px-5 py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-teal-700">Geo admin</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950">Add block</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Pick a map coordinate, generate a precision-6 geohash block, and save the community target coverage plan.
            </p>
          </div>
          <div className="flex gap-2">
            <Button className="gap-2" onClick={handleDetect} type="button" variant="secondary">
              <Crosshair aria-hidden className="h-4 w-4" />
              Detect
            </Button>
            <Button className="gap-2" disabled={isSaving || hasOverlapConflict} onClick={handleSave} type="button">
              <Database aria-hidden className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save block"}
            </Button>
          </div>
        </div>

        {message ? <p className="mt-5 rounded-lg border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-600">{message}</p> : null}

        <section className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div
              className="h-[420px] w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
              ref={mapContainerRef}
            />
            <p className="mt-3 text-xs text-slate-500">
              Tap or click the map to move the marker. Existing blocks are shown as colored rectangles and center dots.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-bold text-slate-950">Block details</h2>
              <div className="mt-4 grid gap-3">
                <label className="grid gap-2 text-sm font-bold text-slate-900">
                  Area name
                  <Input onChange={(event) => updateField("areaName", event.target.value)} value={payload.areaName} />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="grid gap-2 text-sm font-bold text-slate-900">
                    Latitude
                    <Input onChange={(event) => updateField("lat", valueAsNumber(event.target.value))} type="number" value={payload.lat} />
                  </label>
                  <label className="grid gap-2 text-sm font-bold text-slate-900">
                    Longitude
                    <Input onChange={(event) => updateField("lng", valueAsNumber(event.target.value))} type="number" value={payload.lng} />
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <label className="grid gap-2 text-sm font-bold text-slate-900">
                    Precision
                    <Input onChange={(event) => updateField("precision", valueAsNumber(event.target.value))} type="number" value={payload.precision} />
                  </label>
                  <label className="grid gap-2 text-sm font-bold text-slate-900">
                    Type
                    <select
                      className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                      onChange={(event) => updateField("type", event.target.value as GeoBlockType)}
                      value={payload.type}
                    >
                      <option value="urban">Urban</option>
                      <option value="rural">Rural</option>
                      <option value="mixed">Mixed</option>
                    </select>
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <label className="grid gap-2 text-sm font-bold text-slate-900">
                    Width km
                    <Input onChange={(event) => updateArea("widthKm", valueAsNumber(event.target.value))} type="number" value={payload.area.widthKm} />
                  </label>
                  <label className="grid gap-2 text-sm font-bold text-slate-900">
                    Height km
                    <Input onChange={(event) => updateArea("heightKm", valueAsNumber(event.target.value))} type="number" value={payload.area.heightKm} />
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input onChange={(event) => updateField("division", event.target.value)} placeholder="Division" value={payload.division} />
                  <Input onChange={(event) => updateField("district", event.target.value)} placeholder="District" value={payload.district} />
                  <Input onChange={(event) => updateField("upazila", event.target.value)} placeholder="Upazila" value={payload.upazila} />
                  <Input onChange={(event) => updateField("ward", event.target.value)} placeholder="Ward" value={payload.ward} />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-bold text-slate-950">Coverage target</h2>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <label className="grid gap-2 text-sm font-bold text-slate-900">
                  Watchers
                  <Input onChange={(event) => updateTarget("watchers", valueAsNumber(event.target.value))} type="number" value={payload.target.watchers} />
                </label>
                <label className="grid gap-2 text-sm font-bold text-slate-900">
                  Truth
                  <Input onChange={(event) => updateTarget("truthKeepers", valueAsNumber(event.target.value))} type="number" value={payload.target.truthKeepers} />
                </label>
                <label className="grid gap-2 text-sm font-bold text-slate-900">
                  Guardians
                  <Input onChange={(event) => updateTarget("guardians", valueAsNumber(event.target.value))} type="number" value={payload.target.guardians} />
                </label>
              </div>
            </div>

            {detectedBlock ? (
              <div className={`rounded-lg border p-4 shadow-sm ${hasOverlapConflict ? "border-red-200 bg-red-50" : "border-teal-200 bg-teal-50"}`}>
                <h2 className={`text-lg font-bold ${hasOverlapConflict ? "text-red-950" : "text-teal-950"}`}>Generated block</h2>
                {hasOverlapConflict ? (
                  <p className="mt-2 rounded-md bg-white p-2 text-sm font-semibold text-red-700">
                    {formatConflict(detectedBlock)} Move or resize the block before saving.
                  </p>
                ) : null}
                <dl className={`mt-3 grid gap-2 text-sm ${hasOverlapConflict ? "text-red-900" : "text-teal-900"}`}>
                  <div className="flex justify-between gap-4">
                    <dt className="font-bold">Block code</dt>
                    <dd>{detectedBlock.blockCode}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="font-bold">Area</dt>
                    <dd>{detectedBlock.areaName}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="font-bold">Center</dt>
                    <dd>{detectedBlock.center.lat}, {detectedBlock.center.lng}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="font-bold">Target</dt>
                    <dd>{detectedBlock.target.watchers} / {detectedBlock.target.truthKeepers} / {detectedBlock.target.guardians}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="font-bold">Current users</dt>
                    <dd>
                      {(detectedBlock.stats?.citizens ?? 0)} citizens / {(detectedBlock.stats?.watchers ?? 0)} watchers /{" "}
                      {(detectedBlock.stats?.truthKeepers ?? 0)} truth keepers / {(detectedBlock.stats?.guardians ?? 0)} guardians
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="font-bold">Rectangle</dt>
                    <dd>{detectedBlock.area.widthKm}km x {detectedBlock.area.heightKm}km</dd>
                  </div>
                </dl>
              </div>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
}
