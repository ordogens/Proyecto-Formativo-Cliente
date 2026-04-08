import { jsx as _jsx } from "react/jsx-runtime";
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import axios from "axios";
import { authService } from "../services/auth.service";
const AUTH_STORAGE_KEY = "auth_user_session";
const AuthContext = createContext(undefined);
const isValidRole = (role) => role === "admin" || role === "user";
const getErrorMessage = (error, fallback) => {
    if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
            return "La solicitud tardo demasiado. Si el usuario se creo, intenta iniciar sesion.";
        }
        const data = error.response?.data;
        const directMessage = data?.message ??
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
export const AuthProvider = ({ children }) => {
    // Restaura la sesion guardada para mantener el rol al recargar la pagina.
    const [user, setUser] = useState(() => {
        try {
            const persisted = localStorage.getItem(AUTH_STORAGE_KEY);
            if (!persisted)
                return null;
            const parsedUser = JSON.parse(persisted);
            if (!parsedUser.id || !parsedUser.name || !isValidRole(parsedUser.role)) {
                localStorage.removeItem(AUTH_STORAGE_KEY);
                return null;
            }
            return parsedUser;
        }
        catch {
            localStorage.removeItem(AUTH_STORAGE_KEY);
            return null;
        }
    });
    const login = async ({ email, password, }) => {
        try {
            const sessionUser = await authService.login({
                email: email.trim().toLowerCase(),
                password,
            });
            setUser(sessionUser);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser));
            return { ok: true };
        }
        catch (error) {
            return {
                ok: false,
                error: getErrorMessage(error, "No se pudo iniciar sesion. Intenta de nuevo"),
            };
        }
    };
    const register = async ({ username, email, password, }) => {
        try {
            const sessionUser = await authService.register({
                username: username.trim(),
                email: email.trim().toLowerCase(),
                password,
            });
            setUser(sessionUser);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser));
            return { ok: true };
        }
        catch (error) {
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
                }
                catch {
                    // Si el login fallback falla, mantenemos mensaje de timeout.
                }
            }
            return {
                ok: false,
                error: getErrorMessage(error, "No se pudo registrar la cuenta. Intenta de nuevo"),
            };
        }
    };
    const loginWithGoogle = async () => {
        try {
            const sessionUser = await authService.loginWithGoogle();
            setUser(sessionUser);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser));
            return { ok: true };
        }
        catch (error) {
            return {
                ok: false,
                error: getErrorMessage(error, "No se pudo iniciar sesion con Google"),
            };
        }
    };
    const logout = async () => {
        try {
            await authService.logout();
        }
        catch {
            // Si falla el backend, igualmente se limpia la sesion local.
        }
        setUser(null);
        localStorage.removeItem(AUTH_STORAGE_KEY);
    };
    return (_jsx(AuthContext.Provider, { value: { user, login, loginWithGoogle, register, logout }, children: children }));
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de AuthProvider");
    }
    return context;
};
