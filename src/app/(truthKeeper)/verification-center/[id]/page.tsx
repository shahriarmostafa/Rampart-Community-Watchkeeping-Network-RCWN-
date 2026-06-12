import { ReportVerificationView } from "@/view/truthKeeper/reportVerificationView";

export default async function VerificationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ReportVerificationView id={id} />;
}
