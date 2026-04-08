import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { Send } from "lucide-react";
import { agentService } from "../../services/agent.service";
import { useAuth } from "../../context/AuthContext";
const extractImageUrl = (text) => {
    const match = text.match(/https?:\/\/[^\s]+\.(png|jpg|jpeg|webp)/i);
    return match ? match[0] : null;
};
export const AgentChatPanel = ({ prompt, setPrompt, productId, productName, termsAccepted, onImageGenerated, }) => {
    const { user } = useAuth();
    const [sessionId, setSessionId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [usageStatus, setUsageStatus] = useState(null);
    const userId = useMemo(() => {
        if (!user?.id)
            return null;
        const parsed = Number(user.id);
        return Number.isFinite(parsed) ? parsed : null;
    }, [user?.id]);
    const usageLabel = useMemo(() => {
        if (!usageStatus)
            return null;
        const remaining = usageStatus.usos_restantes;
        const limit = usageStatus.limite_24h;
        return `${remaining} de ${limit} personalizaciones disponibles`;
    }, [usageStatus]);
    const resetLabel = useMemo(() => {
        if (!usageStatus?.reset_at)
            return null;
        const date = new Date(usageStatus.reset_at);
        if (Number.isNaN(date.getTime()))
            return null;
        return new Intl.DateTimeFormat("es-CO", {
            dateStyle: "short",
            timeStyle: "short",
        }).format(date);
    }, [usageStatus?.reset_at]);
    const isLimitReached = (usageStatus?.usos_restantes ?? 1) <= 0;
    useEffect(() => {
        if (!userId) {
            setError("Inicia sesión para usar el agente IA.");
            setSessionId(null);
            setMessages([]);
            setUsageStatus(null);
            return;
        }
        if (!productId) {
            setError("Selecciona una prenda del catálogo para personalizar.");
            setSessionId(null);
            setMessages([]);
            setUsageStatus(null);
            return;
        }
        if (!termsAccepted) {
            setError("Acepta los términos antes de usar el agente.");
            setSessionId(null);
            setMessages([]);
            setUsageStatus(null);
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
                if (!mounted)
                    return;
                const initialResetLabel = new Intl.DateTimeFormat("es-CO", {
                    dateStyle: "short",
                    timeStyle: "short",
                }).format(new Date(newSession.reset_at));
                setSessionId(newSession.id);
                setUsageStatus({
                    limite_24h: newSession.limite_24h,
                    usos_restantes: newSession.usos_restantes,
                    reset_at: newSession.reset_at,
                });
                setMessages([
                    {
                        id: `system-${newSession.id}`,
                        role: "system",
                        text: newSession.usos_restantes > 0
                            ? `Personalizando: ${productName || `prenda #${productId}`}. Puedes pedir únicamente cambios de color y logo.`
                            : `Llegaste al límite diario de personalizaciones. Podrás volver a generar después de ${initialResetLabel}.`,
                    },
                ]);
            }
            catch (err) {
                if (mounted) {
                    setError(err.message || "No se pudo iniciar el chat.");
                }
            }
        };
        void loadSession();
        return () => {
            mounted = false;
        };
    }, [productId, productName, termsAccepted, userId]);
    const sendMessage = async () => {
        if (!prompt.trim() || !sessionId || !productId || !termsAccepted || isLimitReached)
            return;
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
        }
        catch (err) {
            setMessages((prev) => [
                ...prev,
                {
                    id: `system-${Date.now()}`,
                    role: "system",
                    text: err.message || "No se pudo enviar el mensaje.",
                },
            ]);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("section", { className: "border border-zinc-800 rounded-xl p-4 bg-[#f3f0eb] dark:bg-gray-900", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h3", { className: "text-sm font-semibold text-zinc-700 dark:text-zinc-200", children: "Agente IA" }), error && _jsx("span", { className: "text-xs text-red-500", children: error })] }), usageStatus && (_jsxs("div", { className: `mb-3 rounded-xl border px-3 py-2 text-xs ${isLimitReached
                    ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
                    : "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200"}`, children: [_jsx("p", { className: "font-medium", children: usageLabel }), _jsx("p", { className: "mt-1", children: isLimitReached
                            ? `Tu límite se libera nuevamente el ${resetLabel ?? "próximo reinicio"}.`
                            : `Cada personalización cuenta dentro de una ventana móvil de 24 horas. Reinicio estimado: ${resetLabel ?? "pendiente"}.` })] })), _jsxs("div", { className: "h-40 overflow-y-auto bg-white dark:bg-gray-800 rounded-lg p-3 flex flex-col gap-3", children: [messages.length === 0 && (_jsx("p", { className: "text-xs text-zinc-500", children: "Selecciona una prenda del cat\u00E1logo para pedir cambios de logo y color." })), messages.map((message) => (_jsxs("div", { className: `text-xs rounded-lg px-3 py-2 max-w-[85%] ${message.role === "user"
                            ? "bg-[#c65a4f] text-white self-end"
                            : message.role === "agent"
                                ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 self-start"
                                : "bg-red-100 text-red-600 self-start"}`, children: [_jsx("p", { className: "whitespace-pre-wrap", children: message.text }), message.role === "agent" && (_jsx("button", { type: "button", onClick: () => setPrompt(message.text), className: "mt-2 text-[11px] underline text-gray-600 dark:text-gray-300", children: "Usar como prompt" }))] }, message.id)))] }), _jsxs("div", { className: "mt-3 flex gap-2", children: [_jsx("input", { type: "text", value: prompt, onChange: (e) => setPrompt(e.target.value), placeholder: productId
                            ? "Ejemplo: cambia la prenda a negro y agrega un logo blanco en el pecho"
                            : "Primero selecciona una prenda del catálogo", className: "flex-1 bg-white dark:bg-gray-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#c65a4f]", onKeyDown: (e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                void sendMessage();
                            }
                        }, disabled: loading || !sessionId || !productId || !termsAccepted || isLimitReached }), _jsx("button", { type: "button", onClick: () => void sendMessage(), disabled: loading ||
                            !sessionId ||
                            !productId ||
                            !termsAccepted ||
                            !prompt.trim() ||
                            isLimitReached, className: "px-3 py-2 rounded-lg bg-[#c65a4f] text-white disabled:opacity-50 disabled:cursor-not-allowed", children: _jsx(Send, { size: 16 }) })] })] }));
};
