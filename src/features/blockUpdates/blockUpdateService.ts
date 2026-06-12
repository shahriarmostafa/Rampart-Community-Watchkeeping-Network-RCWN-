import { secureApi } from "@/lib/api/secureApi";
import type { BlockUpdate, CreateBlockUpdatePayload } from "@/types/blockUpdate";

export async function getBlockUpdates(blockCode: string) {
  const response = await secureApi.get<{ updates: BlockUpdate[] }>(
    `/block-updates?blockCode=${encodeURIComponent(blockCode)}`,
  );
  return response.data.updates;
}

export async function createBlockUpdate(payload: CreateBlockUpdatePayload) {
  const response = await secureApi.post<{ update: BlockUpdate }>("/block-updates", payload);
  return response.data.update;
}
