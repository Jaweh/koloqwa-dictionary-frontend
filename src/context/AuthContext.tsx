"use client";
import {
  createContext, useContext, useEffect, useState, useCallback, useRef
} from "react";
import type { AuthUser, AuthTokens } from "@/types/auth";
import { refreshTokens } from "@/lib/auth-api";

interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (tokens: AuthTokens) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  accessToken: null,
  isLoading: true,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

const ACCESS_TOKEN_KEY = "kq_access_token";
const REFRESH_TOKEN_KEY = "kq_refresh_token";
const USER_KEY = "kq_user";
const EXPIRY_KEY = "kq_token_expiry";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimer = useRef<NodeJS.Timeout | null>(null);

  const scheduleRefresh = useCallback((expiryIso: string, refresh: string) => {
    if (refreshTimer.current) clearTimeout(refreshTimer.current);
    const msUntilExpiry = new Date(expiryIso).getTime() - Date.now() - 60_000; // 1 min early
    if (msUntilExpiry <= 0) return;
    refreshTimer.current = setTimeout(async () => {
      try {
        const tokens = await refreshTokens(refresh);
        setAccessToken(tokens.accessToken);
        setUser(tokens.user);
        localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
        localStorage.setItem(USER_KEY, JSON.stringify(tokens.user));
        localStorage.setItem(EXPIRY_KEY, tokens.accessTokenExpiry);
        scheduleRefresh(tokens.accessTokenExpiry, tokens.refreshToken);
      } catch {
        // Refresh failed — log out silently
        logout();
      }
    }, msUntilExpiry);
  }, []);

  const login = useCallback((tokens: AuthTokens) => {
    setUser(tokens.user);
    setAccessToken(tokens.accessToken);
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(tokens.user));
    localStorage.setItem(EXPIRY_KEY, tokens.accessTokenExpiry);
    scheduleRefresh(tokens.accessTokenExpiry, tokens.refreshToken);
  }, [scheduleRefresh]);

  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(EXPIRY_KEY);
    if (refreshTimer.current) clearTimeout(refreshTimer.current);
  }, []);

  // Restore session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    const storedRefresh = localStorage.getItem(REFRESH_TOKEN_KEY);
    const storedExpiry = localStorage.getItem(EXPIRY_KEY);

    if (storedToken && storedUser && storedExpiry) {
      const expiry = new Date(storedExpiry).getTime();
      if (expiry > Date.now()) {
        setAccessToken(storedToken);
        setUser(JSON.parse(storedUser));
        if (storedRefresh) scheduleRefresh(storedExpiry, storedRefresh);
      } else if (storedRefresh) {
        // Token expired — try refresh immediately
        refreshTokens(storedRefresh)
          .then(tokens => login(tokens))
          .catch(() => logout())
          .finally(() => setIsLoading(false));
        return;
      }
    }
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, accessToken, isLoading,
      isAuthenticated: !!user,
      login, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
