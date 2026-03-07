import { IA_GENERATE_API } from "../config/api";

interface GeneratePayload {
  image: string;
  prompt: string;
  aspectRatio: string;
  creativity: number;
}

export const nanoService = {
  generateImage: async (payload: GeneratePayload) => {
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
