import { useState } from "react";
import { Image, Wand2 } from "lucide-react";

export const Personalizacion = () => {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full bg-zinc-950 text-zinc-100">

      {/* ================= MAIN ================= */}
      <main className="flex-1 flex flex-col p-4 md:p-6">

        {/* Header */}
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-lg md:text-xl font-bold tracking-tighter text-yellow-400 uppercase">
            CraftYourStyle Canvas
          </h1>

          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm bg-zinc-800 rounded-lg hover:bg-zinc-700 transition">
              Descargar
            </button>
            <button className="px-3 py-1.5 text-sm bg-zinc-800 rounded-lg hover:bg-zinc-700 transition">
              Compartir
            </button>
          </div>
        </header>

        {/* Canvas */}
       <div className="flex-1 bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-center overflow-hidden shadow-2xl relative">

          {!image ? (
            <div className="text-zinc-500 text-center">
              <Image size={64} className="mx-auto mb-4 opacity-20" />
              <p className="mb-4 text-sm">Tu creación aparecerá aquí</p>

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
                className="object-contain"
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
        <div className="h-20 mt-4 flex gap-3 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5].map((i) => (
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
          <h2 className="font-bold text-lg">CraftYourStyle Engine</h2>
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

        {/* Botón */}
        <button className="w-full py-3 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-300 transition active:scale-95 flex items-center justify-center gap-2">
          <Wand2 size={18} />
          GENERAR IMAGEN
        </button>
      </aside>
    </div>
  );
};