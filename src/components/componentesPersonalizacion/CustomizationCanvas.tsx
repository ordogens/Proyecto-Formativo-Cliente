import { Image } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  image: string | null;
  setImage: Dispatch<SetStateAction<string | null>>;
  isDragging: boolean;
  setIsDragging: Dispatch<SetStateAction<boolean>>;
}

export const CustomizationCanvas = ({
  image,
  setImage,
  isDragging,
  setIsDragging,
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
        className={`bg-zinc-900 rounded-2xl border pt-15 flex items-center justify-center overflow-hidden shadow-2xl relative transition-colors ${
          isDragging ? "border-yellow-400 bg-zinc-800/90" : "border-zinc-800"
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

            <label className="px-2 py-1 md:px-4 md:py-2 bg-yellow-400 text-black rounded-lg cursor-pointer hover:bg-yellow-300 transition">
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

            <button
              onClick={removeImage}
              className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-600 transition"
            >
              Eliminar
            </button>
          </>
        )}
      </div>

      {/* Historial visual intacto */}
      <div className="h-15 mt-4 flex gap-3 overflow-x-auto pb-2">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="min-w-[70px] h-full bg-zinc-800 rounded-md border border-zinc-700 cursor-pointer hover:border-yellow-500 transition-all"
          />
        ))}
      </div>
    </main>
  );
};
