/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "./api.js";

const AuthContext = createContext(null);

const STORAGE_TOKEN_KEY = "token";
const STORAGE_USER_KEY = "user";

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const writeAuth = ({ token, user }) => {
  if (token) localStorage.setItem(STORAGE_TOKEN_KEY, token);
  if (user) localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));

  // backward-compat with existing UI code
  if (token) localStorage.setItem("isLoggedIn", "true");
  if (user?.email) localStorage.setItem("userEmail", user.email);
};

const clearAuthStorage = () => {
  localStorage.removeItem(STORAGE_TOKEN_KEY);
  localStorage.removeItem(STORAGE_USER_KEY);
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userEmail");
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_TOKEN_KEY) || "");
  const [user, setUser] = useState(() => readStoredUser());
  const [isHydrating, setIsHydrating] = useState(true);

  const setAuth = (nextToken, nextUser) => {
    setToken(nextToken || "");
    setUser(nextUser || null);
    if (nextToken) writeAuth({ token: nextToken, user: nextUser });
  };

  const logout = async () => {
    try {
      // best-effort (JWT is stateless; client-side clear is the important part)
      await apiFetch("/api/v1/user/logout", { method: "POST" });
    } catch {
      // ignore
    }
    clearAuthStorage();
    setToken("");
    setUser(null);
  };

  const refreshMe = async (overrideToken) => {
    const t = overrideToken || token;
    if (!t) return null;
    const data = await apiFetch("/api/v1/user/me", { method: "GET", token: t });
    if (data?.success && data.user) {
      setUser(data.user);
      writeAuth({ token: t, user: data.user });
    }
    return data;
  };

  useEffect(() => {
    // on first load: if token exists, refresh user profile
    (async () => {
      try {
        if (token) await refreshMe(token);
      } finally {
        setIsHydrating(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async ({ email, password }) => {
    const data = await apiFetch("/api/v1/user/login", {
      method: "POST",
      body: { email, password },
    });
    if (!data?.success) throw new Error(data?.message || "login failed");
    setAuth(data.token, data.user);
    return data;
  };

  const register = async ({ email, password, firstName, lastName }) => {
    const data = await apiFetch("/api/v1/user/register", {
      method: "POST",
      body: { email, password, firstName, lastName },
    });
    if (!data?.success) throw new Error(data?.message || "registration failed");
    setAuth(data.token, data.user);
    return data;
  };

	const value = {
		token,
		user,
		isHydrating,
		isAuthenticated: Boolean(token),
		isAdmin: user?.role === "admin",
		login,
		register,
		logout,
		refreshMe,
	};

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

