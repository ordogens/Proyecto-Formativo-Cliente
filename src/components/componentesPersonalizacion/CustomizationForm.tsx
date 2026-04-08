import { Wand2 } from "lucide-react";
import { AgentChatPanel } from "./AgentChatPanel";
import type { UserPhotoResponse } from "../../services/agentTryOn.service";

interface Props {
  image: string | null;
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  productId: number | null;
  productName?: string | null;
  productDescription?: string | null;
  termsAccepted: boolean;
  onToggleTerms: (accepted: boolean) => void;
  onDownload: () => void;
  onShare: () => void;
  onImageGenerated: (url: string) => void;
  userPhotos: UserPhotoResponse[];
  selectedUserPhotoId: number | null;
  tryOnLoading: boolean;
  tryOnError: string | null;
  onSelectUserPhoto: (photoId: number) => void;
  onUploadUserPhoto: (file: File) => void;
  onGenerateTryOn: () => void;
}

export const CustomizationForm = ({
  image,
  prompt,
  setPrompt,
  productId,
  productName,
  productDescription,
  termsAccepted,
  onToggleTerms,
  onDownload,
  onShare,
  onImageGenerated,
  userPhotos,
  selectedUserPhotoId,
  tryOnLoading,
  tryOnError,
  onSelectUserPhoto,
  onUploadUserPhoto,
  onGenerateTryOn,
}: Props) => {
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
          Prenda Seleccionada
        </label>
        <div className="rounded-xl border border-zinc-300 bg-white p-4 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-gray-800 dark:text-zinc-200">
          {productId ? (
            <>
              <p className="font-semibold">{productName || `Prenda #${productId}`}</p>
              <p className="mt-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                {productDescription || "Esta prenda se personaliza solo con cambios de color y logo."}
              </p>
              <p className="mt-3 text-xs font-medium text-[#c65a4f]">
                Alcance permitido: color base y ubicacion de logo.
              </p>
            </>
          ) : (
            <p className="text-xs text-zinc-500">
              Primero debes abrir esta pantalla desde una prenda del catálogo.
            </p>
          )}
        </div>
      </section>

      <section>
        <label className="text-xs font-semibold text-zinc-500 uppercase mb-2 block">
          Términos De Uso
        </label>
        <div className="rounded-xl border border-zinc-300 bg-white p-4 text-xs leading-5 text-zinc-600 dark:border-zinc-700 dark:bg-gray-800 dark:text-zinc-300">
          <p>
            Para usar este agente debes aceptar que solo puedes subir contenido permitido y que eres responsable por las imágenes que compartes.
          </p>
          <p className="mt-2">
            No se permite contenido sexual, desnudos ni material ofensivo. En esta fase el agente solo trabaja color y logo sobre la prenda actual.
          </p>
          <label className="mt-3 flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(event) => onToggleTerms(event.target.checked)}
              className="mt-0.5 accent-[#c65a4f]"
            />
            <span>Acepto los términos y condiciones para usar el agente de personalización.</span>
          </label>
        </div>
      </section>

      <section>
        <label className="text-xs font-semibold text-zinc-500 uppercase mb-2 block">
          Instrucciones Para El Agente
        </label>
        <AgentChatPanel
          prompt={prompt}
          setPrompt={setPrompt}
          productId={productId}
          productName={productName}
          termsAccepted={termsAccepted}
          onImageGenerated={onImageGenerated}
        />
      </section>

      <section>
        <label className="text-xs font-semibold text-zinc-500 uppercase mb-2 block">
          Virtual Try-On
        </label>
        <div className="rounded-xl border border-zinc-300 bg-white p-4 text-xs text-zinc-600 dark:border-zinc-700 dark:bg-gray-800 dark:text-zinc-300">
          <p>
            Sube una foto tuya, selecciónala y luego genera el try-on real con la personalización actual.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <label className="cursor-pointer rounded-lg border border-[#c65a4f] px-3 py-1.5 text-[#c65a4f] transition hover:bg-[#c65a4f] hover:text-white">
              Subir foto
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) onUploadUserPhoto(file);
                  event.currentTarget.value = "";
                }}
              />
            </label>
            <button
              type="button"
              onClick={onGenerateTryOn}
              disabled={!image || !selectedUserPhotoId || tryOnLoading}
              className="rounded-lg bg-[#c65a4f] px-3 py-1.5 text-white transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              {tryOnLoading ? "Generando..." : "Probar en mi foto"}
            </button>
          </div>
          {userPhotos.length > 0 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {userPhotos.map((photo) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => onSelectUserPhoto(photo.id)}
                  className={`overflow-hidden rounded-lg border-2 ${
                    selectedUserPhotoId === photo.id
                      ? "border-[#c65a4f]"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={photo.foto_url}
                    alt={`Foto ${photo.id}`}
                    className="h-16 w-16 object-cover"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                  />
                </button>
              ))}
            </div>
          )}
          {tryOnError && <p className="mt-3 text-red-500">{tryOnError}</p>}
        </div>
      </section>

      <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-4 text-xs leading-5 text-zinc-500 dark:border-zinc-700 dark:bg-gray-800 dark:text-zinc-400">
        El agente ya no genera prendas libres. Usa el chat para pedir cambios concretos sobre la prenda seleccionada.
      </div>
    </aside>
  );
};
