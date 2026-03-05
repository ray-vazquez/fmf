import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiClient } from "../api/client";
import { User } from "../api/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (provider: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchCurrentUser() {
    try {
      const { data } = await apiClient.get("/auth/me");
      setUser(data);
    } catch (err) {
      localStorage.removeItem("auth_token");
    } finally {
      setLoading(false);
    }
  }

  async function login(provider: string) {
    // Demo login - in production, redirect to OAuth
    const demoUser = {
      provider: provider.toUpperCase(),
      providerId: `demo_${Date.now()}`,
      email: `demo@${provider}.com`,
      name: `Demo User`,
      avatarUrl: `https://ui-avatars.com/api/?name=Demo+User`,
    };

    const { data } = await apiClient.post("/auth/social", demoUser);
    localStorage.setItem("auth_token", data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("auth_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
