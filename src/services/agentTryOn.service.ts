import { IA_API } from "../config/api";

const AUTH_TOKEN_KEY = "auth_access_token";

const buildHeaders = () => {
  const headers: Record<string, string> = {};
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const readApiError = async (
  response: Response,
  fallbackMessage: string
) => {
  try {
    const data = await response.json();
    if (typeof data?.detail === "object" && data.detail) {
      return data.detail.message || fallbackMessage;
    }
    return data?.detail || data?.message || fallbackMessage;
  } catch {
    try {
      const text = await response.text();
      return text || `${fallbackMessage} (HTTP ${response.status})`;
    } catch {
      return `${fallbackMessage} (HTTP ${response.status})`;
    }
  }
};

const normalizeTryOnServiceMessage = (message: string) =>
  message
    .replace(/^Error:\s*/i, "")
    .replace(/^(Error al generar try-on:\s*)+/i, "")
    .trim();

export interface UserPhotoResponse {
  id: number;
  id_user: number;
  foto_url: string;
  es_principal: boolean;
  fecha_subida: string;
}

export interface TryOnResponse {
  id: number;
  id_user: number;
  foto_usuario_id: number;
  personalizacion_id?: number | null;
  variant_id?: number | null;
  imagen_resultado_url: string;
  fecha_generacion: string;
  favorito: boolean;
  limite_24h: number;
  usos_restantes: number;
  reset_at: string;
}

export const agentTryOnService = {
  uploadUserPhoto: async (
    file: File,
    idUser: number,
    esPrincipal = true
  ): Promise<UserPhotoResponse> => {
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
      throw new Error(await readApiError(response, "No se pudo subir tu foto."));
    }

    return response.json();
  },

  getUserPhotos: async (idUser: number): Promise<UserPhotoResponse[]> => {
    const response = await fetch(`${IA_API}/images/photos/${idUser}`, {
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error(
        await readApiError(response, "No se pudieron cargar tus fotos.")
      );
    }

    return response.json();
  },

  deleteUserPhoto: async (photoId: number, idUser: number): Promise<void> => {
    const response = await fetch(
      `${IA_API}/images/photo/${photoId}?id_user=${idUser}`,
      {
        method: "DELETE",
        headers: buildHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(await readApiError(response, "No se pudo eliminar la foto."));
    }
  },

  generateTryOn: async (payload: {
    id_user: number;
    foto_usuario_id: number;
    variant_id?: number | null;
    garment_image_url: string;
    garment_description?: string | null;
    garment_category?: string | null;
  }): Promise<TryOnResponse> => {
    const response = await fetch(`${IA_API}/tryon/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...buildHeaders(),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const message = await readApiError(response, "No se pudo generar el try-on.");
      throw new Error(normalizeTryOnServiceMessage(message) || "No se pudo generar el try-on.");
    }

    return response.json();
  },
};
