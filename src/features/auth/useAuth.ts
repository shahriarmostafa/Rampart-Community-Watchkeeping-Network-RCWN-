"use client";

import { useContext } from "react";
import { AuthContext } from "@/features/auth/authProvider";

export function useAuth() {
  return useContext(AuthContext);
}
