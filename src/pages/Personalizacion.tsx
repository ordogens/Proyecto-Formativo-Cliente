import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CustomizationCanvas } from "../components/componentesPersonalizacion/CustomizationCanvas";
import { CustomizationForm } from "../components/componentesPersonalizacion/CustomizationForm";
import { agentImagesService } from "../services/agentImages.service";
import { agentTryOnService, type UserPhotoResponse } from "../services/agentTryOn.service";
import { catalogService } from "../services/catalog.service";
import { useAuth } from "../context/AuthContext";
import type { ApiProducto } from "../types/api.types";

const TERMS_VERSION = "v1";
const isInvalidTryOnResultUrl = (value: string | null | undefined) => {
  if (!value) return true;

  try {
    const parsed = new URL(value);
    return parsed.hostname.includes("placeholder.com");
  } catch {
    return true;
  }
};

const normalizeTryOnErrorMessage = (error: unknown) => {
  const fallback = "No se pudo generar el try-on.";
  const rawMessage =
    error instanceof Error && error.message ? error.message : fallback;

  const cleanedMessage = rawMessage
    .replace(/^Error:\s*/i, "")
    .replace(/^(Error al generar try-on:\s*)+/i, "")
    .trim();

  return cleanedMessage || fallback;
};

const resolveTryOnGarmentCategory = (value: string | null | undefined) => {
  const normalized = (value || "").trim().toLowerCase();
  if (!normalized) return "upper_body";

  if (
    normalized.includes("pantalon") ||
    normalized.includes("pantalón") ||
    normalized.includes("falda") ||
    normalized.includes("short") ||
    normalized.includes("bermuda")
  ) {
    return "lower_body";
  }

  if (
    normalized.includes("vestido") ||
    normalized.includes("enterizo") ||
    normalized.includes("overall")
  ) {
    return "dresses";
  }

  return "upper_body";
};

