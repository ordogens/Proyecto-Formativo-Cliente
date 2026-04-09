import { Image } from "lucide-react";
import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

interface SavedImage {
  id: number;
  image_url: string;
}

interface Props {
  image: string | null;
  setImage: Dispatch<SetStateAction<string | null>>;
  allowImageUpload?: boolean;
  isDragging: boolean;
  setIsDragging: Dispatch<SetStateAction<boolean>>;
  onSave?: () => void;
  saving?: boolean;
  saved?: boolean;
  savedImages?: SavedImage[];
  onSelectSaved?: (url: string) => void;
  onDeleteSaved?: (id: number) => void;
  previewTag?: string | null;
  onClearPreview?: () => void;
}

export const CustomizationCanvas = ({
  image,
  setImage,
  allowImageUpload = true,
  isDragging,
  setIsDragging,
  onSave,
  saving = false,
  saved = false,
  savedImages = [],
  onSelectSaved,
  onDeleteSaved,
  previewTag = null,
  onClearPreview,
}: Props) => {
  const [imageLoadFailed, setImageLoadFailed] = useState(false);
  const [failedSavedIds, setFailedSavedIds] = useState<number[]>([]);
  const placeholderSlots = Array.from({ length: 6 }, (_, index) => index + 1);

  useEffect(() => {
    setImageLoadFailed(false);
  }, [image]);

  const loadImageFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    loadImageFile(e.target.files?.[0]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (!allowImageUpload) return;
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (!allowImageUpload) return;
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (!allowImageUpload) return;
    e.preventDefault();
    setIsDragging(false);
    loadImageFile(e.dataTransfer.files?.[0]);
  };

  const removeImage = () => {
    setImage(null);
  };

  return (
    <main className="flex min-h-0 flex-1 flex-col p-4 md:p-6">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
            Vista previa
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Personaliza tu prenda
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            La prenda base se muestra aquí y tus diseños guardados se organizan abajo por filas.
          </p>
          {previewTag && (
            <p className="mt-2 text-xs font-medium text-[#c65a4f]">
              {previewTag}
            </p>
          )}
        </div>
      </div>

      <div
        className={`relative flex min-h-[420px] flex-1 items-center justify-center overflow-hidden rounded-[28px] border bg-white p-6 shadow-xl transition-colors md:min-h-[520px] ${isDragging ? "border-yellow-400 bg-zinc-800/90" : "border-zinc-200 dark:border-zinc-800 dark:bg-gray-800"
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!image || imageLoadFailed ? (
          <div className="flex min-h-[320px] w-full max-w-xl flex-col items-center justify-center text-center text-zinc-500">
            <Image size={64} className="mx-auto mb-4 opacity-20" />
            <p className="mb-4 text-sm">
              {imageLoadFailed
                ? "No se pudo cargar esta imagen"
                : "Tu creacion aparecera aqui"}
            </p>
            <p className="mb-4 text-xs text-zinc-400">
              {imageLoadFailed
                ? "La URL de esta imagen ya no esta disponible. Genera o guarda una nueva version."
                : allowImageUpload
                ? "Tambien puedes arrastrar una imagen y soltarla aqui"
                : "La vista inicial muestra la prenda seleccionada del catálogo"}
            </p>

            {allowImageUpload && (
              <label className="px-2 py-1 md:px-4 md:py-2 text-[#c65a4f] border-1 border-[#c65a4f] rounded-lg cursor-pointer hover:bg-[#c65a4f] hover:text-gray-100 transition">
                Subir Imagen
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>
        ) : (
          <>
            <img
              src={image}
              alt="preview"
              className="max-h-[min(68vh,42rem)] w-full cursor-zoom-in object-contain"
              onError={() => setImageLoadFailed(true)}
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
            />

            <div className="absolute top-4 right-4 flex gap-2">
              {previewTag && onClearPreview && (
                <button
                  onClick={onClearPreview}
                  className="rounded-lg bg-zinc-900 px-3 py-1 text-xs text-white transition hover:bg-zinc-700"
                >
                  Ver prenda
                </button>
              )}
              {onSave && (
                <button
                  onClick={onSave}
                  disabled={saving || saved}
                  className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-emerald-500 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saved ? "Guardado" : saving ? "Guardando..." : "Guardar"}
                </button>
              )}
              {allowImageUpload && (
                <button
                  onClick={removeImage}
                  className="bg-[#c65a4f] text-white px-3 py-1 rounded-lg text-xs hover:bg-red-500 transition cursor-pointer"
                >
                  Eliminar
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <section className="mt-6 rounded-[28px] border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
              Diseños guardados
            </p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Se acomodan en filas para que puedas verlos mejor.
            </p>
          </div>
        </div>

        <div className="grid max-h-72 grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {savedImages.length === 0 && (
          placeholderSlots.map((i) => (
            <div
              key={i}
              className="aspect-square rounded-2xl border border-dashed border-zinc-300 bg-[#f7f3ee] dark:border-zinc-700 dark:bg-gray-900"
            />
          ))
        )}
        {savedImages.map((img) => (
          <div
            key={img.id}
            className="relative aspect-square overflow-hidden rounded-2xl border border-zinc-200 bg-[#f7f3ee] shadow-sm dark:border-zinc-700 dark:bg-gray-900"
          >
            {failedSavedIds.includes(img.id) ? (
              <div className="flex h-full w-full items-center justify-center bg-zinc-900 px-2 text-center text-[10px] text-zinc-400">
                Imagen no disponible
              </div>
            ) : (
              <img
                src={img.image_url}
                alt="guardado"
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => onSelectSaved && onSelectSaved(img.image_url)}
                onError={() =>
                  setFailedSavedIds((prev) =>
                    prev.includes(img.id) ? prev : [...prev, img.id]
                  )
                }
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
              />
            )}
            {onDeleteSaved && (
              <button
                type="button"
                onClick={() => onDeleteSaved(img.id)}
                className="absolute top-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white"
                aria-label="Eliminar guardado"
              >
                x
              </button>
            )}
          </div>
        ))}
        </div>
      </section>
    </main>
  );
};

