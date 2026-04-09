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

export interface SaveGeneratedImagePayload {
  id_user: number;
  image_url: string;
  variant_id?: number | null;
  tipo?: string;
  prompt?: string | null;
  garment_type?: string | null;
}

export interface ReferenceUploadResponse {
  url: string;
}

export type ImageEstado = "pendiente" | "aprobada" | "rechazada";

export interface SavedImageResponse {
  id: number;
  id_user?: number | null;
  image_url: string;
  variant_id?: number | null;
  tipo: string;
  prompt?: string | null;
  garment_type?: string | null;
  estado?: ImageEstado | null;
  precio?: number | string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ApproveImagePayload {
  precio: number;
}

export const agentImagesService = {
  saveGeneratedImage: async (
    payload: SaveGeneratedImagePayload
  ): Promise<SavedImageResponse> => {
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

  getUserImages: async (
    idUser: number,
    estado?: ImageEstado
  ): Promise<SavedImageResponse[]> => {
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

  getPendingImages: async (): Promise<SavedImageResponse[]> => {
    const response = await fetch(`${IA_API}/images/pending`, {
      headers: buildHeaders(),
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "No se pudieron cargar las imágenes pendientes");
    }

    return response.json();
  },

  approveImage: async (
    imageId: number,
    payload: ApproveImagePayload
  ): Promise<SavedImageResponse> => {
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

  rejectImage: async (imageId: number): Promise<SavedImageResponse> => {
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

  deleteUserImage: async (imageId: number, idUser: number): Promise<void> => {
    const response = await fetch(`${IA_API}/images/${imageId}?id_user=${idUser}`, {
      method: "DELETE",
      headers: buildHeaders(),
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "No se pudo eliminar la imagen");
    }
  },

  uploadReferenceImage: async (
    file: File,
    idUser: number
  ): Promise<ReferenceUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("id_user", String(idUser));

    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${IA_API}/images/reference`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "No se pudo subir la referencia.");
    }

    return response.json();
  },
};
