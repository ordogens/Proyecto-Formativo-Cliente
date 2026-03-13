import { useContext, useEffect, useState } from "react";
import { ProductsLayout } from "../../layouts/ProductsLayout";
import { agentImagesService, type SavedImageResponse } from "../../services/agentImages.service";
import { ShopContext } from "../../context/shopContext";
import { useAuth } from "../../context/AuthContext";

interface PersonalizedItem {
  id: number;
  image: string;
  price: number;
  prompt?: string | null;
}

export const Personalizadas = () => {
  const { user } = useAuth();
  const shop = useContext(ShopContext);
  const [items, setItems] = useState<PersonalizedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const isLoggedIn = Boolean(user?.id);

  if (!shop) {
    throw new Error("ShopContext must be used inside ShopProvider");
  }

  const { addToCart } = shop;

  useEffect(() => {
    const load = async () => {
      const userId = user?.id ? Number(user.id) : null;
      if (!userId || Number.isNaN(userId)) {
        setItems([]);
        return;
      }
      try {
        setLoading(true);
        const response = await agentImagesService.getUserImages(userId, "aprobada");
        const parsed = response
          .map<PersonalizedItem | null>((img: SavedImageResponse) => {
            const price = Number(img.precio ?? 0);
            if (!Number.isFinite(price) || price <= 0) return null;
            return {
              id: img.id,
              image: img.image_url,
              price,
              prompt: img.prompt ?? null,
            };
          })
          .filter((item): item is PersonalizedItem => Boolean(item));
        setItems(parsed);
      } catch (error) {
        console.error("Error cargando personalizadas aprobadas:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [user?.id]);

  const handleAcceptPrice = (item: PersonalizedItem) => {
    addToCart({
      cartId: crypto.randomUUID(),
      productId: item.id,
      name: item.prompt?.trim() ? item.prompt.trim() : `Prenda personalizada #${item.id}`,
      price: item.price,
      quantity: 1,
      image: item.image,
      personalized: true,
    });
  };

  return (
    <ProductsLayout
      categoriaLabel="Categorías"
      titulo="Personalizadas"
      totalProductos={items.length}
    >
      {loading && (
        <p className="text-gray-500 dark:text-gray-300">Cargando...</p>
      )}

      {!isLoggedIn && (
        <p className="text-gray-500 dark:text-gray-300">
          Inicia sesión para ver tus prendas personalizadas.
        </p>
      )}

      {isLoggedIn && !loading && items.length === 0 && (
        <p className="text-gray-500 dark:text-gray-300">
          Aún no tienes prendas personalizadas aprobadas.
        </p>
      )}

      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white dark:bg-gray-800 rounded-2xl flex flex-col gap-2 shadow-sm w-45 md:w-60 transition-colors duration-300 overflow-hidden"
        >
          <img
            src={item.image}
            alt={item.prompt ?? `Prenda personalizada ${item.id}`}
            className="w-full h-50 md:h-70 object-cover"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
          />

          <div className="px-2 flex flex-col gap-1 pb-3">
            <h3 className="font-medium text-sm text-gray-800 dark:text-gray-300">
              {item.prompt?.trim()
                ? item.prompt
                : `Prenda personalizada #${item.id}`}
            </h3>
            <p className="font-bold text-sm text-gray-900 dark:text-gray-300">
              ${item.price.toLocaleString()}
            </p>

            <button
              onClick={() => handleAcceptPrice(item)}
              className="w-full border border-red-500 text-red-500 bg-red-100 rounded-lg p-1 text-sm hover:bg-red-500 hover:text-white transition cursor-pointer"
            >
              Aceptar precio y agregar
            </button>
          </div>
        </div>
      ))}
    </ProductsLayout>
  );
};
