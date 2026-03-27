import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CustomizationCanvas } from "../components/componentesPersonalizacion/CustomizationCanvas";
import { CustomizationForm } from "../components/componentesPersonalizacion/CustomizationForm";
import { agentImagesService } from "../services/agentImages.service";
import { catalogService } from "../services/catalog.service";
import { useAuth } from "../context/AuthContext";
import type { ApiProducto } from "../types/api.types";

const TERMS_VERSION = "v1";

export const Personalizacion = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [prompt, setPrompt] = useState("");
  const [lastPrompt, setLastPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [savingImage, setSavingImage] = useState(false);
  const [savedImageId, setSavedImageId] = useState<number | null>(null);
  const [savedImages, setSavedImages] = useState<{ id: number; image_url: string }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ApiProducto | null>(null);
  const [productError, setProductError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const productId = useMemo(() => {
    const rawValue = searchParams.get("productId");
    if (!rawValue) return null;
    const parsed = Number(rawValue);
    return Number.isFinite(parsed) ? parsed : null;
  }, [searchParams]);

  const termsStorageKey = useMemo(() => {
    const userKey = user?.id ? String(user.id) : "anonymous";
    return `agent_terms_acceptance:${TERMS_VERSION}:${userKey}`;
  }, [user?.id]);

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

  useEffect(() => {
    setTermsAccepted(localStorage.getItem(termsStorageKey) === "accepted");
  }, [termsStorageKey]);

  useEffect(() => {
    if (!productId) {
      setSelectedProduct(null);
      setProductError("Abre esta pantalla desde una prenda del catálogo.");
      setImage(null);
      return;
    }

    let mounted = true;

    const loadProduct = async () => {
      try {
        setProductError(null);
        const product = await catalogService.getProductById(productId);
        if (!mounted) return;
        setSelectedProduct(product);
        setImage(product.image_url ?? product.imagen_url ?? null);
      } catch (error) {
        if (!mounted) return;
        console.error("No se pudo cargar la prenda seleccionada:", error);
        setSelectedProduct(null);
        setProductError("No se pudo cargar la prenda seleccionada.");
        setImage(null);
      }
    };

    void loadProduct();

    return () => {
      mounted = false;
    };
  }, [productId]);

  const handleDownloadImage = () => {
    if (!image) return;
    if (!termsAccepted) {
      alert("Debes aceptar los términos antes de descargar una personalización.");
      return;
    }

    const link = document.createElement("a");
    link.href = image;
    link.download = `personalizacion-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  
  const handleSaveImage = async () => {
    if (!image) return;
    if (!termsAccepted) {
      alert("Debes aceptar los términos antes de guardar una personalización.");
      return;
    }
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
        prompt:
          promptToSave ||
          (selectedProduct?.nombre
            ? `Base catálogo: ${selectedProduct.nombre}`
            : null),
        garment_type:
          resolveGarmentType(promptToSave) ??
          resolveGarmentType(selectedProduct?.nombre ?? "") ??
          null,
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

  const handleToggleTerms = (accepted: boolean) => {
    setTermsAccepted(accepted);
    if (accepted) {
      localStorage.setItem(termsStorageKey, "accepted");
      return;
    }
    localStorage.removeItem(termsStorageKey);
  };

const handleShareImage = async () => {
    if (!image) return;
    if (!termsAccepted) {
      alert("Debes aceptar los términos antes de compartir una personalización.");
      return;
    }

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
        allowImageUpload={false}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
        onSave={handleSaveImage}
        saving={savingImage}
        saved={Boolean(savedImageId)}
        savedImages={savedImages}
        onSelectSaved={setImage}
        onDeleteSaved={handleDeleteSaved}
      />

      <div className="flex w-full flex-col lg:w-80">
        {productError && (
          <div className="mx-4 mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
            {productError}
          </div>
        )}
        <CustomizationForm
          image={image}
          prompt={prompt}
          setPrompt={setPrompt}
          productId={productId}
          productName={selectedProduct?.nombre ?? null}
          productDescription={selectedProduct?.descripcion ?? null}
          termsAccepted={termsAccepted}
          onToggleTerms={handleToggleTerms}
          onDownload={handleDownloadImage}
          onShare={handleShareImage}
          onImageGenerated={(url) => {
            setLastPrompt(prompt.trim());
            setImage(url);
          }}
        />
      </div>
    </div>
  );
};
