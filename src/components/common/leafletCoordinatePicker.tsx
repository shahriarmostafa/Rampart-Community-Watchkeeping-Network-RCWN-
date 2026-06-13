"use client";

import { useEffect, useRef, useState } from "react";
import { loadLeaflet } from "@/lib/leaflet/loader";
import type { LeafletMap, LeafletMarker } from "@/lib/leaflet/loader";

export function LeafletCoordinatePicker({
  lat,
  lng,
  onChange,
  className = "h-64",
}: {
  lat: number;
  lng: number;
  onChange: (coordinates: { lat: number; lng: number }) => void;
  className?: string;
}) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  const initialCenterRef = useRef({ lat, lng });
  const onChangeRef = useRef(onChange);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let isMounted = true;

    void loadLeaflet()
      .then((leaflet) => {
        if (!isMounted || !mapContainerRef.current || mapRef.current) return;

        const initialCenter = initialCenterRef.current;
        const map = leaflet
          .map(mapContainerRef.current, { scrollWheelZoom: true })
          .setView([initialCenter.lat, initialCenter.lng], 13);

        leaflet
          .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "OpenStreetMap",
            maxZoom: 19,
          })
          .addTo(map);

        markerRef.current = leaflet.marker([initialCenter.lat, initialCenter.lng]).addTo(map);
        map.on("click", (event) => {
          onChangeRef.current({
            lat: Number(event.latlng.lat.toFixed(6)),
            lng: Number(event.latlng.lng.toFixed(6)),
          });
        });
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
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    markerRef.current?.setLatLng([lat, lng]);
    mapRef.current?.setView([lat, lng], 13);
  }, [lat, lng]);

  return (
    <div>
      <div
        className={`${className} w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100`}
        ref={mapContainerRef}
      />
      {message ? <p className="mt-2 text-xs font-semibold text-red-600">{message}</p> : null}
    </div>
  );
}
