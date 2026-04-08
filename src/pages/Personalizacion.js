import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CustomizationCanvas } from "../components/componentesPersonalizacion/CustomizationCanvas";
import { CustomizationForm } from "../components/componentesPersonalizacion/CustomizationForm";
import { agentImagesService } from "../services/agentImages.service";
import { agentTryOnService } from "../services/agentTryOn.service";
import { catalogService } from "../services/catalog.service";
import { useAuth } from "../context/AuthContext";
const TERMS_VERSION = "v1";
export const Personalizacion = () => {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const [prompt, setPrompt] = useState("");
    const [lastPrompt, setLastPrompt] = useState("");
    const [image, setImage] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [savingImage, setSavingImage] = useState(false);
    const [savedImageId, setSavedImageId] = useState(null);
    const [savedImages, setSavedImages] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productError, setProductError] = useState(null);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [userPhotos, setUserPhotos] = useState([]);
    const [selectedUserPhotoId, setSelectedUserPhotoId] = useState(null);
    const [tryOnLoading, setTryOnLoading] = useState(false);
    const [tryOnError, setTryOnError] = useState(null);
    const productId = useMemo(() => {
        const rawValue = searchParams.get("productId");
        if (!rawValue)
            return null;
        const parsed = Number(rawValue);
        return Number.isFinite(parsed) ? parsed : null;
    }, [searchParams]);
    const termsStorageKey = useMemo(() => {
        const userKey = user?.id ? String(user.id) : "anonymous";
        return `agent_terms_acceptance:${TERMS_VERSION}:${userKey}`;
    }, [user?.id]);
    const resolveGarmentType = (value) => {
        const normalized = value.trim().toLowerCase();
        if (!normalized)
            return null;
        if (normalized.includes("pantalon") || normalized.includes("pantalón"))
            return "pantalon";
        if (normalized.includes("camiseta") || normalized.includes("camisa") || normalized.includes("blusa"))
            return "camiseta";
        if (normalized.includes("gorro") || normalized.includes("gorra"))
            return "gorro";
        return null;
    };
    const loadSavedImages = async () => {
        const userId = user?.id ? Number(user.id) : null;
        if (!userId || Number.isNaN(userId))
            return;
        try {
            const images = await agentImagesService.getUserImages(userId);
            setSavedImages(images.map((img) => ({ id: img.id, image_url: img.image_url })));
        }
        catch (error) {
            console.error("No se pudieron cargar las imágenes guardadas:", error);
        }
    };
    const loadUserPhotos = async () => {
        const userId = user?.id ? Number(user.id) : null;
        if (!userId || Number.isNaN(userId))
            return;
        try {
            const photos = await agentTryOnService.getUserPhotos(userId);
            setUserPhotos(photos);
            const preferredPhoto = photos.find((photo) => photo.es_principal) ?? photos[0] ?? null;
            setSelectedUserPhotoId(preferredPhoto?.id ?? null);
        }
        catch (error) {
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
                if (!mounted)
                    return;
                setSelectedProduct(product);
                setImage(product.image_url ?? product.imagen_url ?? null);
            }
            catch (error) {
                if (!mounted)
                    return;
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
        if (!image)
            return;
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
        if (!image)
            return;
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
                prompt: promptToSave ||
                    (selectedProduct?.nombre
                        ? `Base catálogo: ${selectedProduct.nombre}`
                        : null),
                garment_type: resolveGarmentType(promptToSave) ??
                    resolveGarmentType(selectedProduct?.nombre ?? "") ??
                    null,
            });
            setSavedImageId(saved.id);
            await loadSavedImages();
        }
        catch (error) {
            console.error("No se pudo guardar la imagen:", error);
            alert("No se pudo guardar la imagen.");
        }
        finally {
            setSavingImage(false);
        }
    };
    const handleDeleteSaved = async (imageId) => {
        const userId = user?.id ? Number(user.id) : null;
        if (!userId || Number.isNaN(userId))
            return;
        try {
            await agentImagesService.deleteUserImage(imageId, userId);
            setSavedImages((prev) => prev.filter((img) => img.id !== imageId));
            if (savedImageId === imageId)
                setSavedImageId(null);
        }
        catch (error) {
            console.error("No se pudo eliminar la imagen guardada:", error);
            alert("No se pudo eliminar la imagen guardada.");
        }
    };
    const handleToggleTerms = (accepted) => {
        setTermsAccepted(accepted);
        if (accepted) {
            localStorage.setItem(termsStorageKey, "accepted");
            return;
        }
        localStorage.removeItem(termsStorageKey);
    };
    const handleUploadUserPhoto = async (file) => {
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
        }
        catch (error) {
            console.error("No se pudo subir la foto del usuario:", error);
            setTryOnError(error.message || "No se pudo subir tu foto.");
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
            });
            setLastPrompt("Resultado try-on");
            setImage(response.imagen_resultado_url);
        }
        catch (error) {
            console.error("No se pudo generar el try-on:", error);
            setTryOnError(error.message || "No se pudo generar el try-on.");
        }
        finally {
            setTryOnLoading(false);
        }
    };
    const handleShareImage = async () => {
        if (!image)
            return;
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
        }
        catch (error) {
            console.error("No se pudo compartir la imagen:", error);
        }
    };
    return (_jsxs("div", { className: "flex flex-col lg:flex-row h-full bg-[#f3f0eb] dark:bg-gray-900 text-zinc-100", children: [_jsx(CustomizationCanvas, { image: image, setImage: setImage, allowImageUpload: false, isDragging: isDragging, setIsDragging: setIsDragging, onSave: handleSaveImage, saving: savingImage, saved: Boolean(savedImageId), savedImages: savedImages, onSelectSaved: setImage, onDeleteSaved: handleDeleteSaved }), _jsxs("div", { className: "flex w-full flex-col lg:w-80", children: [productError && (_jsx("div", { className: "mx-4 mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200", children: productError })), _jsx(CustomizationForm, { image: image, prompt: prompt, setPrompt: setPrompt, productId: productId, productName: selectedProduct?.nombre ?? null, productDescription: selectedProduct?.descripcion ?? null, termsAccepted: termsAccepted, onToggleTerms: handleToggleTerms, onDownload: handleDownloadImage, onShare: handleShareImage, userPhotos: userPhotos, selectedUserPhotoId: selectedUserPhotoId, tryOnLoading: tryOnLoading, tryOnError: tryOnError, onSelectUserPhoto: setSelectedUserPhotoId, onUploadUserPhoto: handleUploadUserPhoto, onGenerateTryOn: handleGenerateTryOn, onImageGenerated: (url) => {
                            setLastPrompt(prompt.trim());
                            setImage(url);
                            setTryOnError(null);
                        } })] })] }));
};
