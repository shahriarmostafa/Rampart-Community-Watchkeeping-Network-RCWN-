import { ConcernDetailView } from "@/view/concerns/concernDetailView";

export default async function ConcernDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ConcernDetailView id={id} />;
}
