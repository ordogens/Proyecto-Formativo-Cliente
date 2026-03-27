import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import type { Producto } from "../../data/Productos";
import { ShopContext } from "../../context/shopContext";
import { useNavigate } from "react-router-dom";
import { Stars } from "../../components/icons/Stars";
import { BadgeAlert } from "../../components/ui/BadgeAlert";
import { ShoppingBag } from "lucide-react";
import { catalogService } from "../../services/catalog.service";
import { toUiProducto } from "../../utils/catalogProducts";

export const VistaDinamica = () => {
  const { id } = useParams();
  const shop = useContext(ShopContext);
  const navigate = useNavigate();
  const stock = true;
  const customizable = true;
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);

  if (!shop) {
    throw new Error("Must be inside ShopProvider");
  }

  const { addToCart, /*cart*/ } = shop;
  const [addedMessageVisible, setAddedMessageVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (!addedMessageVisible) {
      return;
    }

    const timer = window.setTimeout(() => {
      setAddedMessageVisible(false);
    }, 1800);

    return () => {
      window.clearTimeout(timer);
    };
  }, [addedMessageVisible]);

  useEffect(() => {
    let mounted = true;

    const loadProduct = async () => {
      const numericId = Number(id);
      if (!Number.isFinite(numericId) || numericId <= 0) {
        if (mounted) {
          setProducto(null);
          setLoading(false);
        }
        return;
      }

      try {
        const [apiProducto, categorias] = await Promise.all([
          catalogService.getProductById(numericId),
          catalogService.getCategories(),
        ]);

        if (!mounted) return;
        setProducto(toUiProducto(apiProducto, categorias));
      } catch (error) {
        console.error("Error cargando detalle de producto:", error);
        if (mounted) setProducto(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProduct();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return <h1 className="text-center mt-20 dark:text-gray-300">Cargando producto...</h1>;
  }

  if (!producto) {
    return <h1 className="text-center mt-20 dark:text-gray-300">Producto no encontrado</h1>;
  }

  const baseImages = [producto.imagen].filter(Boolean);
  const productImages = Array.from({ length: 3 }, (_, index) => {
    if (baseImages.length === 0) return "";
    return baseImages[index % baseImages.length];
  });

  // const productCountInCart = cart
  //   .filter((item) => item.productId === producto.id)
  //   .reduce((acc, item) => acc + item.quantity, 0);

  const handleAddToCart = () => {
    addToCart({
      cartId: crypto.randomUUID(),
      productId: producto.id,
      name: producto.nombre,
      price: producto.precio,
      quantity: 1,
      image: producto.imagen,
      personalized: false,
    });
    setAddedMessageVisible(true);
  };

  return (
    <section className="min-h-screen bg-[#f5f3ef] dark:bg-gray-900 text-black dark:text-gray-300 transition-colors duration-300 px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 md:items-start md:gap-10">
        <div className="flex flex-col-reverse gap-4 md:flex-row md:justify-center">
          <div className="flex gap-3 overflow-x-auto pb-1 md:flex-col md:overflow-visible">
            {productImages.map((image, index) => (
              <button
                key={`thumb-${index}`}
                type="button"
                onClick={() => setSelectedImageIndex(index)}
                className={`h-20 w-20 shrink-0 rounded-xl overflow-hidden border bg-white cursor-pointer transition ${selectedImageIndex === index
                  ? "border-gray-700 dark:border-gray-300 shadow-sm"
                  : "border-gray-300 dark:border-gray-700"
                  }`}
              >
                <img
                  src={image}
                  alt={`${producto.nombre} vista ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          <div className="w-full max-w-2xl rounded-[28px] bg-white p-4 shadow-sm md:p-6">
            <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl bg-white">
            <img
              src={productImages[selectedImageIndex]}
              alt={producto.nombre}
                className="h-full w-full object-contain"
            />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 pt-2 md:gap-8 md:pt-10">
          <section className="flex flex-col gap-4 md:gap-2">
            <span className="text-sm text-red-400 capitalize">
              {producto.categoria}
            </span>
            <h1 className="flex flex-col text-3xl md:text-4xl font-semibold font-serif text-gray-900 dark:text-gray-300">
              {producto.nombre}
            </h1>

            <p className="text-xl font-bold text-gray-900 dark:text-gray-300 font-serif">
              ${producto.precio.toLocaleString()}
            </p>

            <p className="text-gray-500 dark:text-gray-300 leading-relaxed">
              {producto.descripcion}
            </p>
          </section>

          <div className="flex flex-col gap-4 md:gap-6">
            <section className="flex flex-col gap-2 md:gap-3">
              <button
                onClick={handleAddToCart}
                className="w-full border border-black dark:border-gray-600 hover:border-gray-400 flex gap-2 justify-center bg-black dark:bg-zinc-950 text-white dark:text-gray-300 py-3 rounded-xl cursor-pointer"
              >
                <ShoppingBag size={20} />
                Agregar al carrito
              </button>

              {addedMessageVisible && (
                <BadgeAlert alertText="Producto agregaddo correctamente a la bolsa de compras" />
              )}

              <button
                onClick={() => navigate(`/personalizacion?productId=${producto.id}`)}
                className="w-full border flex gap-2 justify-center border-red-300 text-red-400 hover:bg-red-500 hover:text-white transition duration-300 py-3 rounded-xl cursor-pointer"
              >
                <Stars size={20} />
                <span>
                  Personalizar con IA
                </span>
              </button>
            </section>

          </div>
          <section className="bg-[#EFEBE4] dark:bg-gray-800 p-4 text-sm font-extralight flex flex-col gap-2 rounded-xl">
            <p className="flex items-center">
              <span
                className={`${stock ? "bg-green-400" : "bg-red-600"} size-2.5 inline-block rounded-2xl mr-3`}
              ></span>
              En stock
            </p>
            <p className="flex items-center">
              <span
                className={`${customizable ? "bg-green-400" : "bg-red-600"} size-2.5 inline-block rounded-2xl mr-3`}
              ></span>
              Personalizable con IA
            </p>
          </section>
        </div>
      </div>
    </section>
  );
};
