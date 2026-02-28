import { Wand2 } from "lucide-react";

interface Props {
  image: string | null;
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  aspectRatio: string;
  setAspectRatio: React.Dispatch<React.SetStateAction<string>>;
  creativity: number;
  setCreativity: React.Dispatch<React.SetStateAction<number>>;
  onDownload: () => void;
  onShare: () => void;
  onGenerate: () => void;
  loading: boolean;
}

export const CustomizationForm = ({
  image,
  prompt,
  setPrompt,
  aspectRatio,
  setAspectRatio,
  creativity,
  setCreativity,
  onDownload,
  onShare,
  onGenerate,
  loading,
}: Props) => {
  const ratios = ["1:1", "16:9", "9:16"];

  return (
    <aside className="w-full lg:w-80 bg-zinc-900 border-t lg:border-t-0 lg:border-l border-zinc-800 p-4 md:p-6 flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
          <Wand2 size={18} className="text-black" />
        </div>
        <div className="flex gap-2">
          <button
            onClick={onDownload}
            disabled={!image}
            className="px-3 py-1.5 text-sm bg-zinc-800 rounded-lg hover:bg-zinc-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Descargar
          </button>
          <button
            onClick={onShare}
            disabled={!image}
            className="px-3 py-1.5 text-sm bg-zinc-800 rounded-lg hover:bg-zinc-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Compartir
          </button>
        </div>
      </div>

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

      <section>
        <label className="text-xs font-semibold text-zinc-500 uppercase mb-2 block">
          Aspect Ratio
        </label>
        <div className="grid grid-cols-3 gap-2">
          {ratios.map((ratio) => (
            <button
              key={ratio}
              type="button"
              onClick={() => setAspectRatio(ratio)}
              className={`py-2 rounded-lg text-xs border transition-colors ${
                aspectRatio === ratio
                  ? "bg-yellow-400 text-black border-yellow-400"
                  : "bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
              }`}
            >
              {ratio}
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="flex justify-between mb-2">
          <label className="text-xs font-semibold text-zinc-500 uppercase">
            Creatividad
          </label>
          <span className="text-xs text-yellow-400">{creativity}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={creativity}
          onChange={(e) => setCreativity(Number(e.target.value))}
          className="w-full accent-yellow-400 cursor-pointer"
        />
      </section>

      <button
        onClick={onGenerate}
        disabled={!image || !prompt.trim() || loading}
        className="w-full py-3 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-300 transition active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Wand2 size={18} />
        {loading ? "Generando..." : "GENERAR IMAGEN"}
      </button>
    </aside>
  );
};
