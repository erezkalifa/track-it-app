import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "../types/types";

interface AuthContextType {
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Temporary mock user for development
const mockUser: User = {
  id: "1",
  email: "dev@example.com",
  name: "Developer",
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // For development, always set as authenticated
  const [user, setUser] = useState<User | null>(mockUser);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    // Commenting out the token check for development
    // const token = localStorage.getItem("token");
    // const savedUser = localStorage.getItem("user");
    // if (token && savedUser) {
    //   setUser(JSON.parse(savedUser));
    //   setIsAuthenticated(true);
    // }
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(mockUser); // For development, reset to mock user instead of null
    setIsAuthenticated(true); // For development, stay authenticated
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
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
