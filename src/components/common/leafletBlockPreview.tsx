"use client";

import { useEffect, useRef, useState } from "react";
import { loadLeaflet } from "@/lib/leaflet/loader";
import type { LeafletMap, LeafletRectangle } from "@/lib/leaflet/loader";
import type { GeoBlock } from "@/types/geoBlock";

export function LeafletBlockPreview({ block }: { block: GeoBlock }) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const rectangleRef = useRef<LeafletRectangle | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    void loadLeaflet()
      .then((leaflet) => {
        if (!isMounted || !mapContainerRef.current || mapRef.current) return;

        const map = leaflet.map(mapContainerRef.current, { dragging: false, scrollWheelZoom: false });
        leaflet
          .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "OpenStreetMap",
            maxZoom: 19,
          })
          .addTo(map);

        rectangleRef.current = leaflet
          .rectangle(block.area.bounds, {
            color: "#0f766e",
            fillColor: "#14b8a6",
            fillOpacity: 0.18,
            weight: 2,
          })
          .addTo(map);
        map.fitBounds(block.area.bounds, { padding: [18, 18] });
        mapRef.current = map;
        window.setTimeout(() => map.invalidateSize(), 0);
      })
      .catch((error: unknown) => {
        setMessage(error instanceof Error ? error.message : "Could not load map.");
      });

    return () => {
      isMounted = false;
      mapRef.current?.remove();
      mapRef.current = null;
      rectangleRef.current = null;
    };
  }, [block.area.bounds]);

  useEffect(() => {
    rectangleRef.current?.setBounds(block.area.bounds);
    mapRef.current?.fitBounds(block.area.bounds, { padding: [18, 18] });
  }, [block.area.bounds]);

  return (
    <div>
      <div className="h-56 w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100" ref={mapContainerRef} />
      {message ? <p className="mt-2 text-xs font-semibold text-red-600">{message}</p> : null}
    </div>
  );
}
