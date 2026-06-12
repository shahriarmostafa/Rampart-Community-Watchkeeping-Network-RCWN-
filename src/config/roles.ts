export const roles = ["citizen", "watcher", "truth_keeper", "guardian"] as const;
export type Role = (typeof roles)[number];
