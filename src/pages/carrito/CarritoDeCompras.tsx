import { Trash2 } from "lucide-react";
import { useContext, useState } from "react";
import { ShopContext } from "../../context/shopContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { InvoiceModal } from "../../components/invoice/InvoiceModal";

export const CarritoDeCompras = () => {
  const shop = useContext(ShopContext);
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(false)
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  if (!shop)
    throw new Error("ShopContext must be used inside ShopProvider");

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

  const handleFinalizePurchase = () => {
    const isDarkMode = document.documentElement.classList.contains("dark");

    Swal.fire({
      title: "Compra exitosa",
      text: "Dirigite a tu correo para revisar el mail que te llego.",
      icon: "success",
      confirmButtonText: "Entendido",
      confirmButtonColor: "#fb2c36",
      ...(isDarkMode && {
        background: "#101828",
        color: "#e5e7eb",
      }),
    });
  };

  return (
    <div className="min-h-screen bg-[#f5f2ee] dark:bg-gray-900 text-black dark:text-gray-300 transition-colors duration-300 p-4 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif">Tu carrito</h1>
        <p className="text-gray-500 dark:text-gray-300 text-sm mt-2">
          {totalItems} articulos en tu carrito
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          {cart.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-300">Tu carrito esta vacio</p>
          ) : (
            cart.map((item) => (
              <div
                key={item.cartId}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex gap-4 items-center transition-colors duration-300"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>

                      {item.personalized && (
                        <p className="text-xs text-red-500 mt-1">
                          + Personalizado con IA
                        </p>
                      )}
                    </div>

                    <Trash2
                      size={18}
                      className="text-gray-400 dark:text-gray-300 cursor-pointer"
                      onClick={() => removeFromCart(item.cartId)}
                    />
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 gap-4">
                      <button onClick={() => decreaseQuantity(item.cartId)}>
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button onClick={() => increaseQuantity(item.cartId)}>
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="font-semibold text-right">
                  ${(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="w-full lg:w-[350px] bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm h-fit transition-colors duration-300">
          <h2 className="text-xl font-serif mb-4">Resumen del pedido</h2>

          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
            <span>Subtotal</span>
            <span>${total.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-4">
            <span>Envio</span>
            <span>${shipping.toLocaleString()}</span>
          </div>

          <hr className="mb-4 border-gray-300 dark:border-gray-600" />

          <div className="flex justify-between font-semibold mb-6">
            <span>Total</span>
            <span>${finalTotal.toLocaleString()}</span>
          </div>

          <button
            onClick={() => {
              handleFinalizePurchase();
              setInvoice(true);
              setIsInvoiceOpen(true);
            }}
            className="w-full bg-[#c65a4f] text-white py-3 rounded-lg mb-3 hover:opacity-90 transition cursor-pointer"
          >
            Finalizar compra
          </button>

          {invoice && (
            // <Invoice onClose={() => setInvoice(false)} />
            <InvoiceModal
              isOpen={isInvoiceOpen}
              onClose={() => setIsInvoiceOpen(false)}
            />
          )}

          <button
            onClick={() => navigate("/catalogo")}
            className="w-full border border-gray-300 dark:border-gray-600 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
          >
            Seguir comprando
          </button>
        </div>
      </div>
    </div>
  );
};
