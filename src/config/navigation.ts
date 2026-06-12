import type { Role } from "@/config/roles";

export type NavigationItem = {
  label: string;
  href: string;
};

export const publicNavigation: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Mission", href: "/mission" },
  { label: "About", href: "/about" },
  { label: "Safety", href: "/safety" },
  { label: "Privacy", href: "/privacy" },
  { label: "Coverage", href: "/coverage" },
];

export const citizenNavigation: NavigationItem[] = [
  { label: "Home", href: "/home" },
  { label: "Safe Walk", href: "/safe-walk" },
  { label: "Reports", href: "/concerns" },
  { label: "Feed", href: "/feed" },
  { label: "Profile", href: "/profile" },
];

export const watcherNavigation: NavigationItem[] = [
  ...citizenNavigation,
  { label: "Nearby Walks", href: "/nearby-walks" },
];

export const truthKeeperNavigation: NavigationItem[] = [
  ...watcherNavigation,
  { label: "Verification Center", href: "/verification-center" },
  { label: "Review Queue", href: "/review-queue" },
  { label: "Evidence Review", href: "/evidence-review" },
];

export const guardianNavigation: NavigationItem[] = [
  ...truthKeeperNavigation,
  { label: "Guardian Dashboard", href: "/oversight" },
];

export const navigationByRole: Record<Role, NavigationItem[]> = {
  citizen: citizenNavigation,
  watcher: watcherNavigation,
  truth_keeper: truthKeeperNavigation,
  guardian: guardianNavigation,
};

export function getNavigationForRole(role: Role) {
  return navigationByRole[role];
}

export const primaryNavigationByRole: Record<Role, NavigationItem[]> = {
  citizen: [
    { label: "Home", href: "/home" },
    { label: "Walk", href: "/safe-walk" },
    { label: "Reports", href: "/concerns" },
    { label: "Feed", href: "/feed" },
    { label: "Profile", href: "/profile" },
  ],
  watcher: [
    { label: "Home", href: "/home" },
    { label: "Walk", href: "/safe-walk" },
    { label: "Reports", href: "/concerns" },
    { label: "Nearby", href: "/nearby-walks" },
    { label: "Profile", href: "/profile" },
  ],
  truth_keeper: [
    { label: "Home", href: "/home" },
    { label: "Nearby", href: "/nearby-walks" },
    { label: "Verify", href: "/verification-center" },
    { label: "Feed", href: "/feed" },
    { label: "Profile", href: "/profile" },
  ],
  guardian: [
    { label: "Home", href: "/home" },
    { label: "Nearby", href: "/nearby-walks" },
    { label: "Verify", href: "/verification-center" },
    { label: "Guard", href: "/oversight" },
    { label: "Profile", href: "/profile" },
  ],
};

export function getPrimaryNavigationForRole(role: Role) {
  return primaryNavigationByRole[role];
}
