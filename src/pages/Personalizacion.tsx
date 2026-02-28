import { useState } from "react";
import { CustomizationCanvas } from "../components/componentesPersonalizacion/CustomizationCanvas";
import { CustomizationForm } from "../components/componentesPersonalizacion/CustomizationForm";
import { nanoService } from "../services/nanoService";

export const Personalizacion = () => {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [creativity, setCreativity] = useState(75);

  const handleGenerate = async () => {
    if (!image || !prompt.trim()) return;

    try {
      setLoading(true);

      const result = await nanoService.generateImage({
        image,
        prompt,
        aspectRatio,
        creativity,
      });

      setImage(result.generatedImage);
      setPrompt("");
    } catch (error) {
      console.error("Error generando imagen:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadImage = () => {
    if (!image) return;

    const link = document.createElement("a");
    link.href = image;
    link.download = `personalizacion-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareImage = async () => {
    if (!image) return;

    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const file = new File([blob], `personalizacion-${Date.now()}.png`, {
        type: blob.type || "image/png",
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "Mi diseno personalizado",
          text: "Te comparto mi imagen personalizada",
          files: [file],
        });
        return;
      }

      handleDownloadImage();
    } catch (error) {
      console.error("No se pudo compartir la imagen:", error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full bg-zinc-950 text-zinc-100">
      <CustomizationCanvas
        image={image}
        setImage={setImage}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
      />

      <CustomizationForm
        image={image}
        prompt={prompt}
        setPrompt={setPrompt}
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
        creativity={creativity}
        setCreativity={setCreativity}
        onDownload={handleDownloadImage}
        onShare={handleShareImage}
        onGenerate={handleGenerate}
        loading={loading}
      />
    </div>
  );
};
