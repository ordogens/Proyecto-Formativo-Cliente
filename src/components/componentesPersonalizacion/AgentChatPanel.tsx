import { useEffect, useMemo, useState } from "react";
import { Send } from "lucide-react";
import { agentService } from "../../services/agent.service";
import { useAuth } from "../../context/AuthContext";

interface Props {
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  productId: number | null;
  productName?: string | null;
  termsAccepted: boolean;
  onImageGenerated?: (url: string) => void;
}

interface ChatItem {
  id: string;
  role: "user" | "agent" | "system";
  text: string;
}

const extractImageUrl = (text: string) => {
  const match = text.match(/https?:\/\/[^\s]+\.(png|jpg|jpeg|webp)/i);
  return match ? match[0] : null;
};

export const AgentChatPanel = ({
  prompt,
  setPrompt,
  productId,
  productName,
  termsAccepted,
  onImageGenerated,
}: Props) => {
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = useMemo(() => {
    if (!user?.id) return null;
    const parsed = Number(user.id);
    return Number.isFinite(parsed) ? parsed : null;
  }, [user?.id]);

  useEffect(() => {
    if (!userId) {
      setError("Inicia sesión para usar el agente IA.");
      setSessionId(null);
      setMessages([]);
      return;
    }

    if (!productId) {
      setError("Selecciona una prenda del catálogo para personalizar.");
      setSessionId(null);
      setMessages([]);
      return;
    }

    if (!termsAccepted) {
      setError("Acepta los términos antes de usar el agente.");
      setSessionId(null);
      setMessages([]);
      return;
    }

    let mounted = true;

    const loadSession = async () => {
      try {
        setError(null);
        const newSession = await agentService.createSession(userId, {
          productId,
          productName,
          termsAccepted,
        });
        if (!mounted) return;
        setSessionId(newSession.id);
        setMessages([
          {
            id: `system-${newSession.id}`,
            role: "system",
            text: `Personalizando: ${productName || `prenda #${productId}`}. Puedes pedir únicamente cambios de color y logo.`,
          },
        ]);
      } catch (err) {
        if (mounted) {
          setError((err as Error).message || "No se pudo iniciar el chat.");
        }
      }
    };

    void loadSession();

    return () => {
      mounted = false;
    };
  }, [productId, productName, termsAccepted, userId]);

  const sendMessage = async () => {
    if (!prompt.trim() || !sessionId || !productId || !termsAccepted) return;

    const text = prompt.trim();
    setLoading(true);

    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: "user", text },
    ]);

    try {
      const response = await agentService.sendMessage(sessionId, text, {
        productId,
        productName,
        termsAccepted,
      });
      setMessages((prev) => [
        ...prev,
        { id: `agent-${Date.now()}`, role: "agent", text: response.mensaje },
      ]);

      const imageUrl = response.imagenes_generadas?.[0] ?? extractImageUrl(response.mensaje);
      if (imageUrl && onImageGenerated) {
        onImageGenerated(imageUrl);
      }
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

  return (
    <section className="border border-zinc-800 rounded-xl p-4 bg-[#f3f0eb] dark:bg-gray-900">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
          Agente IA
        </h3>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>

      <div className="h-40 overflow-y-auto bg-white dark:bg-gray-800 rounded-lg p-3 flex flex-col gap-3">
        {messages.length === 0 && (
          <p className="text-xs text-zinc-500">
            Selecciona una prenda del catálogo para pedir cambios de logo y color.
          </p>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`text-xs rounded-lg px-3 py-2 max-w-[85%] ${
              message.role === "user"
                ? "bg-[#c65a4f] text-white self-end"
                : message.role === "agent"
                ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 self-start"
                : "bg-red-100 text-red-600 self-start"
            }`}
          >
            <p className="whitespace-pre-wrap">{message.text}</p>
            {message.role === "agent" && (
              <button
                type="button"
                onClick={() => setPrompt(message.text)}
                className="mt-2 text-[11px] underline text-gray-600 dark:text-gray-300"
              >
                Usar como prompt
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={
            productId
              ? "Ejemplo: cambia la prenda a negro y agrega un logo blanco en el pecho"
              : "Primero selecciona una prenda del catálogo"
          }
          className="flex-1 bg-white dark:bg-gray-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#c65a4f]"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void sendMessage();
            }
          }}
          disabled={loading || !sessionId || !productId || !termsAccepted}
        />
        <button
          type="button"
          onClick={() => void sendMessage()}
          disabled={loading || !sessionId || !productId || !termsAccepted || !prompt.trim()}
          className="px-3 py-2 rounded-lg bg-[#c65a4f] text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={16} />
        </button>
      </div>
    </section>
  );
};
