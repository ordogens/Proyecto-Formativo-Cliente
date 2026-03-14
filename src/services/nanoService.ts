import { IA_GENERATE_API } from "../config/api";

interface GeneratePayload {
  image?: string | null;
  prompt: string;
  aspectRatio: string;
  creativity: number;
}

interface GenerateResponse {
  message: string;
  url?: string;
  imageUrl?: string;
  generatedImage?: string;
  data?: {
    url?: string;
    imageUrl?: string;
    generatedImage?: string;
    aspectRatio?: string;
    creativity?: number;
  };
}

export const nanoService = {
  generateImage: async (payload: GeneratePayload): Promise<GenerateResponse> => {
    const response = await fetch(IA_GENERATE_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Error en la generación");
    }

    return response.json();
  },
};
