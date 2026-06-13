export type RiskLevel = "safe" | "uncomfortable" | "scared" | "danger";

export type SafeWalkShareWith = {
  circle: boolean;
  watchers: boolean;
  femaleOnly: boolean;
};

export type SafeWalkStatus = "active" | "completed" | "cancelled";

export type SafeWalkSession = {
  _id: string;
  firebaseUid: string;
  userName?: string;
  status: SafeWalkStatus;
  riskLevel: RiskLevel;
  peakRiskLevel?: RiskLevel;
  startAddress?: string;
  destinationAddress?: string;
  blockCode?: string;
  blockCodes: string[];
  inOverlap?: boolean;
  location?: { lat: number; lng: number };
  shareWith: SafeWalkShareWith;
  startedAt: string;
  endedAt?: string;
  durationMinutes?: number;
};

// Stripped version watchers receive for safe/uncomfortable sessions
export type SafeWalkSessionPublic = {
  _id: string;
  status: SafeWalkStatus;
  riskLevel: RiskLevel;
  blockCode?: string;
  blockCodes: string[];
  inOverlap: boolean;
  startedAt: string;
  userName?: string;
  location?: { lat: number; lng: number };
  shareWith: { femaleOnly: boolean };
};
