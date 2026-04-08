import { IA_API } from "../config/api";
const AUTH_TOKEN_KEY = "auth_access_token";
const buildHeaders = () => {
    const headers = {};
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    return headers;
};
const readTryOnError = async (response) => {
    try {
        const data = await response.json();
        if (typeof data?.detail === "object" && data.detail) {
            return data.detail.message || "No se pudo generar el try-on";
        }
        return data?.detail || data?.message || "No se pudo generar el try-on";
    }
    catch {
        return "No se pudo generar el try-on";
    }
};
export const agentTryOnService = {
    uploadUserPhoto: async (file, idUser, esPrincipal = true) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("id_user", String(idUser));
        formData.append("es_principal", String(esPrincipal));
        const response = await fetch(`${IA_API}/images/photo`, {
            method: "POST",
            headers: buildHeaders(),
            body: formData,
        });
        if (!response.ok) {
            throw new Error(await readTryOnError(response));
        }
        return response.json();
    },
    getUserPhotos: async (idUser) => {
        const response = await fetch(`${IA_API}/images/photos/${idUser}`, {
            headers: buildHeaders(),
        });
        if (!response.ok) {
            throw new Error(await readTryOnError(response));
        }
        return response.json();
    },
    generateTryOn: async (payload) => {
        const response = await fetch(`${IA_API}/tryon/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...buildHeaders(),
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            throw new Error(await readTryOnError(response));
        }
        return response.json();
    },
};
