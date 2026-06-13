"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { AuthLoader } from "@/components/common/authLoader";
import { useAuth } from "@/features/auth/useAuth";

export function AuthRouteGate({ children }: { children: ReactNode }) {
  const { isLoading, user, appUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading || !user) return;
    // New users (no block set) go through onboarding before the home dashboard
    if (!appUser?.block?.blockCode) {
      router.replace("/onboarding");
    } else {
      router.replace("/home");
    }
  }, [isLoading, user, appUser, router]);

  if (isLoading) {
    return <AuthLoader message="Checking your current session..." />;
  }

  if (user) {
    return <AuthLoader message="Setting up your dashboard…" />;
  }

  return children;
}
