"use client";

import { useFcm } from "@/features/notifications/useFcm";
import { useAuth } from "@/features/auth/useAuth";

export function FcmInitializer() {
  const { user } = useAuth();
  useFcm(user?.uid);
  return null;
}
