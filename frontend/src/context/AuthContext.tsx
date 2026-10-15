import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isRecruiter: boolean;
  isAdmin: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("interviewos_token"));
  const [user, setUser] = useState<User | null>(() => {
    const cached = localStorage.getItem("interviewos_user");
    return cached ? JSON.parse(cached) : null;
  });

  const isRecruiter = user?.roles?.includes("ROLE_RECRUITER") || false;
  const isAdmin = user?.roles?.includes("ROLE_ADMIN") || false;

  const login = async (credentials: { email: string; password: string }) => {
    const authData = await api.auth.login(credentials);
    const u: User = {
      id: authData.userId,
      email: authData.email,
      firstName: authData.firstName,
      lastName: authData.lastName,
      roles: authData.roles || ["ROLE_CANDIDATE"],
    };
    setToken(authData.accessToken);
    setUser(u);
    localStorage.setItem("interviewos_token", authData.accessToken);
    localStorage.setItem("interviewos_user", JSON.stringify(u));
  };

  const register = async (data: any) => {
    const authData = await api.auth.register(data);
    const u: User = {
      id: authData.userId,
      email: authData.email,
      firstName: authData.firstName,
      lastName: authData.lastName,
      roles: authData.roles || ["ROLE_CANDIDATE"],
    };
    setToken(authData.accessToken);
    setUser(u);
    localStorage.setItem("interviewos_token", authData.accessToken);
    localStorage.setItem("interviewos_user", JSON.stringify(u));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("interviewos_token");
    localStorage.removeItem("interviewos_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isRecruiter,
        isAdmin,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
