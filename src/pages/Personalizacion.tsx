import { useState } from "react";
import { Image, Wand2 } from "lucide-react";

export const Personalizacion = () => {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Centraliza la carga para reutilizarla desde input y drag & drop.
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

  // Activa/limpia estado visual del dropzone durante el arrastre.
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // Toma el primer archivo soltado y lo carga como imagen.
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    loadImageFile(e.dataTransfer.files?.[0]);
  };

  const removeImage = () => {
    setImage(null);
  };

  // Descarga la imagen actual en formato PNG usando su data URL.
  const handleDownloadImage = () => {
    if (!image) return;

    const link = document.createElement("a");
    link.href = image;
    link.download = `personalizacion-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Intenta compartir el archivo con Web Share API; si no se puede, descarga la imagen.
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
      {/* ================= MAIN ================= */}
      <main className="flex-1 flex flex-col p-4 md:p-6">
        {/* Canvas */}
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

        {/* Historial */}
        <div className="h-15 mt-4 flex gap-3 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5,6,7,8].map((i) => (
            <div
              key={i}
              className="min-w-[70px] h-full bg-zinc-800 rounded-md border border-zinc-700 cursor-pointer hover:border-yellow-500 transition-all"
            />
          ))}
        </div>
      </main>

      {/* ================= ASIDE ================= */}
      <aside className="w-full lg:w-80 bg-zinc-900 border-t lg:border-t-0 lg:border-l border-zinc-800 p-4 md:p-6 flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
            <Wand2 size={18} className="text-black" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadImage}
              disabled={!image}
              className="px-3 py-1.5 text-sm bg-zinc-800 rounded-lg hover:bg-zinc-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Descargar
            </button>
            <button
              onClick={handleShareImage}
              disabled={!image}
              className="px-3 py-1.5 text-sm bg-zinc-800 rounded-lg hover:bg-zinc-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Compartir
            </button>
          </div>
        </div>

        {/* Prompt */}
        <section>
          <label className="text-xs font-semibold text-zinc-500 uppercase mb-2 block">
            Smart Prompt
          </label>
          <textarea
            className="w-full h-28 bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-yellow-400 outline-none resize-none"
            placeholder="Describe lo que tienes en mente..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </section>

        {/* Aspect Ratio */}
        <section>
          <label className="text-xs font-semibold text-zinc-500 uppercase mb-2 block">
            Aspect Ratio
          </label>
          <div className="grid grid-cols-3 gap-2">
            {["1:1", "16:9", "9:16"].map((ratio) => (
              <button
                key={ratio}
                className="py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-xs hover:bg-yellow-400 hover:text-black transition-colors"
              >
                {ratio}
              </button>
            ))}
          </div>
        </section>

        {/* Creatividad */}
        <section>
          <div className="flex justify-between mb-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase">
              Creatividad
            </label>
            <span className="text-xs text-yellow-400">75%</span>
          </div>
          <input
            type="range"
            className="w-full accent-yellow-400 cursor-pointer"
          />
        </section>

        {/* Boton */}
        <button className="w-full py-3 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-300 transition active:scale-95 flex items-center justify-center gap-2">
          <Wand2 size={18} />
          GENERAR IMAGEN
        </button>
      </aside>
    </div>
  );
};
