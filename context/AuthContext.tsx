"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { apiFetch } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "ADVISOR";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(
    null
  );

  const [token, setToken] = useState<string | null>(
    null
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken =
      localStorage.getItem("securelife_token");

    if (!savedToken) {
      setLoading(false);
      return;
    }

    const loadUser = async () => {
      try {
        const currentUser = await apiFetch(
          "/auth/me",
          {
            token: savedToken,
          }
        );

        setToken(savedToken);
        setUser(currentUser);
      } catch {
        localStorage.removeItem("securelife_token");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (
    email: string,
    password: string
  ) => {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    localStorage.setItem(
      "securelife_token",
      data.token
    );

    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("securelife_token");

    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}