import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { IUser, UserContextType } from "../interfaces/User.interface";
import { api } from "../services/api.service";

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function login(email: string, password: string) {
    const u = await api<IUser>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setUser(u);
    await refreshUser();
  }

  async function registerUser(username: string, email: string, password: string) {
    const u = await api<IUser>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    });
    setUser(u);
  }

  async function refreshUser() {
    try {
      const u = await api<IUser>("/auth/profile");
      setUser(u);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    await api("/auth/logout", { method: "POST" });
    setUser(null);
  }

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, setUser, login, registerUser, refreshUser, logout, isLoading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
};
