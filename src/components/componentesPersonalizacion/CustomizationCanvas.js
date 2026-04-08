import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Image } from "lucide-react";
import { useEffect, useState } from "react";
export const CustomizationCanvas = ({ image, setImage, allowImageUpload = true, isDragging, setIsDragging, onSave, saving = false, saved = false, savedImages = [], onSelectSaved, onDeleteSaved, }) => {
    const [imageLoadFailed, setImageLoadFailed] = useState(false);
    const [failedSavedIds, setFailedSavedIds] = useState([]);
    useEffect(() => {
        setImageLoadFailed(false);
    }, [image]);
    const loadImageFile = (file) => {
        if (!file)
            return;
        if (!file.type.startsWith("image/"))
            return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(file);
    };
    const handleImageUpload = (e) => {
        loadImageFile(e.target.files?.[0]);
    };
    const handleDragOver = (e) => {
        if (!allowImageUpload)
            return;
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = (e) => {
        if (!allowImageUpload)
            return;
        e.preventDefault();
        setIsDragging(false);
    };
    const handleDrop = (e) => {
        if (!allowImageUpload)
            return;
        e.preventDefault();
        setIsDragging(false);
        loadImageFile(e.dataTransfer.files?.[0]);
    };
    const removeImage = () => {
        setImage(null);
    };
    return (_jsxs("main", { className: "flex-1 flex flex-col p-4 md:p-6", children: [_jsx("div", { className: `bg-white dark:bg-gray-800 rounded-2xl border pt-15 flex items-center justify-center overflow-hidden shadow-2xl relative transition-colors ${isDragging ? "border-yellow-400 bg-zinc-800/90" : "border-zinc-800"}`, onDragOver: handleDragOver, onDragLeave: handleDragLeave, onDrop: handleDrop, children: !image || imageLoadFailed ? (_jsxs("div", { className: "text-zinc-500 text-center w-auto h-120 flex flex-col items-center justify-center", children: [_jsx(Image, { size: 64, className: "mx-auto mb-4 opacity-20" }), _jsx("p", { className: "mb-4 text-sm", children: imageLoadFailed
                                ? "No se pudo cargar esta imagen"
                                : "Tu creacion aparecera aqui" }), _jsx("p", { className: "mb-4 text-xs text-zinc-400", children: imageLoadFailed
                                ? "La URL de esta imagen ya no esta disponible. Genera o guarda una nueva version."
                                : allowImageUpload
                                    ? "Tambien puedes arrastrar una imagen y soltarla aqui"
                                    : "La vista inicial muestra la prenda seleccionada del catálogo" }), allowImageUpload && (_jsxs("label", { className: "px-2 py-1 md:px-4 md:py-2 text-[#c65a4f] border-1 border-[#c65a4f] rounded-lg cursor-pointer hover:bg-[#c65a4f] hover:text-gray-100 transition", children: ["Subir Imagen", _jsx("input", { type: "file", accept: "image/*", className: "hidden", onChange: handleImageUpload })] }))] })) : (_jsxs(_Fragment, { children: [_jsx("img", { src: image, alt: "preview", className: "object-contain ratio-1/1 w-auto h-120 cursor-zoom-in", onError: () => setImageLoadFailed(true), referrerPolicy: "no-referrer", crossOrigin: "anonymous" }), _jsxs("div", { className: "absolute top-4 right-4 flex gap-2", children: [onSave && (_jsx("button", { onClick: onSave, disabled: saving || saved, className: "bg-emerald-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-emerald-500 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed", children: saved ? "Guardado" : saving ? "Guardando..." : "Guardar" })), allowImageUpload && (_jsx("button", { onClick: removeImage, className: "bg-[#c65a4f] text-white px-3 py-1 rounded-lg text-xs hover:bg-red-500 transition cursor-pointer", children: "Eliminar" }))] })] })) }), _jsxs("div", { className: "h-15 mt-4 flex gap-3 overflow-x-auto pb-2", children: [savedImages.length === 0 && ([1, 2, 3, 4, 5, 6, 7, 8].map((i) => (_jsx("div", { className: "min-w-[70px] h-full bg-white dark:bg-gray-800 rounded-md border border-gray-700" }, i)))), savedImages.map((img) => (_jsxs("div", { className: "relative min-w-[70px] h-full bg-white dark:bg-gray-800 rounded-md border border-gray-700 overflow-hidden", children: [failedSavedIds.includes(img.id) ? (_jsx("div", { className: "flex h-full w-full items-center justify-center bg-zinc-900 px-2 text-center text-[10px] text-zinc-400", children: "Imagen no disponible" })) : (_jsx("img", { src: img.image_url, alt: "guardado", className: "w-full h-full object-cover cursor-pointer", onClick: () => onSelectSaved && onSelectSaved(img.image_url), onError: () => setFailedSavedIds((prev) => prev.includes(img.id) ? prev : [...prev, img.id]), referrerPolicy: "no-referrer", crossOrigin: "anonymous" })), onDeleteSaved && (_jsx("button", { type: "button", onClick: () => onDeleteSaved(img.id), className: "absolute top-1 right-1 bg-black/70 text-white text-[10px] px-1 rounded", "aria-label": "Eliminar guardado", children: "x" }))] }, img.id)))] })] }));
};
