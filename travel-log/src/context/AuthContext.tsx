import React, { createContext, useState, useContext } from "react";
import type { ReactNode } from "react";

// 1. Definice typu pro data uživatele - PŘIDÁNO pole role
interface UserData {
  id: number;
  email: string;
  username: string;
  fullName: string;
  registrationYear: number;
  role: string; // ROLE_USER nebo ROLE_ADMIN
  avatar?: string;
  token?: string; 
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  token: string | null;
  login: (userData: UserData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<UserData | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isAuthenticated = !!token;

  const login = (userData: UserData) => {
    if (userData.token) {
      localStorage.setItem("token", userData.token);
      localStorage.setItem("user", JSON.stringify(userData));
      
      setToken(userData.token);
      setUser(userData);
      
      console.log("Uživatel autentizován s rolí:", userData.role);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout }}>
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