import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { productos } from "../../data/Productos";
import { ShopContext } from "../../context/shopContext";
import { useNavigate } from "react-router-dom";
import { Stars } from "../../components/icons/Stars";
import { BadgeAlert } from "../../components/ui/BadgeAlert";
import { ShoppingBag } from "lucide-react";

export const VistaDinamica = () => {
  const { id } = useParams();
  const shop = useContext(ShopContext);
  const navigate = useNavigate();
  const [stock, useStock] = useState(true);
  const [customizable, useCustomizable] = useState(false)

  if (!shop) {
    throw new Error("Must be inside ShopProvider");
  }

  const { addToCart, /*cart*/ } = shop;
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
    <section className="h-full bg-[#f5f3ef] flex md:justify-center px-6 ">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 md:gap-10 md:items-center">

        <div className="flex justify-center md:scale-120">
          <div className="max-w-md h-fit md:h-lg md:max-w-lg rounded-2xl overflow-hidden shadow-sm">
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-screen md:w-full h-100 md:h-130 object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col md:h-130 gap-4 md:gap-8 md:justify-center md:scale-120">
          <section className="flex flex-col gap-4 md:gap-2">
            <span className="text-sm text-red-400 capitalize">
              {producto.categoria}
            </span>
            <h1 className="flex flex-col text-3xl md:text-4xl font-semibold font-serif text-gray-900">
              {producto.nombre}
            </h1>

            <p className="text-xl font-bold text-gray-900 font-serif">
              ${producto.precio.toLocaleString()}
            </p>

            <p className="text-gray-500 leading-relaxed">
              {producto.descripcion}
            </p>
          </section>

          <div className="flex flex-col gap-4 md:gap-8">
            <section className="flex flex-col gap-2 md:gap-3">
              <button
                onClick={handleAddToCart}
                className="w-full border flex gap-2 justify-center bg-black text-white py-3 rounded-lg cursor-pointer"
              >
                <ShoppingBag size={20} />
                Agregar al carrito
              </button>

              {addedMessageVisible && (
                <BadgeAlert alertText="Producto agregaddo correctamente a la bolsa de compras" />
              )}

              <button onClick={() => navigate("/personalizacion")} className="w-full border flex gap-2 justify-center border-red-300 text-red-400 hover:bg-red-500 hover:text-white transition duration-300 py-3 rounded-lg cursor-pointer">
                <Stars size={20} />
                <span>
                  Personalizar con IA
                </span>
              </button>
            </section>

          </div>
          <section className="bg-[#EFEBE4] p-4 text-sm font-extralight flex flex-col gap-2 rounded-lg">
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
