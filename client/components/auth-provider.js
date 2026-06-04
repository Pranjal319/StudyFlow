"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getUser, updateUser } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = getUser();
    setUser(userData);
    setLoading(false);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      setUser,
      updateUser(updates) {
        const updated = updateUser(updates);
        setUser(updated);
        return updated;
      }
    }),
    [loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
