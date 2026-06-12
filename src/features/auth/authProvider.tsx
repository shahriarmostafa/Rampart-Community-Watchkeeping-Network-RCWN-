"use client";

import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useMemo, useState } from "react";
import type { Role } from "@/config/roles";
import { syncAuthenticatedUser } from "@/features/users/userService";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase/client";
import type { AppUser } from "@/types/user";

type AuthContextValue = {
  user: User | null;
  appUser: AppUser | null;
  role: Role;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  appUser: null,
  role: "citizen",
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [role, setRole] = useState<Role>("citizen");
  const [isLoading, setIsLoading] = useState(() => isFirebaseConfigured());

  useEffect(() => {
    const auth = getFirebaseAuth();

    if (!auth) {
      window.setTimeout(() => setIsLoading(false), 0);
      return undefined;
    }

    return onAuthStateChanged(auth, (nextUser) => {
      if (nextUser) {
        setUser(nextUser);
        void syncAuthenticatedUser(nextUser)
          .then((nextAppUser) => {
            setAppUser(nextAppUser);
            setRole(nextAppUser.role);
          })
          .catch(() => undefined)
          .finally(() => setIsLoading(false));
        return;
      }

      setUser(null);
      setAppUser(null);
      setRole("citizen");
      setIsLoading(false);
    });
  }, []);

  const value = useMemo(() => ({ user, appUser, role, isLoading }), [appUser, isLoading, role, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
