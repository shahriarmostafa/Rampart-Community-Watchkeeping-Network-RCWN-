import type { Role } from "@/config/roles";

const roleLabels: Record<Role, string> = {
  citizen: "Citizen",
  watcher: "Watcher",
  truth_keeper: "Truth Keeper",
  guardian: "Guardian",
};

const roleToneClass: Record<Role, string> = {
  citizen: "role-badge--citizen",
  watcher: "role-badge--watcher",
  truth_keeper: "role-badge--truth-keeper",
  guardian: "role-badge--guardian",
};

export function roleLabel(role: Role) {
  return roleLabels[role];
}

export function RoleBadge({
  className = "",
  role,
  size = "sm",
}: {
  className?: string;
  role: Role;
  size?: "xs" | "sm";
}) {
  return (
    <span className={`role-badge role-badge--${size} ${roleToneClass[role]} ${className}`.trim()}>
      {roleLabels[role]}
    </span>
  );
}
