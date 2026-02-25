import { Trash2 } from "lucide-react";
import { useContext } from "react";
import { ShopContext } from "../../context/shopContext";
import { useNavigate } from "react-router-dom";

export const CarritoDeCompras = () => {
  const shop = useContext(ShopContext);
  const navigate = useNavigate();

  if (!shop) {
    throw new Error("ShopContext must be used inside ShopProvider");
  }

  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    total,
    totalItems,
  } = shop;

  const shipping = 9000;
  const finalTotal = total + shipping;

  return (
    <div className="min-h-screen bg-[#f5f2ee] p-4 md:p-10">
      {/* Título */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif">Tu carrito</h1>
        <p className="text-gray-500 text-sm mt-2">
          {totalItems} artículos en tu carrito
        </p>
      </div>

      {/* Layout principal */}
      <div className="flex flex-col lg:flex-row gap-8 ">
        {/* Lista de productos */}
        <div className="flex-1 space-y-6">
          {cart.length === 0 ? (
            <p className="text-gray-500">Tu carrito está vacío</p>
          ) : (
            cart.map((item) => (
              <div
                key={item.cartId}
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

                    <Trash2
                      size={18}
                      className="text-gray-400 cursor-pointer"
                      onClick={() => removeFromCart(item.cartId)}
                    />
                  </div>

                  {/* Cantidad */}
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex items-center border rounded-md px-3 py-1 gap-4">
                      <button
                        onClick={() => decreaseQuantity(item.cartId)}
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() => increaseQuantity(item.cartId)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Precio */}
                <div className="font-semibold text-right">
                  ${(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Resumen */}
        <div className="w-full lg:w-[350px] bg-white rounded-xl p-6 shadow-sm h-fit">
          <h2 className="text-xl font-serif mb-4">Resumen del pedido</h2>

          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Subtotal</span>
            <span>${total.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-sm text-gray-600 mb-4">
            <span>Envío</span>
            <span>${shipping.toLocaleString()}</span>
          </div>

          <hr className="mb-4" />

          <div className="flex justify-between font-semibold mb-6">
            <span>Total</span>
            <span>${finalTotal.toLocaleString()}</span>
          </div>

          <button className="w-full bg-[#c65a4f] text-white py-3 rounded-lg mb-3 hover:opacity-90 transition cursor-pointer">
            Finalizar compra
          </button>

          <button 
              onClick={() => navigate("/catalogo")}
          className="w-full border py-3 rounded-lg hover:bg-gray-50 transition cursor-pointer">
            Seguir comprando
          </button>
        </div>
      </div>
    </div>
  );
};