import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "../types/types";

interface AuthContextType {
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  isGuest: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // First check sessionStorage for guest user
    const sessionToken = sessionStorage.getItem("token");
    const isGuestUser = sessionStorage.getItem("isGuest") === "true";

    if (sessionToken && isGuestUser) {
      // Guest user found in session
      const savedUser = sessionStorage.getItem("user");
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
          setIsGuest(true);
        } catch (error) {
          console.error("Failed to parse guest user data:", error);
          sessionStorage.clear();
        }
      }
    } else {
      // Check localStorage for regular user
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");
      if (token && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
          setIsGuest(false);
        } catch (error) {
          console.error("Failed to parse user data:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, user: User) => {
    const isGuestUser =
      user.is_guest || sessionStorage.getItem("isGuest") === "true";

    if (isGuestUser) {
      // Store guest data in sessionStorage
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("isGuest", "true");
      setIsGuest(true);
    } else {
      // Store regular user data in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setIsGuest(false);
    }

    setUser(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Clear both storages to be safe
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();

    setUser(null);
    setIsAuthenticated(false);
    setIsGuest(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated, isLoading, isGuest }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
