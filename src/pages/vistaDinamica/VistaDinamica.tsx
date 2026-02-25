import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { productos } from "../../data/Productos";
import { ShopContext } from "../../context/shopContext";

export const VistaDinamica = () => {
  const { id } = useParams();
  const shop = useContext(ShopContext);

  if (!shop) {
    throw new Error("Must be inside ShopProvider");
  }

  const { addToCart, cart } = shop;
  const [addedMessageVisible, setAddedMessageVisible] = useState(false);

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

  const producto = productos.find(
    (p) => p.id === Number(id)
  );

  if (!producto) {
    return <h1 className="text-center mt-20">Producto no encontrado</h1>;
  }

  const productCountInCart = cart
    .filter((item) => item.productId === producto.id)
    .reduce((acc, item) => acc + item.quantity, 0);

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
    <section className="h-full bg-[#f5f3ef] flex items-center justify-center px-4 py-10">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        <div className="flex justify-center">
          <div className="max-w-md md:max-w-lg rounded-2xl overflow-hidden shadow-sm">
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-full h-96 md:h-130 object-cover"
            />
          </div>
        </div>

        <div className="space-y-6">
          <span className="text-sm text-red-400 capitalize">
            {producto.categoria}
          </span>

          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
            {producto.nombre}
          </h1>

          <p className="text-xl font-bold text-gray-900">
            ${producto.precio.toLocaleString()}
          </p>

          <p className="text-gray-500 leading-relaxed">
            {producto.descripcion}
          </p>

          <div className="space-y-3">
            <button
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-3 rounded-lg cursor-pointer"
            >
              Agregar al carrito
            </button>

            {addedMessageVisible && (
              <p className="text-sm text-green-700 font-medium">
                Se agregó al carrito
              </p>
            )}

            <p className="text-sm text-gray-600">
              En carrito: <span className="font-semibold">{productCountInCart}</span>
            </p>

            <button className="w-full border border-red-300 text-red-400 py-3 rounded-lg cursor-pointer">
              Personalizar con IA
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
