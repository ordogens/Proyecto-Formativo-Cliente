import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import { AUTH_API } from "../config/api";
const AUTH_TOKEN_KEY = "auth_access_token";
const USERS_LOGOUT_PATH = import.meta.env.VITE_USERS_LOGOUT_PATH ?? "/logout";
const usersApi = axios.create({
    baseURL: AUTH_API,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});
const normalizeEmail = (value) => value.trim().toLowerCase();
const saveToken = (token) => {
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
const extractObject = (payload) => {
    if (payload && typeof payload === "object" && !Array.isArray(payload)) {
        return payload;
    }
    return {};
};
const extractUserSource = (payload) => {
    const root = extractObject(payload);
    const directUser = extractObject(root.user);
    const directUsuario = extractObject(root.usuario);
    const nestedData = extractObject(root.data);
    const nestedUser = extractObject(nestedData.user);
    const nestedUsuario = extractObject(nestedData.usuario);
    if (Object.keys(directUser).length > 0)
        return directUser;
    if (Object.keys(directUsuario).length > 0)
        return directUsuario;
    if (Object.keys(nestedUser).length > 0)
        return nestedUser;
    if (Object.keys(nestedUsuario).length > 0)
        return nestedUsuario;
    if (Object.keys(nestedData).length > 0)
        return nestedData;
    return root;
};
const readString = (source, keys) => {
    for (const key of keys) {
        const value = source[key];
        if (typeof value === "string" && value.trim()) {
            return value.trim();
        }
    }
    return "";
};
const readIdAsString = (source, keys) => {
    for (const key of keys) {
        const value = source[key];
        if (typeof value === "string" && value.trim()) {
            return value.trim();
        }
        if (typeof value === "number" && Number.isFinite(value)) {
            return String(value);
        }
    }
    return "";
};
const toRole = (value) => {
    if (typeof value !== "string")
        return null;
    return value.toLowerCase() === "admin" ? "admin" : "user";
};
const toUser = (payload) => {
    const source = extractUserSource(payload);
    const id = readIdAsString(source, ["id", "_id", "usuarioId", "idUsuario", "userId"]) ||
        String(Date.now());
    const name = readString(source, ["name", "nombre", "username", "usuario"]) ||
        "Usuario";
    const roleFromResponse = toRole(source.role) ??
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
    login: async (credentials) => {
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
    register: async (data) => {
        const payload = {
            nombre: data.username.trim(),
            email: normalizeEmail(data.email),
            "contraseña": data.password,
        };
        const response = await usersApi.post("", payload);
        return toUser(response.data);
    },
    loginWithGoogle: async () => {
        // 1. Login con Google usando Firebase popup
        const result = await signInWithPopup(auth, googleProvider);
        const idToken = await result.user.getIdToken();
        // 2. Enviar idToken al backend para verificación
        const response = await usersApi.post("/login/google", { idToken });
        const root = extractObject(response.data);
        saveToken(root.token);
        const sessionUser = toUser(response.data);
        if (sessionUser.name === "Usuario") {
            sessionUser.name = result.user.displayName ?? result.user.email?.split("@")[0] ?? "Usuario";
        }
        return sessionUser;
    },
    me: async () => {
        const response = await usersApi.get("/me");
        return toUser(response.data);
    },
    logout: async () => {
        try {
            await usersApi.post(USERS_LOGOUT_PATH);
        }
        catch {
            try {
                await usersApi.post("/cerrar-sesion");
            }
            catch {
                // No bloquea cierre de sesion local si backend no implementa logout.
            }
        }
        finally {
            clearToken();
        }
    },
    verifyEmail: async (token) => {
        const response = await usersApi.get("/verificar-email", {
            params: { token },
        });
        const root = extractObject(response.data);
        const message = readString(root, ["message", "mensaje", "detalle", "details"]);
        return message || "Correo verificado correctamente";
    },
};
