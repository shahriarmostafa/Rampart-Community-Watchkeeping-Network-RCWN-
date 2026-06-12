import { secureApi } from "@/lib/api/secureApi";
import type { CreateReportPayload, Report, VerificationVote } from "@/types/report";

export async function createReport(payload: CreateReportPayload) {
  const response = await secureApi.post<{ report: Report }>("/reports", payload);
  return response.data.report;
}

export async function getMyReports(firebaseUid: string) {
  const response = await secureApi.get<{ reports: Report[] }>(
    `/reports?firebaseUid=${encodeURIComponent(firebaseUid)}`,
  );
  return response.data.reports;
}

export async function getPendingQueue() {
  const response = await secureApi.get<{ reports: Report[] }>("/reports?queue=1");
  return response.data.reports;
}

export async function getReportDetail(reportId: string) {
  const response = await secureApi.get<{ report: Report }>(`/reports/${reportId}`);
  return response.data.report;
}

export async function submitVerification(reportId: string, vote: VerificationVote) {
  const response = await secureApi.post<{ report: Report }>(
    `/reports/${reportId}/verify`,
    vote,
  );
  return response.data.report;
}

export async function getFeedReports() {
  const response = await secureApi.get<{ reports: Report[] }>("/reports/feed");
  return response.data.reports;
}
