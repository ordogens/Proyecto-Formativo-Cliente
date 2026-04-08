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

const readTryOnError = async (response: Response) => {
  try {
    const data = await response.json();
    if (typeof data?.detail === "object" && data.detail) {
      return data.detail.message || "No se pudo generar el try-on";
    }
    return data?.detail || data?.message || "No se pudo generar el try-on";
  } catch {
    return "No se pudo generar el try-on";
  }
};

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
      throw new Error(await readTryOnError(response));
    }

    return response.json();
  },

  getUserPhotos: async (idUser: number): Promise<UserPhotoResponse[]> => {
    const response = await fetch(`${IA_API}/images/photos/${idUser}`, {
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error(await readTryOnError(response));
    }

    return response.json();
  },

  generateTryOn: async (payload: {
    id_user: number;
    foto_usuario_id: number;
    variant_id?: number | null;
    garment_image_url: string;
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
      throw new Error(await readTryOnError(response));
    }

    return response.json();
  },
};
