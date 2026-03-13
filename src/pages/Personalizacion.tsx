import { useEffect, useState } from "react";
import { CustomizationCanvas } from "../components/componentesPersonalizacion/CustomizationCanvas";
import { CustomizationForm } from "../components/componentesPersonalizacion/CustomizationForm";
import { nanoService } from "../services/nanoService";
import { agentImagesService } from "../services/agentImages.service";
import { useAuth } from "../context/AuthContext";

export const Personalizacion = () => {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [lastPrompt, setLastPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [creativity, setCreativity] = useState(75);
  const [savingImage, setSavingImage] = useState(false);
  const [savedImageId, setSavedImageId] = useState<number | null>(null);
  const [savedImages, setSavedImages] = useState<{ id: number; image_url: string }[]>([]);

  const resolveGarmentType = (value: string) => {
    const normalized = value.trim().toLowerCase();
    if (!normalized) return null;
    if (normalized.includes("pantalon") || normalized.includes("pantalón")) return "pantalon";
    if (normalized.includes("camiseta") || normalized.includes("camisa") || normalized.includes("blusa")) return "camiseta";
    if (normalized.includes("gorro") || normalized.includes("gorra")) return "gorro";
    return null;
  };

  const loadSavedImages = async () => {
    const userId = user?.id ? Number(user.id) : null;
    if (!userId || Number.isNaN(userId)) return;
    try {
      const images = await agentImagesService.getUserImages(userId);
      setSavedImages(images.map((img) => ({ id: img.id, image_url: img.image_url })));
    } catch (error) {
      console.error("No se pudieron cargar las imágenes guardadas:", error);
    }
  };


  useEffect(() => {
    setSavedImageId(null);
  }, [image]);

  useEffect(() => {
    void loadSavedImages();
  }, [user?.id]);
  


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

      setLastPrompt(prompt);
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

  
  const handleSaveImage = async () => {
    if (!image) return;
    const userId = user?.id ? Number(user.id) : null;
    if (!userId || Number.isNaN(userId)) {
      alert("Debes iniciar sesión para guardar la imagen.");
      return;
    }

    try {
      setSavingImage(true);
      const promptToSave = prompt.trim() || lastPrompt.trim();
      const saved = await agentImagesService.saveGeneratedImage({
        id_user: userId,
        image_url: image,
        tipo: "usuario_diseño",
        prompt: promptToSave || null,
        garment_type: resolveGarmentType(promptToSave) ?? null,
      });
      setSavedImageId(saved.id);
      await loadSavedImages();
    } catch (error) {
      console.error("No se pudo guardar la imagen:", error);
      alert("No se pudo guardar la imagen.");
    } finally {
      setSavingImage(false);
    }
  };

  
  const handleDeleteSaved = async (imageId: number) => {
    const userId = user?.id ? Number(user.id) : null;
    if (!userId || Number.isNaN(userId)) return;
    try {
      await agentImagesService.deleteUserImage(imageId, userId);
      setSavedImages((prev) => prev.filter((img) => img.id !== imageId));
      if (savedImageId === imageId) setSavedImageId(null);
    } catch (error) {
      console.error("No se pudo eliminar la imagen guardada:", error);
      alert("No se pudo eliminar la imagen guardada.");
    }
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
    <div className="flex flex-col lg:flex-row h-full bg-[#f3f0eb] dark:bg-gray-900 text-zinc-100">
      <CustomizationCanvas
        image={image}
        setImage={setImage}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
        onSave={handleSaveImage}
        saving={savingImage}
        saved={Boolean(savedImageId)}
        savedImages={savedImages}
        onSelectSaved={setImage}
        onDeleteSaved={handleDeleteSaved}
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
        onImageGenerated={setImage}
        loading={loading}
      />
    </div>
  );
};
