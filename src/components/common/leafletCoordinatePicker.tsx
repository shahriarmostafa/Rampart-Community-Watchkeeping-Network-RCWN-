"use client";

import { useEffect, useRef, useState } from "react";

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
  setBounds: (bounds: [[number, number], [number, number]]) => LeafletRectangle;
};

type LeafletTileLayer = {
  addTo: (map: LeafletMap) => LeafletTileLayer;
};

type LeafletApi = {
  map: (element: HTMLElement, options?: { scrollWheelZoom?: boolean }) => LeafletMap;
  marker: (center: [number, number]) => LeafletMarker;
  rectangle: (
    bounds: [[number, number], [number, number]],
    options?: { color?: string; fillColor?: string; fillOpacity?: number; weight?: number },
  ) => LeafletRectangle;
  tileLayer: (url: string, options: Record<string, string | number>) => LeafletTileLayer;
};

declare global {
  interface Window {
    L?: LeafletApi;
    rcwnLeafletPromise?: Promise<LeafletApi>;
  }
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
        if (!isMounted || !mapContainerRef.current || mapRef.current) {
          return;
        }

        const initialCenter = initialCenterRef.current;
        const map = leaflet.map(mapContainerRef.current, { scrollWheelZoom: true }).setView([initialCenter.lat, initialCenter.lng], 13);

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
      <div className={`${className} w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100`} ref={mapContainerRef} />
      {message ? <p className="mt-2 text-xs font-semibold text-red-600">{message}</p> : null}
    </div>
  );
}
