"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Crosshair, Database, LocateFixed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppHeader } from "@/components/layout/appHeader";
import {
  detectGeoBlock,
  getGeoBlock,
  listGeoBlocks,
  saveGeoBlock,
  updateGeoBlock,
  type DetectGeoBlockPayload,
} from "@/features/geoBlocks/geoBlockService";
import type { GeoBlock, GeoBlockType } from "@/types/geoBlock";

import { loadLeaflet } from "@/lib/leaflet/loader";
import type { LeafletCircleMarker, LeafletMap, LeafletMarker, LeafletRectangle } from "@/lib/leaflet/loader";

const blockColors = ["#2563eb", "#dc2626", "#7c3aed", "#d97706", "#059669", "#be123c", "#0891b2", "#4f46e5"];

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
  displayAddress: "",
  placeName: "",
  neighbourhood: "",
  city: "",
  postcode: "",
  area: { widthKm: 2, heightKm: 3 },
  target: { guardians: 2, truthKeepers: 10, watchers: 40 },
};

type ReverseGeocodeResponse = {
  display_name?: string;
  name?: string;
  address?: {
    neighbourhood?: string;
    suburb?: string;
    quarter?: string;
    city?: string;
    town?: string;
    municipality?: string;
    postcode?: string;
    state?: string;
    county?: string;
    city_district?: string;
  };
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
  if (!block.overlapConflict) return null;
  return `Overlaps ${block.overlapConflict.areaName} / ${block.overlapConflict.blockCode} by ${block.overlapConflict.overlapPercent}%.`;
}

function getAxiosMessage(error: unknown) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || error.message;
  }

  return error instanceof Error ? error.message : "Unexpected error.";
}

function blockToPayload(block: GeoBlock): DetectGeoBlockPayload {
  return {
    lat: block.center.lat,
    lng: block.center.lng,
    areaName: block.areaName,
    displayAddress: block.displayAddress || "",
    placeName: block.placeName || "",
    neighbourhood: block.neighbourhood || "",
    city: block.city || "",
    postcode: block.postcode || "",
    precision: block.precision,
    type: block.type,
    division: block.division || "",
    district: block.district || "",
    upazila: block.upazila || "",
    ward: block.ward || "",
    union: block.union || "",
    area: {
      widthKm: block.area.widthKm,
      heightKm: block.area.heightKm,
    },
    target: block.target,
  };
}


async function reverseGeocode(lat: number, lng: number) {
  const params = new URLSearchParams({
    format: "jsonv2",
    lat: String(lat),
    lon: String(lng),
    zoom: "16",
    addressdetails: "1",
  });
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error("Could not fetch map address.");
  }

  return (await response.json()) as ReverseGeocodeResponse;
}

