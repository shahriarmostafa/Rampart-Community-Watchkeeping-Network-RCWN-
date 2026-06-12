"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useAuth } from "@/features/auth/useAuth";

export function AuthRouteGate({ children }: { children: ReactNode }) {
  const { isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/home");
    }
  }, [isLoading, router, user]);

  if (isLoading || user) {
    return null;
  }

  return children;
}
