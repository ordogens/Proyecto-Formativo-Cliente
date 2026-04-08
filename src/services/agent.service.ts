import { IA_API } from "../config/api";

const AUTH_TOKEN_KEY = "auth_access_token";

const buildHeaders = () => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const readErrorMessage = async (response: Response) => {
  try {
    const data = (await response.json()) as {
      message?: string;
      mensaje?: string;
      detail?:
        | string
        | {
            message?: string;
            mensaje?: string;
            detail?: string;
            detalle?: string;
            error?: string;
            reset_at?: string;
            remaining?: number;
            limit?: number;
          };
      detalle?: string;
      error?: string;
    };
    const detailMessage =
      typeof data.detail === "string" ? data.detail : undefined;

    if (data.detail && typeof data.detail === "object") {
      return (
        data.detail.message ||
        data.detail.mensaje ||
        data.detail.detail ||
        data.detail.detalle ||
        data.detail.error ||
        "Error en el servicio del agente"
      );
    }

    return (
      data.message ||
      data.mensaje ||
      detailMessage ||
      data.detalle ||
      data.error ||
      "Error en el servicio del agente"
    );
  } catch {
    return "Error en el servicio del agente";
  }
};

export interface AgentUsageStatus {
  limite_24h: number;
  usos_restantes: number;
  reset_at: string;
}

export interface AgentSession {
  id: number;
  id_user: number;
  product_id?: number | null;
  product_name?: string | null;
  fecha_inicio: string;
  fecha_fin?: string | null;
  estado: string;
  limite_24h: number;
  usos_restantes: number;
  reset_at: string;
}

export interface AgentMessage {
  id: number;
  tipo: "usuario" | "ia" | string;
  contenido: string;
  timestamp: string;
}

export interface AgentChatResponse {
  sesion_id: number;
  mensaje: string;
  imagenes_generadas?: string[] | null;
  limite_24h: number;
  usos_restantes: number;
  reset_at: string;
}

export interface AgentProductContext {
  productId: number;
  productName?: string | null;
  termsAccepted?: boolean;
}

export const agentService = {
  createSession: async (
    idUser: number,
    productContext?: AgentProductContext
  ): Promise<AgentSession> => {
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
      (error as Error & { status?: number }).status = response.status;
      throw error;
    }

    return response.json();
  },

  getActiveSession: async (idUser: number): Promise<AgentSession> => {
    const response = await fetch(`${IA_API}/chat/session/user/${idUser}`, {
      headers: buildHeaders(),
    });

    if (!response.ok) {
      const message = await readErrorMessage(response);
      const error = new Error(message);
      (error as Error & { status?: number }).status = response.status;
      throw error;
    }

    return response.json();
  },

  getHistory: async (sessionId: number, limit = 12): Promise<AgentMessage[]> => {
    const response = await fetch(
      `${IA_API}/chat/session/${sessionId}/history?limit=${limit}`,
      {
        headers: buildHeaders(),
      }
    );

    if (!response.ok) {
      const message = await readErrorMessage(response);
      const error = new Error(message);
      (error as Error & { status?: number }).status = response.status;
      throw error;
    }

    return response.json();
  },

  sendMessage: async (
    sessionId: number,
    message: string,
    productContext: AgentProductContext
  ): Promise<AgentChatResponse> => {
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
      (error as Error & { status?: number }).status = response.status;
      throw error;
    }

    return response.json();
  },
};
