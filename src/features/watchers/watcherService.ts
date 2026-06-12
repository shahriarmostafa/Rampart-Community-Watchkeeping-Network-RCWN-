import { publicApi } from "@/lib/api/publicApi";

export async function getWatchers() {
  const response = await publicApi.get("/watchers");
  return response.data;
}
