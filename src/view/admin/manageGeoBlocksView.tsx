"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Edit3, MapPinned, Plus, RefreshCcw } from "lucide-react";
import { AppHeader } from "@/components/layout/appHeader";
import { Button } from "@/components/ui/button";
import { loadLeaflet } from "@/lib/leaflet/loader";
import type { LeafletMap, LeafletMarker, LeafletRectangle } from "@/lib/leaflet/loader";
import { listGeoBlocks } from "@/features/geoBlocks/geoBlockService";
import type { GeoBlock } from "@/types/geoBlock";

const blockColors = ["#2563eb", "#dc2626", "#7c3aed", "#d97706", "#059669", "#be123c", "#0891b2", "#4f46e5"];

function colorForBlock(blockCode: string) {
  const index = blockCode.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) % blockColors.length;
  return blockColors[index];
}

function blockLabel(block: GeoBlock) {
  return block.placeName || block.neighbourhood || block.displayAddress || block.areaName || block.blockCode;
}

function topCenter(bounds: [[number, number], [number, number]]) {
  const [[south, west], [north, east]] = bounds;
  return [Math.max(south, north), (west + east) / 2] as [number, number];
}


export function ManageGeoBlocksView() {
  const router = useRouter();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRefs = useRef<(LeafletRectangle | LeafletMarker)[]>([]);
  const [blocks, setBlocks] = useState<GeoBlock[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  async function loadBlocks() {
    try {
      setBlocks((await listGeoBlocks()).filter((block) => block.isActive !== false));
      setMessage(null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load blocks.");
    }
  }

  useEffect(() => {
    let isMounted = true;

    void loadLeaflet()
      .then((leaflet) => {
        if (!isMounted || !mapContainerRef.current || mapRef.current) return;
        const map = leaflet.map(mapContainerRef.current, { scrollWheelZoom: true });
        leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "OpenStreetMap",
          maxZoom: 19,
        }).addTo(map);
        mapRef.current = map;
        setIsMapReady(true);
        window.setTimeout(() => map.invalidateSize(), 0);
      })
      .catch((error: unknown) => setMessage(error instanceof Error ? error.message : "Could not load map."));

    window.setTimeout(() => {
      void loadBlocks();
    }, 0);

    return () => {
      isMounted = false;
      mapRef.current?.remove();
      mapRef.current = null;
      setIsMapReady(false);
    };
  }, []);

  useEffect(() => {
    if (!isMapReady || !mapRef.current || !window.L) return;

    layerRefs.current.forEach((layer) => layer.remove());
    layerRefs.current = [];

    for (const block of blocks) {
      const color = colorForBlock(block.blockCode);
      const rectangle = window.L.rectangle(block.area.bounds, {
        color,
        fillColor: color,
        fillOpacity: 0.12,
        weight: 2,
      }).bindTooltip?.(`${blockLabel(block)} / ${block.blockCode}`) ?? window.L.rectangle(block.area.bounds);
      rectangle.addTo(mapRef.current);

      const editMarker = window.L.marker(topCenter(block.area.bounds), {
        icon: window.L.divIcon({
          className: "",
          html: `<button class="rounded bg-white px-2 py-1 text-xs font-bold text-teal-700 shadow ring-1 ring-teal-200">Edit</button>`,
          iconAnchor: [18, 0],
          iconSize: [44, 24],
        }),
      }).on?.("click", () => router.push(`/admin/geo-blocks/${encodeURIComponent(block.blockCode)}/edit`)) ?? window.L.marker(topCenter(block.area.bounds));
      editMarker.addTo(mapRef.current);

      layerRefs.current.push(rectangle, editMarker);
    }

    if (blocks.length) {
      const rectangles = layerRefs.current.filter((_, index) => index % 2 === 0);
      mapRef.current.fitBounds(window.L.featureGroup(rectangles).getBounds(), { padding: [28, 28] });
    }
  }, [blocks, isMapReady, router]);

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl px-5 py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-teal-700">Geo admin</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950">Manage blocks</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Review all coverage blocks and open the same editor used for adding blocks.
            </p>
          </div>
          <div className="flex gap-2">
            <Button className="gap-2" onClick={loadBlocks} type="button" variant="secondary">
              <RefreshCcw aria-hidden className="h-4 w-4" />
              Refresh
            </Button>
            <Link className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-bold text-white" href="/admin/geo-blocks/add">
              <Plus aria-hidden className="h-4 w-4" />
              Add block
            </Link>
          </div>
        </div>

        {message ? <p className="mt-5 rounded-lg border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-600">{message}</p> : null}

        <section className="mt-6 grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="h-[560px] overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-sm" ref={mapContainerRef} />
          <div className="grid content-start gap-3">
            {blocks.map((block) => (
              <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm" key={block.blockCode}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-bold text-slate-950">{blockLabel(block)}</h2>
                    <p className="mt-1 text-xs text-slate-500">{block.blockCode}</p>
                    <p className="mt-2 text-xs text-slate-600">
                      {(block.stats?.citizens ?? 0)} citizens / {(block.stats?.watchers ?? 0)} watchers
                    </p>
                  </div>
                  <Link className="inline-flex items-center gap-1 text-xs font-bold text-teal-700" href={`/admin/geo-blocks/${encodeURIComponent(block.blockCode)}/edit`}>
                    <Edit3 aria-hidden className="h-3 w-3" />
                    Edit
                  </Link>
                </div>
              </article>
            ))}
            {!blocks.length ? (
              <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">
                <MapPinned aria-hidden className="mb-3 h-5 w-5 text-teal-700" />
                No active blocks found.
              </div>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
}
