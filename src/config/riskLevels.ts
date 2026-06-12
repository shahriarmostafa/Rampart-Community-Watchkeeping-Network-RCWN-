export const riskLevels = ["safe", "uncomfortable", "scared", "danger"] as const;
export type RiskLevel = (typeof riskLevels)[number];
