"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useAuth } from "@/features/auth/useAuth";

export function ProtectedRouteGate({ children }: { children: ReactNode }) {
  const { isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, router, user]);

  if (isLoading || !user) {
    return null;
  }

  return children;
}
