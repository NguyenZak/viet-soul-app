"use client";

import { useState, useEffect } from "react";
import { login, register, getCurrentUser } from "../lib/api";

type User = {
  id: string;
  email: string;
  name: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
};

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const savedToken = localStorage.getItem('vietsoul_token');
    if (savedToken) {
      setToken(savedToken);
      getCurrentUser(savedToken)
        .then((userData) => {
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem('vietsoul_token');
          setToken(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [mounted]);

  const handleLogin = async (email: string, password: string) => {
    const response = await login(email, password);
    if (response.token) {
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('vietsoul_token', response.token);
    } else {
      throw new Error(response.error || 'Login failed');
    }
  };

  const handleRegister = async (email: string, password: string, name: string) => {
    const response = await register(email, password, name);
    if (response.token) {
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('vietsoul_token', response.token);
    } else {
      throw new Error(response.error || 'Registration failed');
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('vietsoul_token');
  };

  return {
    user,
    token,
    loading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
}
