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
    <aside className="w-full lg:w-80 bg-[] dark:bg-gray-900 border-t lg:border-t-0 lg:border-l border-zinc-800 p-4 md:p-6 flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[#f3f0eb] dark:bg-gray-800 rounded-full flex items-center justify-center">
          <Wand2 size={18} className="text-[#c65a4f]" />
        </div>
        <div className="flex gap-2">
          <button
            onClick={onDownload}
            disabled={!image}
            className="px-3 py-1.5 text-sm bg-gray-800 rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Descargar
          </button>
          <button
            onClick={onShare}
            disabled={!image}
            className="px-3 py-1.5 text-sm bg-gray-800 rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
          className="w-full h-28 bg-[#f3f0eb] dark:bg-gray-800 border text-black dark:text-gray-100 border-gray-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-black dark:focus:ring-[#c65a4f] outline-none resize-none"
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
              className={`py-2 rounded-lg text-xs border transition-colors cursor-pointer ${aspectRatio === ratio
                ? "bg-[#c65a4f] text-black border-[#c65a4f]"
                : "bg-[#f3f0eb] dark:bg-gray-800 border-gray-700 text-gray-100 hover:dark:bg-gray-700 hover:border-[#c65a4f] hover:text-[#c65a4f]"
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
          <span className="text-xs text-[#c65a4f]">{creativity}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={creativity}
          onChange={(e) => setCreativity(Number(e.target.value))}
          className="w-full accent-[#c65a4f] cursor-pointer"
        />
      </section>

      <button
        onClick={onGenerate}
        disabled={!image || !prompt.trim() || loading}
        className="w-full py-3 border-1 border-[#c65a4f] text-[#c65a4f] font-bold rounded-xl hover:bg-[#c65a4f] disabled:hover:bg-[#f3f0eb] disabled:hover:text-[#c65a4f] hover:text-gray-100 cursor-pointer transition active:scale-95 disabled:scale-none flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Wand2 size={18} />
        {loading ? "Generando..." : "GENERAR IMAGEN"}
      </button>
    </aside>
  );
};
