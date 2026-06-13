import { publicApi } from "@/lib/api/publicApi";
import type { GeoBlock, GeoBlockType, ResolveGeoBlockLocationResult } from "@/types/geoBlock";

export type DetectGeoBlockPayload = {
  lat: number;
  lng: number;
  areaName: string;
  displayAddress?: string;
  placeName?: string;
  neighbourhood?: string;
  city?: string;
  postcode?: string;
  precision: number;
  type: GeoBlockType;
  division?: string;
  district?: string;
  upazila?: string;
  ward?: string;
  union?: string;
  area: {
    widthKm: number;
    heightKm: number;
  };
  target: {
    watchers: number;
    truthKeepers: number;
    guardians: number;
  };
};

export async function detectGeoBlock(payload: DetectGeoBlockPayload) {
  const response = await publicApi.post<GeoBlock>("/geo-blocks/detect", payload);
  return response.data;
}

export async function listGeoBlocks() {
  const response = await publicApi.get<{ blocks: GeoBlock[] }>("/geo-blocks");
  return response.data.blocks;
}

export async function getGeoBlock(blockCode: string) {
  const response = await publicApi.get<{ block: GeoBlock }>(`/geo-blocks/${encodeURIComponent(blockCode)}`);
  return response.data.block;
}

export async function saveGeoBlock(payload: DetectGeoBlockPayload & { blockCode?: string; center?: { lat: number; lng: number } }) {
  const response = await publicApi.post<{ block: GeoBlock }>("/geo-blocks", payload);
  return response.data.block;
}

export async function updateGeoBlock(blockCode: string, payload: DetectGeoBlockPayload & { center?: { lat: number; lng: number } }) {
  const response = await publicApi.patch<{ block: GeoBlock }>(`/geo-blocks/${encodeURIComponent(blockCode)}`, payload);
  return response.data.block;
}

export async function resolveGeoBlockLocation(payload: { lat: number; lng: number }) {
  const response = await publicApi.post<ResolveGeoBlockLocationResult>("/geo-blocks/resolve-location", payload);
  return response.data;
}
