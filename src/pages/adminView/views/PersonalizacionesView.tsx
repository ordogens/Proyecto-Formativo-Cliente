import { useEffect, useMemo, useState } from "react";
import { agentImagesService, type SavedImageResponse } from "../../../services/agentImages.service";

export const PersonalizacionesView = () => {
  const [pending, setPending] = useState<SavedImageResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [prices, setPrices] = useState<Record<number, string>>({});

  const hasPending = pending.length > 0;

  const loadPending = async () => {
    try {
      setLoading(true);
      const data = await agentImagesService.getPendingImages();
      setPending(data);
    } catch (error) {
      console.error("Error cargando personalizaciones pendientes:", error);
      setPending([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPending();
  }, []);

  const handleApprove = async (imageId: number) => {
    const rawPrice = prices[imageId] ?? "";
    const price = Number(rawPrice);
    if (!Number.isFinite(price) || price <= 0) {
      alert("Ingresa un precio válido para aprobar.");
      return;
    }

    try {
      await agentImagesService.approveImage(imageId, { precio: price });
      setPending((prev) => prev.filter((item) => item.id !== imageId));
    } catch (error) {
      console.error("No se pudo aprobar la personalización:", error);
      alert("No se pudo aprobar la personalización.");
    }
  };

  const handleReject = async (imageId: number) => {
    try {
      await agentImagesService.rejectImage(imageId);
      setPending((prev) => prev.filter((item) => item.id !== imageId));
    } catch (error) {
      console.error("No se pudo rechazar la personalización:", error);
      alert("No se pudo rechazar la personalización.");
    }
  };

  const pendingCards = useMemo(
    () =>
      pending.map((item) => {
        const createdAt = item.created_at
          ? new Date(item.created_at).toLocaleString()
          : "Sin fecha";

        return (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex flex-col gap-3"
          >
            <img
              src={item.image_url}
              alt={`Personalización ${item.id}`}
              className="w-full h-48 object-cover rounded-lg"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
            />
            <div className="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-300">
              <p>
                <span className="font-semibold">Usuario:</span> {item.id_user ?? "N/A"}
              </p>
              <p>
                <span className="font-semibold">Prompt:</span>{" "}
                {item.prompt ?? "Sin prompt"}
              </p>
              <p>
                <span className="font-semibold">Fecha:</span> {createdAt}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                placeholder="Precio"
                value={prices[item.id] ?? ""}
                onChange={(e) =>
                  setPrices((prev) => ({ ...prev, [item.id]: e.target.value }))
                }
                className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200"
              />
              <button
                onClick={() => handleApprove(item.id)}
                className="px-3 py-2 rounded-lg text-sm bg-green-500 text-white hover:opacity-90"
              >
                Aprobar
              </button>
              <button
                onClick={() => handleReject(item.id)}
                className="px-3 py-2 rounded-lg text-sm bg-red-500 text-white hover:opacity-90"
              >
                Rechazar
              </button>
            </div>
          </div>
        );
      }),
    [pending, prices]
  );

  return (
    <div className="bg-[#f3f0eb] w-full h-full md:p-4 dark:bg-gray-900">
      <header className="mb-4 flex flex-col gap-2">
        <h2 className="font-serif text-2xl md:text-xl dark:text-gray-300">
          Personalizaciones pendientes
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Asigna un precio y aprueba la prenda para que el usuario pueda comprarla.
        </p>
      </header>

      {loading && (
        <p className="text-gray-500 dark:text-gray-400">Cargando...</p>
      )}

      {!loading && !hasPending && (
        <p className="text-gray-500 dark:text-gray-400">
          No hay personalizaciones pendientes.
        </p>
      )}

      {hasPending && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pendingCards}
        </div>
      )}
    </div>
  );
};
