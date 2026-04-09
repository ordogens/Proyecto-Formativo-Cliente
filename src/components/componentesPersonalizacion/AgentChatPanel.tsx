import { ImagePlus, RotateCcw, Send, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { agentImagesService } from "../../services/agentImages.service";
import { agentService, type AgentUsageStatus } from "../../services/agent.service";

interface Props {
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  productId: number | null;
  productName?: string | null;
  productDescription?: string | null;
  productImageUrl?: string | null;
  termsAccepted: boolean;
  onImageGenerated?: (url: string) => void;
  onResetWorkspace: () => void;
}

interface ChatItem {
  id: string;
  role: "user" | "agent" | "system";
  text: string;
}

interface AttachedReference {
  id: string;
  name: string;
  previewUrl: string;
  remoteUrl: string;
}

const extractImageUrl = (text: string) => {
  const match = text.match(/https?:\/\/[^\s]+\.(png|jpg|jpeg|webp)/i);
  return match ? match[0] : null;
};

const buildInitialMessage = (
  sessionId: number,
  productId: number,
  productName: string | null | undefined,
  usosRestantes: number,
  resetAt: string
): ChatItem => {
  const initialResetLabel = new Intl.DateTimeFormat("es-CO", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(resetAt));

  return {
    id: `system-${sessionId}`,
    role: "system",
    text:
      usosRestantes > 0
        ? `Personalizando: ${productName || `prenda #${productId}`}. Puedes pedir cambios de color, logo y ahora también subir referencias visuales de diseño.`
        : `Llegaste al límite diario de personalizaciones. Podrás volver a generar después de ${initialResetLabel}.`,
  };
};

export const AgentChatPanel = ({
  prompt,
  setPrompt,
  productId,
  productName,
  productDescription,
  productImageUrl,
  termsAccepted,
  onImageGenerated,
  onResetWorkspace,
}: Props) => {
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [creatingSession, setCreatingSession] = useState(false);
  const [uploadingReferences, setUploadingReferences] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usageStatus, setUsageStatus] = useState<AgentUsageStatus | null>(null);
  const [attachedReferences, setAttachedReferences] = useState<AttachedReference[]>([]);

  const userId = useMemo(() => {
    if (!user?.id) return null;
    const parsed = Number(user.id);
    return Number.isFinite(parsed) ? parsed : null;
  }, [user?.id]);

  const usageLabel = useMemo(() => {
    if (!usageStatus) return null;
    const remaining = usageStatus.usos_restantes;
    const limit = usageStatus.limite_24h;
    return `${remaining} de ${limit} personalizaciones disponibles`;
  }, [usageStatus]);

  const resetLabel = useMemo(() => {
    if (!usageStatus?.reset_at) return null;
    const date = new Date(usageStatus.reset_at);
    if (Number.isNaN(date.getTime())) return null;
    return new Intl.DateTimeFormat("es-CO", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(date);
  }, [usageStatus?.reset_at]);

  const isLimitReached = (usageStatus?.usos_restantes ?? 1) <= 0;
  const isBusy = loading || creatingSession || uploadingReferences;
  const canSend = Boolean(
    sessionId &&
      productId &&
      termsAccepted &&
      !isLimitReached &&
      !isBusy &&
      (prompt.trim() || attachedReferences.length > 0)
  );

  const clearAttachedReferences = () => {
    setAttachedReferences((prev) => {
      prev.forEach((reference) => {
        URL.revokeObjectURL(reference.previewUrl);
      });
      return [];
    });
  };

  const startSession = async ({
    closeCurrent = false,
    resetWorkspace = false,
  }: {
    closeCurrent?: boolean;
    resetWorkspace?: boolean;
  } = {}) => {
    if (!userId || !productId || !termsAccepted) return;

    try {
      setCreatingSession(true);
      setError(null);

      if (closeCurrent && sessionId) {
        try {
          await agentService.closeSession(sessionId);
        } catch {
          // Si ya estaba cerrada o no se pudo cerrar, igual seguimos con el nuevo chat.
        }
      }

      const newSession = await agentService.createSession(userId, {
        productId,
        productName,
        productDescription,
        productImageUrl,
        termsAccepted,
      });

      setSessionId(newSession.id);
      setUsageStatus({
        limite_24h: newSession.limite_24h,
        usos_restantes: newSession.usos_restantes,
        reset_at: newSession.reset_at,
      });
      setMessages([
        buildInitialMessage(
          newSession.id,
          productId,
          productName,
          newSession.usos_restantes,
          newSession.reset_at
        ),
      ]);
      setPrompt("");
      clearAttachedReferences();

      if (resetWorkspace) {
        onResetWorkspace();
      }
    } catch (err) {
      setError((err as Error).message || "No se pudo iniciar el chat.");
    } finally {
      setCreatingSession(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      setError("Inicia sesión para usar el agente IA.");
      setSessionId(null);
      setMessages([]);
      setUsageStatus(null);
      clearAttachedReferences();
      return;
    }

    if (!productId) {
      setError("Selecciona una prenda del catálogo para personalizar.");
      setSessionId(null);
      setMessages([]);
      setUsageStatus(null);
      clearAttachedReferences();
      return;
    }

    if (!termsAccepted) {
      setError("Acepta los términos antes de usar el agente.");
      setSessionId(null);
      setMessages([]);
      setUsageStatus(null);
      clearAttachedReferences();
      return;
    }

    void startSession({ resetWorkspace: false });
  }, [productDescription, productId, productImageUrl, productName, termsAccepted, userId]);

  const handleUploadReferences = async (files: FileList | null) => {
    if (!files?.length || !userId) return;

    try {
      setUploadingReferences(true);
      setError(null);

      const uploadedReferences = await Promise.all(
        Array.from(files).map(async (file) => {
          if (!file.type.startsWith("image/")) {
            throw new Error("Solo puedes subir imágenes de referencia.");
          }

          const uploaded = await agentImagesService.uploadReferenceImage(file, userId);
          return {
            id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            name: file.name,
            previewUrl: URL.createObjectURL(file),
            remoteUrl: uploaded.url,
          } satisfies AttachedReference;
        })
      );

      setAttachedReferences((prev) => [...prev, ...uploadedReferences]);
    } catch (err) {
      setError((err as Error).message || "No se pudieron subir las referencias.");
    } finally {
      setUploadingReferences(false);
    }
  };

  const removeAttachedReference = (referenceId: string) => {
    setAttachedReferences((prev) => {
      const target = prev.find((reference) => reference.id === referenceId);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((reference) => reference.id !== referenceId);
    });
  };

  const sendMessage = async () => {
    if (!sessionId || !productId || !termsAccepted || isLimitReached || isBusy) return;

    const text =
      prompt.trim() ||
      (attachedReferences.length > 0
        ? "Usa esta referencia visual sobre la prenda seleccionada."
        : "");

    if (!text) return;

    setLoading(true);

    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: "user", text },
    ]);

    try {
      const response = await agentService.sendMessage(sessionId, text, {
        productId,
        productName,
        productDescription,
        productImageUrl,
        termsAccepted,
        referenceImages: attachedReferences.map((reference) => reference.remoteUrl),
      });

      setUsageStatus({
        limite_24h: response.limite_24h,
        usos_restantes: response.usos_restantes,
        reset_at: response.reset_at,
      });
      setMessages((prev) => [
        ...prev,
        { id: `agent-${Date.now()}`, role: "agent", text: response.mensaje },
      ]);

      const imageUrl = response.imagenes_generadas?.[0] ?? extractImageUrl(response.mensaje);
      if (imageUrl && onImageGenerated) {
        onImageGenerated(imageUrl);
      }

      setPrompt("");
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `system-${Date.now()}`,
          role: "system",
          text: (err as Error).message || "No se pudo enviar el mensaje.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = async () => {
    await startSession({ closeCurrent: true, resetWorkspace: true });
  };

  return (
    <section className="rounded-xl border border-zinc-800 bg-[#f3f0eb] p-4 dark:bg-gray-900">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
            Agente IA
          </h3>
          <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
            Puedes subir referencias visuales y pedir que ese diseño se aplique o se adapte a la prenda actual.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void handleNewChat()}
          disabled={creatingSession || !sessionId || !termsAccepted || !productId}
          className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-[11px] font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-gray-800 dark:text-zinc-200 dark:hover:bg-gray-700"
        >
          <RotateCcw size={13} />
          Nuevo chat
        </button>
      </div>

      {error && <div className="mb-3 text-xs text-red-500">{error}</div>}

      {usageStatus && (
        <div
          className={`mb-3 rounded-xl border px-3 py-2 text-xs ${
            isLimitReached
              ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
              : "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
          }`}
        >
          <p className="font-medium">{usageLabel}</p>
          <p className="mt-1">
            {isLimitReached
              ? `Tu límite se libera nuevamente el ${resetLabel ?? "próximo reinicio"}.`
              : `Cada personalización cuenta dentro de una ventana móvil de 24 horas. Reinicio estimado: ${resetLabel ?? "pendiente"}.`}
          </p>
        </div>
      )}

      <div className="mb-3 rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-gray-800">
        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#c65a4f] px-3 py-1.5 text-xs font-medium text-[#c65a4f] transition hover:bg-[#c65a4f] hover:text-white">
            <ImagePlus size={14} />
            Subir diseño
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(event) => {
                void handleUploadReferences(event.target.files);
                event.currentTarget.value = "";
              }}
              disabled={uploadingReferences || !termsAccepted || !productId}
            />
          </label>
          {attachedReferences.length > 0 && (
            <button
              type="button"
              onClick={clearAttachedReferences}
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-[11px] text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-gray-700"
            >
              Limpiar referencias
            </button>
          )}
          {uploadingReferences && (
            <span className="text-[11px] text-zinc-500">Subiendo referencias...</span>
          )}
        </div>

        {attachedReferences.length > 0 && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {attachedReferences.map((reference) => (
              <div
                key={reference.id}
                className="relative overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-gray-900"
              >
                <img
                  src={reference.previewUrl}
                  alt={reference.name}
                  className="h-16 w-16 object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeAttachedReference(reference.id)}
                  className="absolute right-1 top-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white"
                  aria-label={`Eliminar referencia ${reference.name}`}
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}

        <p className="mt-2 text-[11px] leading-4 text-zinc-500 dark:text-zinc-400">
          Las referencias se mantienen durante este chat para que puedas pedir “usa este diseño” o “usa este diseño pero agrégale algo más”.
        </p>
      </div>

      <div className="h-44 overflow-y-auto rounded-lg bg-white p-3 dark:bg-gray-800">
        <div className="flex flex-col gap-3">
          {messages.length === 0 && (
            <p className="text-xs text-zinc-500">
              Selecciona una prenda del catálogo y sube una referencia si quieres aplicar un diseño específico.
            </p>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[85%] rounded-lg px-3 py-2 text-xs ${
                message.role === "user"
                  ? "self-end bg-[#c65a4f] text-white"
                  : message.role === "agent"
                  ? "self-start bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
                  : "self-start bg-red-100 text-red-600"
              }`}
            >
              <p className="whitespace-pre-wrap">{message.text}</p>
              {message.role === "agent" && (
                <button
                  type="button"
                  onClick={() => setPrompt(message.text)}
                  className="mt-2 text-[11px] text-gray-600 underline dark:text-gray-300"
                >
                  Usar como prompt
                </button>
              )}
            </div>
          ))}
          {loading && (
            <div className="self-start rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-600 dark:border-zinc-700 dark:bg-gray-900 dark:text-zinc-300">
              <p>El agente está pensando...</p>
              <div className="mt-2 h-2 w-40 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                <div className="h-full w-1/2 animate-pulse rounded-full bg-[#c65a4f]" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={
            productId
              ? "Ejemplo: usa este diseño, pero cambia el fondo a negro y ajusta el logo"
              : "Primero selecciona una prenda del catálogo"
          }
          className="flex-1 rounded-lg border border-zinc-700 bg-white px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#c65a4f] dark:bg-gray-800 dark:text-gray-100"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void sendMessage();
            }
          }}
          disabled={isBusy || !sessionId || !productId || !termsAccepted || isLimitReached}
        />
        <button
          type="button"
          onClick={() => void sendMessage()}
          disabled={!canSend}
          className="rounded-lg bg-[#c65a4f] px-3 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send size={16} />
        </button>
      </div>
    </section>
  );
};
