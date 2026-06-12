export type GeoBlockType = "urban" | "rural" | "mixed";

export type GeoBlock = {
  _id?: string;
  blockCode: string;
  precision: number;
  areaName: string;
  division?: string;
  district?: string;
  upazila?: string;
  ward?: string;
  union?: string;
  type: GeoBlockType;
  center: {
    lat: number;
    lng: number;
  };
  area: {
    widthKm: number;
    heightKm: number;
    bounds: [[number, number], [number, number]];
  };
  stats?: {
    citizens: number;
    watchers: number;
    truthKeepers: number;
    guardians: number;
  };
  target: {
    watchers: number;
    truthKeepers: number;
    guardians: number;
  };
  isActive?: boolean;
  isAvailable?: boolean;
};
