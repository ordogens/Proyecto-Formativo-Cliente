import axios from "axios";
import type { LoginCredentials, RegisterData, Role, User } from "../types/auth.types";

const AUTH_TOKEN_KEY = "auth_access_token";

const USERS_API_URL =
  import.meta.env.VITE_USERS_API_URL ??
  "http://localhost:8080/v1/usuarios/login";
const USERS_LOGOUT_PATH = import.meta.env.VITE_USERS_LOGOUT_PATH ?? "/logout";

const usersApi = axios.create({
  baseURL: USERS_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

const normalizeEmail = (value: string) => value.trim().toLowerCase();

const saveToken = (token: unknown) => {
  if (typeof token === "string" && token.trim()) {
    localStorage.setItem(AUTH_TOKEN_KEY, token.trim());
  }
};

const getToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

const clearToken = () => localStorage.removeItem(AUTH_TOKEN_KEY);

usersApi.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const extractObject = (payload: unknown): Record<string, unknown> => {
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    return payload as Record<string, unknown>;
  }

  return {};
};

const extractUserSource = (payload: unknown): Record<string, unknown> => {
  const root = extractObject(payload);
  const directUser = extractObject(root.user);
  const nestedData = extractObject(root.data);
  const nestedUser = extractObject(nestedData.user);

  if (Object.keys(directUser).length > 0) return directUser;
  if (Object.keys(nestedUser).length > 0) return nestedUser;
  if (Object.keys(nestedData).length > 0) return nestedData;
  return root;
};

const readString = (source: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
};

const toRole = (value: unknown): Role | null => {
  if (typeof value !== "string") return null;
  return value.toLowerCase() === "admin" ? "admin" : "user";
};

const toUser = (payload: unknown): User => {
  const source = extractUserSource(payload);

  const id =
    readString(source, ["id", "_id", "usuarioId"]) ||
    String(Date.now());

  const name =
    readString(source, ["name", "nombre", "username", "usuario"]) ||
    "Usuario";

  const roleFromResponse =
    toRole(source.role) ??
    toRole(source.rol) ??
    toRole(source.tipoRol) ??
    toRole(source.tipoUsuario);

  return {
    id,
    name,
    role: roleFromResponse ?? "user",
  };
};

export const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    const normalizedEmail = normalizeEmail(credentials.email);

    const response = await usersApi.post("/login", {
      email: normalizedEmail,
      "contraseña": credentials.password,
    });

    const root = extractObject(response.data);
    saveToken(root.token);

    const sessionUser = toUser(response.data);
    if (sessionUser.name === "Usuario") {
      sessionUser.name = normalizedEmail.split("@")[0] || "Usuario";
    }

    return sessionUser;
  },

  register: async (data: RegisterData): Promise<User> => {
    const payload = {
      nombre: data.username.trim(),
      email: normalizeEmail(data.email),
      "contraseña": data.password,
    };

    const response = await usersApi.post("", payload);
    return toUser(response.data);
  },

  me: async (): Promise<User> => {
    const response = await usersApi.get("/me");
    return toUser(response.data);
  },

  logout: async (): Promise<void> => {
    try {
      await usersApi.post(USERS_LOGOUT_PATH);
    } catch {
      try {
        await usersApi.post("/cerrar-sesion");
      } catch {
        // No bloquea cierre de sesion local si backend no implementa logout.
      }
    } finally {
      clearToken();
    }
  },
};
