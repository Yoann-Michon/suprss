import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { IUser, UserContextType } from "../interfaces/User.interface";
import { api, checkAuthStatus } from "../services/api.service";

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  async function login(email: string, password: string) {
    try {
      setAuthError(null);
      
      const loginResponse = await api<IUser>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      
      console.log("Login successful:", loginResponse);
      await new Promise(resolve => setTimeout(resolve, 100));
      await refreshUser();
    } catch (error: any) {
      console.error("Login failed:", error);
      setAuthError(error.message);
      throw error;
    }
  }

  async function registerUser(username: string, email: string, password: string) {
    try {
      setAuthError(null);
      
      const registerResponse = await api<IUser>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
      });
      
      console.log("Registration successful:", registerResponse);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      await refreshUser();
      
    } catch (error: any) {
      console.error("Registration failed:", error);
      setAuthError(error.message);
      throw error;
    }
  }

  async function refreshUser() {
    try {
      setAuthError(null);
      const profile = await api<IUser>("/auth/profile");
      console.log("Profile fetched:", profile);
      setUser(profile);
      return profile;
    } catch (error: any) {
      console.log("Failed to fetch profile:", error.message);
      setUser(null);
      setAuthError(error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    try {
      await api("/auth/logout", { method: "POST" });
    } catch (error) {
      console.warn("Logout request failed:", error);
    } finally {
      setUser(null);
      setAuthError(null);
    }
  }

  useEffect(() => {
    const handleAutoLogout = () => {
      console.log("Auto logout triggered");
      setUser(null);
      setAuthError("Session expired");
    };

    window.addEventListener('auth:logout', handleAutoLogout);
    return () => window.removeEventListener('auth:logout', handleAutoLogout);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      console.log("Initializing auth...");
      
      const isAuthenticated = await checkAuthStatus();
      
      if (isAuthenticated) {
        await refreshUser();
      } else {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
    <UserContext.Provider
      value={{ 
        user, 
        setUser, 
        login, 
        registerUser, 
        refreshUser, 
        logout, 
        isLoading,
        authError,
        clearAuthError: () => setAuthError(null)
      }}
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