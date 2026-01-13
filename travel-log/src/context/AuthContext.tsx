import React, { createContext, useState, useContext } from "react";
import type { ReactNode } from "react";

// 1. Definice typu pro Context
interface AuthContextType {
  isLoggedIn: boolean;
  currentUser: string | null; // username
  login: (username: string) => void;
  logout: () => void;
}

// 2. Vytvoření Contextu
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Provider (obalí celou aplikaci)
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Inicializace stavu z LocalStorage
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const [currentUser, setCurrentUser] = useState<string | null>(
    localStorage.getItem("currentUser")
  );

  const login = (username: string) => {
    // Simulace úspěšného přihlášení
    setIsLoggedIn(true);
    setCurrentUser(username);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", username);
  };

  const logout = () => {
    // Odhlášení
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Custom Hook pro snadné použití
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
