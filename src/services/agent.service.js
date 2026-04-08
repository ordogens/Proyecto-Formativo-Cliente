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
const readErrorMessage = async (response) => {
    try {
        const data = (await response.json());
        const detailMessage = typeof data.detail === "string" ? data.detail : undefined;
        if (data.detail && typeof data.detail === "object") {
            return (data.detail.message ||
                data.detail.mensaje ||
                data.detail.detail ||
                data.detail.detalle ||
                data.detail.error ||
                "Error en el servicio del agente");
        }
        return (data.message ||
            data.mensaje ||
            detailMessage ||
            data.detalle ||
            data.error ||
            "Error en el servicio del agente");
    }
    catch {
        return "Error en el servicio del agente";
    }
};
export const agentService = {
    createSession: async (idUser, productContext) => {
        const response = await fetch(`${IA_API}/chat/session`, {
            method: "POST",
            headers: buildHeaders(),
            body: JSON.stringify({
                id_user: idUser,
                product_id: productContext?.productId ?? null,
                product_name: productContext?.productName ?? null,
                terms_accepted: productContext?.termsAccepted ?? false,
            }),
        });
        if (!response.ok) {
            const message = await readErrorMessage(response);
            const error = new Error(message);
            error.status = response.status;
            throw error;
        }
        return response.json();
    },
    getActiveSession: async (idUser) => {
        const response = await fetch(`${IA_API}/chat/session/user/${idUser}`, {
            headers: buildHeaders(),
        });
        if (!response.ok) {
            const message = await readErrorMessage(response);
            const error = new Error(message);
            error.status = response.status;
            throw error;
        }
        return response.json();
    },
    getHistory: async (sessionId, limit = 12) => {
        const response = await fetch(`${IA_API}/chat/session/${sessionId}/history?limit=${limit}`, {
            headers: buildHeaders(),
        });
        if (!response.ok) {
            const message = await readErrorMessage(response);
            const error = new Error(message);
            error.status = response.status;
            throw error;
        }
        return response.json();
    },
    sendMessage: async (sessionId, message, productContext) => {
        const response = await fetch(`${IA_API}/chat/session/${sessionId}/message`, {
            method: "POST",
            headers: buildHeaders(),
            body: JSON.stringify({
                mensaje: message,
                product_id: productContext.productId,
                product_name: productContext.productName ?? null,
                terms_accepted: productContext.termsAccepted ?? false,
            }),
        });
        if (!response.ok) {
            const messageText = await readErrorMessage(response);
            const error = new Error(messageText);
            error.status = response.status;
            throw error;
        }
        return response.json();
    },
};
