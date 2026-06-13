import { EditGeoBlockView } from "@/view/admin/addGeoBlockView";

export default async function EditGeoBlockPage({
  params,
}: {
  params: Promise<{ blockCode: string }>;
}) {
  const { blockCode } = await params;

  return <EditGeoBlockView blockCode={decodeURIComponent(blockCode)} />;
}
