import { publicApi } from "@/lib/api/publicApi";
import type { GeoBlock, GeoBlockType } from "@/types/geoBlock";

export type DetectGeoBlockPayload = {
  lat: number;
  lng: number;
  areaName: string;
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

export async function saveGeoBlock(payload: DetectGeoBlockPayload & { blockCode?: string; center?: { lat: number; lng: number } }) {
  const response = await publicApi.post<{ block: GeoBlock }>("/geo-blocks", payload);
  return response.data.block;
}
