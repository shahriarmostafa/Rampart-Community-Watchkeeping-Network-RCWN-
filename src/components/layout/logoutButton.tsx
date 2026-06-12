"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { logout } from "@/features/auth/firebaseAuthActions";

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);

    try {
      await logout();
      router.replace("/login");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      aria-label="Log out"
      className="grid h-10 w-10 place-items-center rounded-md bg-white/10 text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={isLoading}
      onClick={handleLogout}
      type="button"
    >
      <LogOut aria-hidden className="h-4 w-4" />
    </button>
  );
}