function GeoBlockEditorView({ blockCode, mode }: { blockCode?: string; mode: "create" | "edit" }) {
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
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const [nudgeStep, setNudgeStep] = useState(0.0005);

  useEffect(() => {
    let isMounted = true;

    void loadLeaflet()
      .then((leaflet) => {
        if (!isMounted || !mapContainerRef.current || mapRef.current) return;

        const map = leaflet.map(mapContainerRef.current, { scrollWheelZoom: true }).setView([payload.lat, payload.lng], 13);
        leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "OpenStreetMap",
          maxZoom: 19,
        }).addTo(map);

        markerRef.current = leaflet.marker([payload.lat, payload.lng]).addTo(map);
        rectangleRef.current = leaflet.rectangle(getRectangleBounds({ lat: payload.lat, lng: payload.lng }, payload.area.widthKm, payload.area.heightKm), {
          color: "#0f766e",
          fillColor: "#14b8a6",
          fillOpacity: 0.16,
          weight: 3,
        }).addTo(map);
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
      .catch((error: unknown) => setMessage(error instanceof Error ? error.message : "Could not load map."));

    return () => {
      isMounted = false;
      mapRef.current?.remove();
      mapRef.current = null;
      setIsMapReady(false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.setTimeout(() => {
      void listGeoBlocks()
        .then((blocks) => setExistingBlocks(blocks.filter((block) => block.isActive !== false && block.blockCode !== blockCode)))
        .catch((error: unknown) => setMessage(getAxiosMessage(error)));

      if (mode === "edit" && blockCode) {
        void getGeoBlock(blockCode)
          .then((block) => {
            setPayload(blockToPayload(block));
            setDetectedBlock(block);
            setMessage(`Editing block ${block.blockCode}.`);
          })
          .catch((error: unknown) => setMessage(getAxiosMessage(error)));
      }
    }, 0);
  }, [blockCode, mode]);

  useEffect(() => {
    if (!isMapReady || !mapRef.current || !window.L) return;
    existingLayerRefs.current.forEach((layer) => layer.remove());
    existingLayerRefs.current = [];

    for (const block of existingBlocks) {
      const color = colorForBlock(block.blockCode);
      existingLayerRefs.current.push(
        window.L.rectangle(block.area.bounds, { color, fillColor: color, fillOpacity: 0.08, weight: 2 }).addTo(mapRef.current),
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
    rectangleRef.current?.setBounds(getRectangleBounds({ lat: payload.lat, lng: payload.lng }, payload.area.widthKm, payload.area.heightKm));
    mapRef.current?.setView([payload.lat, payload.lng], 13);
  }, [payload.area.heightKm, payload.area.widthKm, payload.lat, payload.lng]);

  function updateField<Key extends keyof DetectGeoBlockPayload>(key: Key, value: DetectGeoBlockPayload[Key]) {
    setPayload((current) => ({ ...current, [key]: value }));
    setDetectedBlock(null);
  }

  function updateTarget(key: keyof DetectGeoBlockPayload["target"], value: number) {
    setPayload((current) => ({ ...current, target: { ...current.target, [key]: value } }));
    setDetectedBlock(null);
  }

  function updateArea(key: keyof DetectGeoBlockPayload["area"], value: number) {
    setPayload((current) => ({ ...current, area: { ...current.area, [key]: value } }));
    setDetectedBlock(null);
  }

  function nudge(latDelta: number, lngDelta: number) {
    setPayload((current) => ({
      ...current,
      lat: Number((current.lat + latDelta).toFixed(6)),
      lng: Number((current.lng + lngDelta).toFixed(6)),
    }));
    setDetectedBlock(null);
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

  async function handleFetchAddress() {
    setIsFetchingAddress(true);
    try {
      const data = await reverseGeocode(payload.lat, payload.lng);
      const address = data.address || {};
      setPayload((current) => ({
        ...current,
        displayAddress: data.display_name || current.displayAddress,
        placeName: data.name || address.neighbourhood || address.suburb || address.city_district || current.placeName,
        neighbourhood: address.neighbourhood || address.suburb || address.quarter || current.neighbourhood,
        city: address.city || address.town || address.municipality || current.city,
        postcode: address.postcode || current.postcode,
        areaName: data.name || address.neighbourhood || address.suburb || current.areaName,
      }));
      setDetectedBlock(null);
      setMessage("Map address added. Review and save the block.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not fetch map address.");
    } finally {
      setIsFetchingAddress(false);
    }
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      const saved =
        mode === "edit" && blockCode
          ? await updateGeoBlock(blockCode, { ...payload, center: { lat: payload.lat, lng: payload.lng } })
          : await saveGeoBlock({
              ...payload,
              blockCode: detectedBlock?.blockCode,
              center: { lat: payload.lat, lng: payload.lng },
            });

      setDetectedBlock(saved);
      setExistingBlocks((current) => [saved, ...current.filter((item) => item.blockCode !== saved.blockCode)]);
      setMessage(`${mode === "edit" ? "Updated" : "Saved"} block ${saved.blockCode}.`);
    } catch (error) {
      setMessage(getAxiosMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  const hasOverlapConflict = Boolean(detectedBlock?.hasOverlapConflict);
  const title = mode === "edit" ? "Edit block" : "Add block";

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl px-5 py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-teal-700">Geo admin</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950">{title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Pick, nudge, reverse-label, and save a rectangular RCWN coverage block.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button className="gap-2" onClick={handleDetect} type="button" variant="secondary">
              <Crosshair aria-hidden className="h-4 w-4" />
              Detect
            </Button>
            <Button className="gap-2" disabled={isSaving || hasOverlapConflict} onClick={handleSave} type="button">
              <Database aria-hidden className="h-4 w-4" />
              {isSaving ? "Saving..." : mode === "edit" ? "Update block" : "Save block"}
            </Button>
          </div>
        </div>

        {message ? <p className="mt-5 rounded-lg border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-600">{message}</p> : null}

        <section className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="h-[420px] w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100" ref={mapContainerRef} />
            <div className="mt-4 grid gap-3 rounded-lg bg-slate-50 p-3">
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <span />
                <Button aria-label="Move north" onClick={() => nudge(nudgeStep, 0)} type="button" variant="secondary">
                  <ArrowUp aria-hidden className="h-4 w-4" />
                </Button>
                <span />
                <Button aria-label="Move west" onClick={() => nudge(0, -nudgeStep)} type="button" variant="secondary">
                  <ArrowLeft aria-hidden className="h-4 w-4" />
                </Button>
                <label className="grid gap-1 text-xs font-bold text-slate-600">
                  Nudge step
                  <Input onChange={(event) => setNudgeStep(valueAsNumber(event.target.value))} step="0.0001" type="number" value={nudgeStep} />
                </label>
                <Button aria-label="Move east" onClick={() => nudge(0, nudgeStep)} type="button" variant="secondary">
                  <ArrowRight aria-hidden className="h-4 w-4" />
                </Button>
                <span />
                <Button aria-label="Move south" onClick={() => nudge(-nudgeStep, 0)} type="button" variant="secondary">
                  <ArrowDown aria-hidden className="h-4 w-4" />
                </Button>
                <span />
              </div>
              <p className="text-xs text-slate-500">Existing blocks are colored. Use arrows for precise movement after clicking the map.</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-slate-950">Map address</h2>
                <Button className="gap-2" disabled={isFetchingAddress} onClick={handleFetchAddress} type="button" variant="secondary">
                  <LocateFixed aria-hidden className="h-4 w-4" />
                  {isFetchingAddress ? "Fetching..." : "Fetch map address"}
                </Button>
              </div>
              <div className="mt-4 grid gap-3">
                <Input onChange={(event) => updateField("displayAddress", event.target.value)} placeholder="Display address" value={payload.displayAddress} />
                <div className="grid grid-cols-2 gap-3">
                  <Input onChange={(event) => updateField("placeName", event.target.value)} placeholder="Place name" value={payload.placeName} />
                  <Input onChange={(event) => updateField("neighbourhood", event.target.value)} placeholder="Neighbourhood" value={payload.neighbourhood} />
                  <Input onChange={(event) => updateField("city", event.target.value)} placeholder="City" value={payload.city} />
                  <Input onChange={(event) => updateField("postcode", event.target.value)} placeholder="Postcode" value={payload.postcode} />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-bold text-slate-950">Block details</h2>
              <div className="mt-4 grid gap-3">
                <label className="grid gap-2 text-sm font-bold text-slate-900">
                  Area name
                  <Input onChange={(event) => updateField("areaName", event.target.value)} value={payload.areaName} />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <Input onChange={(event) => updateField("lat", valueAsNumber(event.target.value))} type="number" value={payload.lat} />
                  <Input onChange={(event) => updateField("lng", valueAsNumber(event.target.value))} type="number" value={payload.lng} />
                  <Input onChange={(event) => updateField("precision", valueAsNumber(event.target.value))} type="number" value={payload.precision} />
                  <select
                    className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                    onChange={(event) => updateField("type", event.target.value as GeoBlockType)}
                    value={payload.type}
                  >
                    <option value="urban">Urban</option>
                    <option value="rural">Rural</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input onChange={(event) => updateArea("widthKm", valueAsNumber(event.target.value))} placeholder="Width km" type="number" value={payload.area.widthKm} />
                  <Input onChange={(event) => updateArea("heightKm", valueAsNumber(event.target.value))} placeholder="Height km" type="number" value={payload.area.heightKm} />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-bold text-slate-950">Coverage target</h2>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <Input onChange={(event) => updateTarget("watchers", valueAsNumber(event.target.value))} type="number" value={payload.target.watchers} />
                <Input onChange={(event) => updateTarget("truthKeepers", valueAsNumber(event.target.value))} type="number" value={payload.target.truthKeepers} />
                <Input onChange={(event) => updateTarget("guardians", valueAsNumber(event.target.value))} type="number" value={payload.target.guardians} />
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
                  {[
                    ["Block code", detectedBlock.blockCode],
                    ["Area", detectedBlock.areaName],
                    ["Center", `${detectedBlock.center.lat}, ${detectedBlock.center.lng}`],
                    ["Rectangle", `${detectedBlock.area.widthKm}km x ${detectedBlock.area.heightKm}km`],
                  ].map(([label, value]) => (
                    <div className="flex justify-between gap-4" key={label}>
                      <dt className="font-bold">{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
}

export function AddGeoBlockView() {
  return <GeoBlockEditorView mode="create" />;
}

export function EditGeoBlockView({ blockCode }: { blockCode: string }) {
  return <GeoBlockEditorView blockCode={blockCode} mode="edit" />;
}
