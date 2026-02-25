import { Trash2 } from "lucide-react";
import modelo from "../../assets/photo.png";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  personalized?: boolean;
  image: string;
}

const cartItems: CartItem[] = [
  {
    id: 1,
    name: "Nombre producto",
    price: 10000,
    quantity: 2,
    image: modelo,
  },
  {
    id: 2,
    name: "Nombre producto",
    price: 15000,
    quantity: 1,
    personalized: true,
    image: modelo,
  },
  {
    id: 3,
    name: "Nombre producto",
    price: 50000,
    quantity: 4,
    image: modelo,
  },
  {
    id: 4,
    name: "Nombre producto",
    price: 30000,
    quantity: 2,
    personalized: true,
    image: modelo,
  },
];
export const CarritoDeCompras = () => {
  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);

  const shipping = 9000;

  const total = subtotal;

  return (
    <div className="h-full bg-[#f5f2ee] p-4 md:p-10">
      {/* Título */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif">Tu carrito</h1>
        <p className="text-gray-500 text-sm mt-2">
          {cartItems.length} artículos en tu carrito
        </p>
      </div>

      {/* Layout principal */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Lista de productos */}
        <div className="flex-1 space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl p-4 shadow-sm flex gap-4 items-center"
            >
              {/* Imagen */}
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 rounded-lg object-cover"
              />

              {/* Info */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>

                    {item.personalized && (
                      <p className="text-xs text-red-400 mt-1">
                        + Personalizado con IA
                      </p>
                    )}
                  </div>

                  <Trash2 size={18} className="text-gray-400 cursor-pointer" />
                </div>

                {/* Cantidad */}
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex items-center border rounded-md px-3 py-1 gap-4">
                    <button>-</button>
                    <span>{item.quantity}</span>
                    <button>+</button>
                  </div>
                </div>
              </div>

              {/* Precio */}
              <div className="font-semibold text-right">
                ${item.price.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="w-full lg:w-[350px] bg-white rounded-xl p-6 shadow-sm h-fit">
          <h2 className="text-xl font-serif mb-4">Resumen del pedido</h2>

          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Subtotal</span>
            <span>${subtotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-sm text-gray-600 mb-4">
            <span>Envío</span>
            <span>${shipping.toLocaleString()}</span>
          </div>

          <hr className="mb-4" />

          <div className="flex justify-between font-semibold mb-6">
            <span>Total</span>
            <span>${total.toLocaleString()}</span>
          </div>

          <button className="w-full bg-[#c65a4f] text-white py-3 rounded-lg mb-3 hover:opacity-90 transition">
            Finalizar compra
          </button>

          <button className="w-full border py-3 rounded-lg hover:bg-gray-50 transition">
            Seguir comprando
          </button>
        </div>
      </div>
    </div>
  );
};
