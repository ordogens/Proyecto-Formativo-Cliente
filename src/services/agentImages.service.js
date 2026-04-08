import { IA_API } from "../config/api";
const AUTH_TOKEN_KEY = "auth_access_token";
const buildHeaders = () => {
    const headers = {
        "Content-Type": "application/json",
    };
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    return headers;
};
export const agentImagesService = {
    saveGeneratedImage: async (payload) => {
        const response = await fetch(`${IA_API}/images/save`, {
            method: "POST",
            headers: buildHeaders(),
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            const message = await response.text();
            throw new Error(message || "No se pudo guardar la imagen");
        }
        return response.json();
    },
    getUserImages: async (idUser, estado) => {
        const query = estado ? `?estado=${encodeURIComponent(estado)}` : "";
        const response = await fetch(`${IA_API}/images/user/${idUser}${query}`, {
            headers: buildHeaders(),
        });
        if (!response.ok) {
            const message = await response.text();
            throw new Error(message || "No se pudieron cargar las imágenes");
        }
        return response.json();
    },
    getPendingImages: async () => {
        const response = await fetch(`${IA_API}/images/pending`, {
            headers: buildHeaders(),
        });
        if (!response.ok) {
            const message = await response.text();
            throw new Error(message || "No se pudieron cargar las imágenes pendientes");
        }
        return response.json();
    },
    approveImage: async (imageId, payload) => {
        const response = await fetch(`${IA_API}/images/${imageId}/approve`, {
            method: "PATCH",
            headers: buildHeaders(),
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            const message = await response.text();
            throw new Error(message || "No se pudo aprobar la imagen");
        }
        return response.json();
    },
    rejectImage: async (imageId) => {
        const response = await fetch(`${IA_API}/images/${imageId}/reject`, {
            method: "PATCH",
            headers: buildHeaders(),
        });
        if (!response.ok) {
            const message = await response.text();
            throw new Error(message || "No se pudo rechazar la imagen");
        }
        return response.json();
    },
    deleteUserImage: async (imageId, idUser) => {
        const response = await fetch(`${IA_API}/images/${imageId}?id_user=${idUser}`, {
            method: "DELETE",
            headers: buildHeaders(),
        });
        if (!response.ok) {
            const message = await response.text();
            throw new Error(message || "No se pudo eliminar la imagen");
        }
    },
};