export const Personalizacion = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [prompt, setPrompt] = useState("");
  const [lastPrompt, setLastPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [tryOnPreviewImage, setTryOnPreviewImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [savingImage, setSavingImage] = useState(false);
  const [savedImageId, setSavedImageId] = useState<number | null>(null);
  const [savedImages, setSavedImages] = useState<{ id: number; image_url: string }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ApiProducto | null>(null);
  const [productError, setProductError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [userPhotos, setUserPhotos] = useState<UserPhotoResponse[]>([]);
  const [selectedUserPhotoId, setSelectedUserPhotoId] = useState<number | null>(null);
  const [tryOnLoading, setTryOnLoading] = useState(false);
  const [tryOnError, setTryOnError] = useState<string | null>(null);
  const [deletingUserPhotoId, setDeletingUserPhotoId] = useState<number | null>(null);
  const previewImage = tryOnPreviewImage ?? image;

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

  const loadUserPhotos = async () => {
    const userId = user?.id ? Number(user.id) : null;
    if (!userId || Number.isNaN(userId)) return;
    try {
      const photos = await agentTryOnService.getUserPhotos(userId);
      setUserPhotos(photos);
      const preferredPhoto = photos.find((photo) => photo.es_principal) ?? photos[0] ?? null;
      setSelectedUserPhotoId(preferredPhoto?.id ?? null);
    } catch (error) {
      console.error("No se pudieron cargar las fotos del usuario:", error);
    }
  };


  useEffect(() => {
    setSavedImageId(null);
  }, [image]);

  useEffect(() => {
    void loadSavedImages();
  }, [user?.id]);

  useEffect(() => {
    void loadUserPhotos();
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
        setTryOnPreviewImage(null);
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

  const handleUploadUserPhoto = async (file: File) => {
    const userId = user?.id ? Number(user.id) : null;
    if (!userId || Number.isNaN(userId)) {
      alert("Debes iniciar sesión para subir tu foto.");
      return;
    }

    try {
      setTryOnError(null);
      const savedPhoto = await agentTryOnService.uploadUserPhoto(file, userId, true);
      setUserPhotos((prev) => [savedPhoto, ...prev.filter((photo) => photo.id !== savedPhoto.id)]);
      setSelectedUserPhotoId(savedPhoto.id);
    } catch (error) {
      console.error("No se pudo subir la foto del usuario:", error);
      setTryOnError((error as Error).message || "No se pudo subir tu foto.");
    }
  };

  const handleDeleteUserPhoto = async (photoId: number) => {
    const userId = user?.id ? Number(user.id) : null;
    if (!userId || Number.isNaN(userId)) {
      alert("Debes iniciar sesión para eliminar tu foto.");
      return;
    }

    const confirmed = window.confirm("¿Quieres eliminar esta foto?");
    if (!confirmed) return;

    try {
      setDeletingUserPhotoId(photoId);
      setTryOnError(null);
      await agentTryOnService.deleteUserPhoto(photoId, userId);
      const remainingPhotos = userPhotos.filter((photo) => photo.id !== photoId);
      setUserPhotos(remainingPhotos);
      if (selectedUserPhotoId === photoId) {
        const preferredPhoto =
          remainingPhotos.find((photo) => photo.es_principal) ?? remainingPhotos[0] ?? null;
        setSelectedUserPhotoId(preferredPhoto?.id ?? null);
      }
    } catch (error) {
      console.error("No se pudo eliminar la foto del usuario:", error);
      setTryOnError((error as Error).message || "No se pudo eliminar tu foto.");
    } finally {
      setDeletingUserPhotoId(null);
    }
  };

  const handleGenerateTryOn = async () => {
    const userId = user?.id ? Number(user.id) : null;
    if (!userId || Number.isNaN(userId)) {
      setTryOnError("Debes iniciar sesión para usar el try-on.");
      return;
    }
    if (!termsAccepted) {
      setTryOnError("Acepta los términos antes de usar el try-on.");
      return;
    }
    if (!image) {
      setTryOnError("Primero genera o selecciona una personalización para probarla.");
      return;
    }
    if (!selectedUserPhotoId) {
      setTryOnError("Primero sube o selecciona una foto tuya.");
      return;
    }

    try {
      setTryOnLoading(true);
      setTryOnError(null);
      const response = await agentTryOnService.generateTryOn({
        id_user: userId,
        foto_usuario_id: selectedUserPhotoId,
        variant_id: productId,
        garment_image_url: image,
        garment_description:
          selectedProduct?.descripcion?.trim() ||
          selectedProduct?.nombre?.trim() ||
          "Prenda personalizada",
        garment_category: resolveTryOnGarmentCategory(selectedProduct?.nombre),
      });
      if (isInvalidTryOnResultUrl(response.imagen_resultado_url)) {
        throw new Error(
          "El try-on no devolvio una imagen valida. Revisa la configuracion de Replicate o intenta mas tarde."
        );
      }
      setTryOnPreviewImage(response.imagen_resultado_url);
    } catch (error) {
      const normalizedError = normalizeTryOnErrorMessage(error);
      console.error("No se pudo generar el try-on:", normalizedError);
      setTryOnError(normalizedError);
    } finally {
      setTryOnLoading(false);
    }
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

  const handleResetWorkspace = () => {
    setPrompt("");
    setLastPrompt("");
    setTryOnError(null);
    setTryOnPreviewImage(null);
    setImage(null);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-[#f3f0eb] text-zinc-900 dark:bg-gray-900 dark:text-zinc-100 xl:flex-row">
      <CustomizationCanvas
        image={previewImage}
        setImage={(nextImage) => {
          setTryOnPreviewImage(null);
          setImage((currentImage) =>
            typeof nextImage === "function" ? nextImage(currentImage) : nextImage
          );
        }}
        allowImageUpload={false}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
        onSave={handleSaveImage}
        saving={savingImage}
        saved={Boolean(savedImageId)}
        savedImages={savedImages}
        onSelectSaved={(url) => {
          setTryOnPreviewImage(null);
          setImage(url);
        }}
        onDeleteSaved={handleDeleteSaved}
        previewTag={
          tryOnPreviewImage
            ? "Vista previa try-on activa. Guardar conserva solo la prenda personalizada."
            : null
        }
        onClearPreview={
          tryOnPreviewImage
            ? () => setTryOnPreviewImage(null)
            : undefined
        }
      />

      <div className="flex w-full shrink-0 flex-col border-t border-zinc-200/80 bg-[#efe9df] xl:w-[24rem] xl:border-t-0 xl:border-l xl:border-zinc-200/80 xl:bg-[#f7f3ee] dark:border-zinc-800 dark:bg-gray-900">
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
          productImageUrl={
            selectedProduct?.image_url ??
            selectedProduct?.imagen_url ??
            image ??
            null
          }
          termsAccepted={termsAccepted}
          onToggleTerms={handleToggleTerms}
          onDownload={handleDownloadImage}
          onShare={handleShareImage}
          onResetWorkspace={handleResetWorkspace}
          userPhotos={userPhotos}
          selectedUserPhotoId={selectedUserPhotoId}
          tryOnLoading={tryOnLoading}
          deletingUserPhotoId={deletingUserPhotoId}
          tryOnError={tryOnError}
          onSelectUserPhoto={setSelectedUserPhotoId}
          onUploadUserPhoto={handleUploadUserPhoto}
          onDeleteUserPhoto={handleDeleteUserPhoto}
          onGenerateTryOn={handleGenerateTryOn}
          onImageGenerated={(url) => {
            setLastPrompt(prompt.trim());
            setTryOnPreviewImage(null);
            setImage(url);
            setTryOnError(null);
          }}
        />
      </div>
    </div>
  );
};
