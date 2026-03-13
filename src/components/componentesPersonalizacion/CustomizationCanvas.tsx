import { Image } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

interface SavedImage {
  id: number;
  image_url: string;
}

interface Props {
  image: string | null;
  setImage: Dispatch<SetStateAction<string | null>>;
  isDragging: boolean;
  setIsDragging: Dispatch<SetStateAction<boolean>>;
  onSave?: () => void;
  saving?: boolean;
  saved?: boolean;
  savedImages?: SavedImage[];
  onSelectSaved?: (url: string) => void;
  onDeleteSaved?: (id: number) => void;
}

export const CustomizationCanvas = ({
  image,
  setImage,
  isDragging,
  setIsDragging,
  onSave,
  saving = false,
  saved = false,
  savedImages = [],
  onSelectSaved,
  onDeleteSaved,
}: Props) => {
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
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    loadImageFile(e.dataTransfer.files?.[0]);
  };

  const removeImage = () => {
    setImage(null);
  };

  return (
    <main className="flex-1 flex flex-col p-4 md:p-6">
      <div
        className={`bg-white dark:bg-gray-800 rounded-2xl border pt-15 flex items-center justify-center overflow-hidden shadow-2xl relative transition-colors ${isDragging ? "border-yellow-400 bg-zinc-800/90" : "border-zinc-800"
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!image ? (
          <div className="text-zinc-500 text-center w-auto h-120 flex flex-col items-center justify-center">
            <Image size={64} className="mx-auto mb-4 opacity-20" />
            <p className="mb-4 text-sm">Tu creacion aparecera aqui</p>
            <p className="mb-4 text-xs text-zinc-400">
              Tambien puedes arrastrar una imagen y soltarla aqui
            </p>

            <label className="px-2 py-1 md:px-4 md:py-2 text-[#c65a4f] border-1 border-[#c65a4f] rounded-lg cursor-pointer hover:bg-[#c65a4f] hover:text-gray-100 transition">
              Subir Imagen
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>
        ) : (
          <>
            <img
              src={image}
              alt="preview"
              className="object-contain ratio-1/1 w-auto h-120 cursor-zoom-in"
            />

            <div className="absolute top-4 right-4 flex gap-2">
              {onSave && (
                <button
                  onClick={onSave}
                  disabled={saving || saved}
                  className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-emerald-500 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saved ? "Guardado" : saving ? "Guardando..." : "Guardar"}
                </button>
              )}
              <button
                onClick={removeImage}
                className="bg-[#c65a4f] text-white px-3 py-1 rounded-lg text-xs hover:bg-red-500 transition cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          </>
        )}
      </div>

      {/* Historial visual */}
      <div className="h-15 mt-4 flex gap-3 overflow-x-auto pb-2">
        {savedImages.length === 0 && (
          [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="min-w-[70px] h-full bg-white dark:bg-gray-800 rounded-md border border-gray-700"
            />
          ))
        )}
        {savedImages.map((img) => (
          <div
            key={img.id}
            className="relative min-w-[70px] h-full bg-white dark:bg-gray-800 rounded-md border border-gray-700 overflow-hidden"
          >
            <img
              src={img.image_url}
              alt="guardado"
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => onSelectSaved && onSelectSaved(img.image_url)}
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
            />
            {onDeleteSaved && (
              <button
                type="button"
                onClick={() => onDeleteSaved(img.id)}
                className="absolute top-1 right-1 bg-black/70 text-white text-[10px] px-1 rounded"
                aria-label="Eliminar guardado"
              >
                x
              </button>
            )}
          </div>
        ))}
      </div>
    </main>
  );
};

