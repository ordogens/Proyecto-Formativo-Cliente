import { Trash2 } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../context/shopContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { InvoiceModal } from "../../components/invoice/InvoiceModal";
import { useAuth } from "../../context/AuthContext";
import { orderService } from "../../services/order.service";
import { transactionsService } from "../../services/transactions.service";
import type { ApiCuentaBancaria, ApiFactura } from "../../types/api.types";

export const CarritoDeCompras = () => {
  const shop = useContext(ShopContext);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [facturaGenerada, setFacturaGenerada] = useState<ApiFactura | null>(null);
  const [creatingInvoice, setCreatingInvoice] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<ApiCuentaBancaria[]>([]);
  const [loadingMethods, setLoadingMethods] = useState(false);
  const [selectedMethodId, setSelectedMethodId] = useState<number | null>(null);

  if (!shop) throw new Error("ShopContext must be used inside ShopProvider");

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
  const isCartEmpty = cart.length === 0;
  const selectedMethod =
    paymentMethods.find((method) => method.id === selectedMethodId) ?? null;

  const loadPaymentMethods = async (userId: number) => {
    try {
      setLoadingMethods(true);
      const methods = await transactionsService.getAccountsByUser(userId);
      setPaymentMethods(methods);
      setSelectedMethodId((prev) =>
        prev && methods.some((method) => method.id === prev)
          ? prev
          : methods[0]?.id ?? null
      );
    } catch (error) {
      console.error("Error cargando metodos de pago:", error);
      setPaymentMethods([]);
      setSelectedMethodId(null);
    } finally {
      setLoadingMethods(false);
    }
  };

  useEffect(() => {
    const numericUserId = user?.id ? Number(user.id) : null;
    if (!numericUserId || Number.isNaN(numericUserId)) {
      setPaymentMethods([]);
      setSelectedMethodId(null);
      return;
    }

    void loadPaymentMethods(numericUserId);
  }, [user?.id]);

  const handleFinalizePurchase = async () => {
    if (isCartEmpty || creatingInvoice) return;

    if (!user?.id) {
      await Swal.fire({
        title: "Inicia sesión",
        text: "Necesitas iniciar sesión para generar la factura.",
        icon: "warning",
      });
      return;
    }

    if (!selectedMethodId) {
      await Swal.fire({
        title: "Selecciona un método de pago",
        text: "Debes elegir una cuenta bancaria antes de finalizar la compra.",
        icon: "warning",
      });
      return;
    }

    const productosFactura = cart.map((item) => ({
      nombre_producto: item.name,
      precio_unitario: item.price,
      cantidad: item.quantity,
      subtotal: item.price * item.quantity,
    }));

    setCreatingInvoice(true);

    try {
      const { factura } = await orderService.createInvoiceForCustomer({
        id_usuario: String(user.id),
        productos: productosFactura,
      });

      setFacturaGenerada(factura);
      setIsInvoiceOpen(true);

      const isDarkMode = document.documentElement.classList.contains("dark");

      await Swal.fire({
        title: "Compra exitosa",
        text: `La factura fue generada y enviada a tu correo. Metodo usado: ${selectedMethod?.banco ?? "cuenta bancaria"}.`,
        icon: "success",
        ...(isDarkMode && {
          background: "#101828",
          color: "#e5e7eb",
        }),
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.error("Error creando factura:", error);
      await Swal.fire({
        title: "No se pudo generar la factura",
        text: "Intenta nuevamente en unos segundos.",
        icon: "error",
      });
    } finally {
      setCreatingInvoice(false);
    }
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
            <p className="text-gray-500 dark:text-gray-300">
              Tu carrito esta vacio
            </p>
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

          <div className="mb-6 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between mb-3 gap-3">
              <h3 className="font-medium">Metodo de pago</h3>
              <button
                type="button"
                onClick={() => navigate("/metodos-pago")}
                className="text-sm text-red-500 hover:underline cursor-pointer"
              >
                Gestionar
              </button>
            </div>

            {loadingMethods && (
              <p className="text-sm text-gray-500 dark:text-gray-400">Cargando cuentas...</p>
            )}

            {!loadingMethods && paymentMethods.length === 0 && (
              <div className="space-y-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No tienes cuentas bancarias registradas.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/metodos-pago")}
                  className="w-full border border-red-300 text-red-500 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-gray-700 transition cursor-pointer"
                >
                  Agregar metodo de pago
                </button>
              </div>
            )}

            {!loadingMethods && paymentMethods.length > 0 && (
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition ${
                      selectedMethodId === method.id
                        ? "border-red-400 bg-red-50 dark:bg-gray-700"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      checked={selectedMethodId === method.id}
                      onChange={() => setSelectedMethodId(method.id)}
                    />
                    <div>
                      <p className="font-medium">{method.banco}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {method.tipo_de_cuenta} · terminada en {method.numero_de_cuenta.slice(-4)}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleFinalizePurchase}
            disabled={isCartEmpty || creatingInvoice || paymentMethods.length === 0}
            className={`w-full py-3 rounded-lg mb-3 transition ${
              isCartEmpty || creatingInvoice || paymentMethods.length === 0
                ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-300 cursor-not-allowed"
                : "bg-[#c65a4f] text-white hover:opacity-90 cursor-pointer"
            }`}
          >
            {creatingInvoice ? "Generando factura..." : "Finalizar compra"}
          </button>

          {facturaGenerada && (
            <InvoiceModal
              isOpen={isInvoiceOpen}
              onClose={() => setIsInvoiceOpen(false)}
              factura={facturaGenerada}
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
