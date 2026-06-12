"use client";

import { useEffect, useRef, useState } from "react";
import type { GeoBlock } from "@/types/geoBlock";

type LeafletMap = {
  fitBounds: (bounds: [[number, number], [number, number]], options?: { padding?: [number, number] }) => LeafletMap;
  invalidateSize: () => void;
  remove: () => void;
};

type LeafletRectangle = {
  addTo: (map: LeafletMap) => LeafletRectangle;
  setBounds: (bounds: [[number, number], [number, number]]) => LeafletRectangle;
};

type LeafletTileLayer = {
  addTo: (map: LeafletMap) => LeafletTileLayer;
};

type LeafletApi = {
  map: (element: HTMLElement, options?: { scrollWheelZoom?: boolean; dragging?: boolean }) => LeafletMap;
  rectangle: (
    bounds: [[number, number], [number, number]],
    options?: { color?: string; fillColor?: string; fillOpacity?: number; weight?: number },
  ) => LeafletRectangle;
  tileLayer: (url: string, options: Record<string, string | number>) => LeafletTileLayer;
};

function getWindowLeaflet() {
  return window as Window & {
    L?: LeafletApi;
    rcwnLeafletPromise?: Promise<LeafletApi>;
  };
}

function loadLeaflet() {
  const leafletWindow = getWindowLeaflet();

  if (leafletWindow.L) {
    return Promise.resolve(leafletWindow.L);
  }

  if (leafletWindow.rcwnLeafletPromise) {
    return leafletWindow.rcwnLeafletPromise;
  }

  leafletWindow.rcwnLeafletPromise = new Promise<LeafletApi>((resolve, reject) => {
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
        if (leafletWindow.L) {
          resolve(leafletWindow.L);
        }
      });
      existingScript.addEventListener("error", () => reject(new Error("Could not load Leaflet.")));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet/dist/leaflet.js";
    script.onload = () => {
      if (leafletWindow.L) {
        resolve(leafletWindow.L);
        return;
      }

      reject(new Error("Leaflet did not initialize."));
    };
    script.onerror = () => reject(new Error("Could not load Leaflet."));
    document.body.appendChild(script);
  });

  return leafletWindow.rcwnLeafletPromise;
}

export function LeafletBlockPreview({ block }: { block: GeoBlock }) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const rectangleRef = useRef<LeafletRectangle | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    void loadLeaflet()
      .then((leaflet) => {
        if (!isMounted || !mapContainerRef.current || mapRef.current) {
          return;
        }

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
