export type ReportType = "concern" | "missing" | "assault" | "safety";
export type ReportStatus =
  | "submitted"
  | "under_review"
  | "verified_true"
  | "verified_false"
  | "archived";

export type ReportVerification = {
  verifierFirebaseUid: string;
  verifierName?: string;
  verifierRole: "truth_keeper" | "guardian";
  vote: "true" | "false";
  note?: string;
  verifiedAt: string;
};

export type Report = {
  _id: string;
  reporterFirebaseUid: string;
  reporterName?: string;
  type: ReportType;
  category?: string;
  title: string;
  description: string;
  location?: string;
  blockCode?: string;
  status: ReportStatus;
  isAnonymous: boolean;
  evidenceUrls: string[];
  verifications: ReportVerification[];
  trueVotes: number;
  falseVotes: number;
  publishedToFeed: boolean;
  // Missing person extras
  missingPersonName?: string;
  missingPersonAge?: string;
  missingLastSeen?: string;
  missingRelationship?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateReportPayload = {
  reporterFirebaseUid: string;
  reporterName?: string;
  type: ReportType;
  category?: string;
  title: string;
  description: string;
  location?: string;
  blockCode?: string;
  isAnonymous?: boolean;
  missingPersonName?: string;
  missingPersonAge?: string;
  missingLastSeen?: string;
  missingRelationship?: string;
};

export type VerificationVote = {
  verifierFirebaseUid: string;
  verifierName?: string;
  verifierRole: "truth_keeper" | "guardian";
  vote: "true" | "false";
  note?: string;
};
