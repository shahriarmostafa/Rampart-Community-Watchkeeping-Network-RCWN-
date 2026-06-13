export type LeafletLatLng = { lat: number; lng: number };

export type LeafletMap = {
  fitBounds: (bounds: [[number, number], [number, number]], options?: { padding?: [number, number] }) => LeafletMap;
  invalidateSize: () => void;
  on: (event: "click", handler: (event: { latlng: LeafletLatLng }) => void) => LeafletMap;
  remove: () => void;
  setView: (center: [number, number], zoom: number) => LeafletMap;
};

export type LeafletMarker = {
  addTo: (map: LeafletMap) => LeafletMarker;
  on?: (event: "click", handler: () => void) => LeafletMarker;
  remove: () => void;
  setLatLng: (center: [number, number]) => LeafletMarker;
};

export type LeafletRectangle = {
  addTo: (map: LeafletMap) => LeafletRectangle;
  bindTooltip?: (content: string) => LeafletRectangle;
  remove: () => void;
  setBounds: (bounds: [[number, number], [number, number]]) => LeafletRectangle;
};

export type LeafletCircleMarker = {
  addTo: (map: LeafletMap) => LeafletCircleMarker;
  remove: () => void;
};

export type LeafletTileLayer = {
  addTo: (map: LeafletMap) => LeafletTileLayer;
};

export type LeafletApi = {
  map: (element: HTMLElement, options?: { scrollWheelZoom?: boolean; dragging?: boolean }) => LeafletMap;
  marker: (center: [number, number], options?: { icon?: unknown }) => LeafletMarker;
  circleMarker: (
    center: [number, number],
    options?: { color?: string; fillColor?: string; fillOpacity?: number; radius?: number; weight?: number },
  ) => LeafletCircleMarker;
  rectangle: (
    bounds: [[number, number], [number, number]],
    options?: { color?: string; fillColor?: string; fillOpacity?: number; weight?: number },
  ) => LeafletRectangle;
  tileLayer: (url: string, options: Record<string, string | number>) => LeafletTileLayer;
  divIcon: (options: {
    className?: string;
    html: string;
    iconAnchor?: [number, number];
    iconSize?: [number, number];
  }) => unknown;
  featureGroup: (layers: (LeafletRectangle | LeafletMarker)[]) => {
    getBounds: () => [[number, number], [number, number]];
  };
};

// Single global Window augmentation — having this in multiple files with different
// local LeafletApi definitions creates conflicting intersections at build time.
declare global {
  interface Window {
    L?: LeafletApi;
    rcwnLeafletPromise?: Promise<LeafletApi>;
  }
}

export function loadLeaflet(): Promise<LeafletApi> {
  if (window.L) return Promise.resolve(window.L);
  if (window.rcwnLeafletPromise) return window.rcwnLeafletPromise;

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
        if (window.L) resolve(window.L);
      });
      existingScript.addEventListener("error", () => reject(new Error("Could not load Leaflet.")));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet/dist/leaflet.js";
    script.onload = () => {
      if (window.L) {
        resolve(window.L);
      } else {
        reject(new Error("Leaflet did not initialize."));
      }
    };
    script.onerror = () => reject(new Error("Could not load Leaflet."));
    document.body.appendChild(script);
  });

  return window.rcwnLeafletPromise;
}
