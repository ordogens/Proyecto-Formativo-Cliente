/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import type {
  AuthActionResult,
  AuthContextType,
  LoginCredentials,
  RegisterData,
  User,
} from "../types/auth.types";
import { authService } from "../services/auth.service";

const AUTH_STORAGE_KEY = "auth_user_session";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

const isValidRole = (role: unknown): role is User["role"] =>
  role === "admin" || role === "user";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNABORTED") {
      return "La solicitud tardo demasiado. Si el usuario se creo, intenta iniciar sesion.";
    }

    const data = error.response?.data as
      | {
          message?: string;
          error?: string;
          mensaje?: string;
          detalle?: string;
          details?: string;
          errors?: string[] | Record<string, string[]>;
        }
      | undefined;

    const directMessage =
      data?.message ??
      data?.mensaje ??
      data?.error ??
      data?.detalle ??
      data?.details;

    if (typeof directMessage === "string" && directMessage.trim()) {
      return directMessage.trim();
    }

    if (Array.isArray(data?.errors) && data.errors.length > 0) {
      const first = data.errors[0];
      if (typeof first === "string" && first.trim()) {
        return first.trim();
      }
    }

    if (data?.errors && typeof data.errors === "object") {
      const firstFieldErrors = Object.values(data.errors)[0];
      if (Array.isArray(firstFieldErrors) && firstFieldErrors[0]) {
        return firstFieldErrors[0];
      }
    }

    if (typeof error.message === "string" && error.message.trim()) {
      return error.message.trim();
    }

    return fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

export const AuthProvider = ({ children }: Props) => {
  // Restaura la sesion guardada para mantener el rol al recargar la pagina.
  const [user, setUser] = useState<User | null>(() => {
    try {
      const persisted = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!persisted) return null;

      const parsedUser = JSON.parse(persisted) as User;

      if (!parsedUser.id || !parsedUser.name || !isValidRole(parsedUser.role)) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        return null;
      }

      return parsedUser;
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
  });

  const login = async ({
    email,
    password,
  }: LoginCredentials): Promise<AuthActionResult> => {
    try {
      const sessionUser = await authService.login({
        email: email.trim().toLowerCase(),
        password,
      });

      setUser(sessionUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser));
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: getErrorMessage(error, "No se pudo iniciar sesion. Intenta de nuevo"),
      };
    }
  };

  const register = async ({
    username,
    email,
    password,
  }: RegisterData): Promise<AuthActionResult> => {
    try {
      const sessionUser = await authService.register({
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      setUser(sessionUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser));
      return { ok: true };
    } catch (error) {
      // Si el registro tardo demasiado, puede haberse creado en backend.
      // Intentamos login automatico para evitar falso negativo en UI.
      if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
        try {
          const sessionUser = await authService.login({
            email: email.trim().toLowerCase(),
            password,
          });

          setUser(sessionUser);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser));
          return { ok: true };
        } catch {
          // Si el login fallback falla, mantenemos mensaje de timeout.
        }
      }

      return {
        ok: false,
        error: getErrorMessage(error, "No se pudo registrar la cuenta. Intenta de nuevo"),
      };
    }
  };

  const loginWithGoogle = async (): Promise<AuthActionResult> => {
    try {
      const sessionUser = await authService.loginWithGoogle();
      setUser(sessionUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser));
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: getErrorMessage(error, "No se pudo iniciar sesion con Google"),
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Si falla el backend, igualmente se limpia la sesion local.
    }

    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
};
