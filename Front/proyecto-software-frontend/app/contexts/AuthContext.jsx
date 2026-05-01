import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authService } from "../services";
import {
  AUTH_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  USER_KEY,
} from "../services/config";

const AuthContext = createContext(null);

const STATUS = {
  LOADING: "loading",
  AUTHENTICATED: "authenticated",
  UNAUTHENTICATED: "unauthenticated",
};

function readStoredUser() {
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [status, setStatus] = useState(STATUS.LOADING);
  const [user, setUser] = useState(null);

  // Hidratar en cliente: durante SSR no existe `window`.
  useEffect(() => {
    const hasToken = window.localStorage.getItem(AUTH_TOKEN_KEY) !== null;
    if (hasToken) {
      setUser(readStoredUser());
      setStatus(STATUS.AUTHENTICATED);
    } else {
      setStatus(STATUS.UNAUTHENTICATED);
    }
  }, []);

  // Sincronización entre pestañas vía `storage` event.
  useEffect(() => {
    const handler = (e) => {
      if (e.key === AUTH_TOKEN_KEY) {
        if (e.newValue) {
          setUser(readStoredUser());
          setStatus(STATUS.AUTHENTICATED);
        } else {
          setStatus(STATUS.UNAUTHENTICATED);
          setUser(null);
        }
      } else if (e.key === USER_KEY) {
        setUser(readStoredUser());
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await authService.login(credentials);
    const auth = data?.data;
    if (!auth?.accessToken) {
      throw new Error("Respuesta inválida del servidor");
    }
    window.localStorage.setItem(AUTH_TOKEN_KEY, auth.accessToken);
    if (auth.refreshToken) {
      window.localStorage.setItem(REFRESH_TOKEN_KEY, auth.refreshToken);
    }
    if (auth.usuario) {
      window.localStorage.setItem(USER_KEY, JSON.stringify(auth.usuario));
    }
    setUser(auth.usuario || null);
    setStatus(STATUS.AUTHENTICATED);
    return auth;
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = window.localStorage.getItem(REFRESH_TOKEN_KEY);
    // Best-effort: si falla la red la sesión local se limpia igual.
    try {
      if (refreshToken) await authService.logout(refreshToken);
    } catch (_) {
      /* swallow */
    }
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
    setUser(null);
    setStatus(STATUS.UNAUTHENTICATED);
  }, []);

  const value = useMemo(
    () => ({
      status,
      user,
      isLoading: status === STATUS.LOADING,
      isAuthenticated: status === STATUS.AUTHENTICATED,
      login,
      logout,
    }),
    [status, user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }
  return ctx;
}
