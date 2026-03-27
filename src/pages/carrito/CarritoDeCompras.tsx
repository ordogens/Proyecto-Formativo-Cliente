import { Trash2 } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { ShopContext } from "../../context/shopContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { InvoiceModal } from "../../components/invoice/InvoiceModal";
import { useAuth } from "../../context/AuthContext";
import { orderService } from "../../services/order.service";
import { transactionsService } from "../../services/transactions.service";
import type {
  ApiCheckoutCustomer,
  ApiCheckoutResponse,
  ApiCuentaBancaria,
  ApiFactura,
  ApiPagoEpayco,
} from "../../types/api.types";

type EpaycoHandler = {
  open: (config: Record<string, unknown>) => void;
};

type EpaycoInstance = {
  checkout: {
    configure: (config: Record<string, unknown>) => EpaycoHandler;
  };
};

const EPAYCO_SCRIPT_ID = "epayco-checkout-script";
const EPAYCO_SCRIPT_SRC = "https://checkout.epayco.co/checkout.js";
const FINAL_PAYMENT_STATUSES = new Set<string>([
  "APROBADA",
  "RECHAZADA",
  "ERROR",
  "CANCELADA",
  "EXPIRADA",
]);

let epaycoScriptPromise: Promise<EpaycoInstance> | null = null;

const getEpaycoInstance = () => {
  return (window as Window & { ePayco?: EpaycoInstance }).ePayco;
};

const loadEpaycoScript = async (): Promise<EpaycoInstance> => {
  const existing = getEpaycoInstance();
  if (existing) {
    return existing;
  }

  if (!epaycoScriptPromise) {
    epaycoScriptPromise = new Promise<EpaycoInstance>((resolve, reject) => {
      const currentScript = document.getElementById(EPAYCO_SCRIPT_ID) as HTMLScriptElement | null;

      if (currentScript) {
        currentScript.addEventListener("load", () => {
          const epayco = getEpaycoInstance();
          if (epayco) {
            resolve(epayco);
            return;
          }

          reject(new Error("El script de ePayco cargó, pero no expuso la librería."));
        });

        currentScript.addEventListener("error", () => {
          reject(new Error("No se pudo cargar el script de ePayco."));
        });

        return;
      }

      const script = document.createElement("script");
      script.id = EPAYCO_SCRIPT_ID;
      script.src = EPAYCO_SCRIPT_SRC;
      script.async = true;

      script.onload = () => {
        const epayco = getEpaycoInstance();
        if (epayco) {
          resolve(epayco);
          return;
        }

        reject(new Error("El script de ePayco cargó, pero no expuso la librería."));
      };

      script.onerror = () => {
        reject(new Error("No se pudo cargar el script de ePayco."));
      };

      document.body.appendChild(script);
    }).catch((error) => {
      epaycoScriptPromise = null;
      throw error;
    });
  }

  return epaycoScriptPromise;
};

const sleep = (ms: number) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

const buildOrderId = (userId: string) => `ORD-${userId}-${Date.now()}`;

const normalizeCheckoutConfig = (
  checkoutConfig: Record<string, unknown>
) => {
  const { provider: _provider, ...rest } = checkoutConfig;
  return rest;
};

const getPaymentStatusMessage = (payment: ApiPagoEpayco) => {
  switch (payment.status) {
    case "APROBADA":
      return "Tu pago fue aprobado correctamente.";
    case "RECHAZADA":
      return "El pago fue rechazado por ePayco.";
    case "ERROR":
      return "El pago presentó un error durante la confirmación.";
    case "CANCELADA":
      return "El pago fue cancelado.";
    case "EXPIRADA":
      return "La sesión de pago expiró.";
    default:
      return "El pago sigue pendiente de confirmación.";
  }
};

const requestBillingInfo = async (defaultName: string) => {
  const result = await Swal.fire({
    title: "Datos para ePayco",
    html: `
      <input id="epayco-name" class="swal2-input" placeholder="Nombre completo" value="${defaultName}">
      <input id="epayco-email" class="swal2-input" placeholder="Correo electrónico" type="email">
      <input id="epayco-phone" class="swal2-input" placeholder="Celular">
      <select id="epayco-doc-type" class="swal2-select">
        <option value="CC">CC</option>
        <option value="CE">CE</option>
        <option value="NIT">NIT</option>
        <option value="PPN">Pasaporte</option>
      </select>
      <input id="epayco-doc-number" class="swal2-input" placeholder="Número de documento">
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Continuar al pago",
    cancelButtonText: "Cancelar",
    preConfirm: () => {
      const popup = Swal.getPopup();
      const name = popup?.querySelector<HTMLInputElement>("#epayco-name")?.value.trim() ?? "";
      const email = popup?.querySelector<HTMLInputElement>("#epayco-email")?.value.trim() ?? "";
      const phone = popup?.querySelector<HTMLInputElement>("#epayco-phone")?.value.trim() ?? "";
      const docType = popup?.querySelector<HTMLSelectElement>("#epayco-doc-type")?.value ?? "CC";
      const docNumber =
        popup?.querySelector<HTMLInputElement>("#epayco-doc-number")?.value.trim() ?? "";

      if (!name || !email || !phone || !docNumber) {
        Swal.showValidationMessage("Completa nombre, correo, celular y documento.");
        return;
      }

      return {
        name,
        email,
        phone,
        docType,
        docNumber,
      } satisfies ApiCheckoutCustomer;
    },
  });

  if (!result.isConfirmed || !result.value) {
    return null;
  }

  return result.value;
};

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
  const [isPaying, setIsPaying] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [pendingPaymentReference, setPendingPaymentReference] = useState<string | null>(null);
  const [pendingPaymentStatus, setPendingPaymentStatus] = useState<string | null>(null);
  const processedPaymentsRef = useRef<Set<string>>(new Set());

  if (!shop) throw new Error("ShopContext must be used inside ShopProvider");

  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    total,
    totalItems,
  } = shop;

  const shipping = 9000;
  const finalTotal = total + shipping;
  const isCartEmpty = cart.length === 0;

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

  const finalizeApprovedPayment = async (payment: ApiPagoEpayco) => {
    if (processedPaymentsRef.current.has(payment.provider_reference)) {
      return;
    }

    processedPaymentsRef.current.add(payment.provider_reference);
    setCreatingInvoice(true);

    const productosFactura = cart.map((item) => ({
      nombre_producto: item.name,
      precio_unitario: item.price,
      cantidad: item.quantity,
      subtotal: item.price * item.quantity,
    }));

    try {
      const { factura } = await orderService.createInvoiceForCustomer({
        id_usuario: String(user?.id ?? ""),
        productos: productosFactura,
      });

      setFacturaGenerada(factura);
      setIsInvoiceOpen(true);
      setPendingPaymentReference(null);
      setPendingPaymentStatus("APROBADA");
      clearCart();

      const isDarkMode = document.documentElement.classList.contains("dark");
      await Swal.fire({
        title: "Pago aprobado",
        text: "Tu factura fue generada y enviada a tu correo.",
        icon: "success",
        ...(isDarkMode && {
          background: "#101828",
          color: "#e5e7eb",
        }),
      });
    } catch (error) {
      processedPaymentsRef.current.delete(payment.provider_reference);
      console.error("Error creando factura:", error);
      await Swal.fire({
        title: "Pago aprobado, pero falló la factura",
        text: "El pago quedó aprobado. Intenta nuevamente para generar la factura.",
        icon: "warning",
      });
    } finally {
      setCreatingInvoice(false);
    }
  };

  const checkPaymentStatus = async (reference: string, silent = false) => {
    try {
      setIsCheckingPayment(true);
      const payment = await transactionsService.getPayment(reference);
      setPendingPaymentStatus(payment.status);

      if (payment.status === "APROBADA") {
        await finalizeApprovedPayment(payment);
        return payment;
      }

      if (!silent) {
        await Swal.fire({
          title:
            payment.status === "PENDIENTE"
              ? "Pago pendiente"
              : "Estado del pago actualizado",
          text: getPaymentStatusMessage(payment),
          icon: payment.status === "PENDIENTE" ? "info" : "warning",
        });
      }

      if (payment.status !== "PENDIENTE") {
        setPendingPaymentReference(null);
      }

      return payment;
    } catch (error) {
      console.error("Error consultando pago:", error);
      if (!silent) {
        await Swal.fire({
          title: "No se pudo consultar el pago",
          text: "Intenta nuevamente en unos segundos.",
          icon: "error",
        });
      }
      return null;
    } finally {
      setIsCheckingPayment(false);
    }
  };

  const pollPaymentStatus = async (reference: string) => {
    for (let attempt = 0; attempt < 12; attempt += 1) {
      await sleep(5000);

      const payment = await checkPaymentStatus(reference, true);
      if (!payment || FINAL_PAYMENT_STATUSES.has(payment.status)) {
        return;
      }
    }
  };

  const openEpaycoCheckout = async (checkout: ApiCheckoutResponse) => {
    const epayco = await loadEpaycoScript();
    const handler = epayco.checkout.configure({
      key: checkout.checkoutConfig.key,
      test: checkout.checkoutConfig.test,
    });

    handler.open(normalizeCheckoutConfig(checkout.checkoutConfig));
  };

  const handleFinalizePurchase = async () => {
    if (isCartEmpty || creatingInvoice || isPaying) return;

    if (!user?.id) {
      await Swal.fire({
        title: "Inicia sesión",
        text: "Necesitas iniciar sesión para iniciar el pago con ePayco.",
        icon: "warning",
      });
      return;
    }

    const billingInfo = await requestBillingInfo(user.name);
    if (!billingInfo) {
      return;
    }

    setIsPaying(true);

    try {
      const checkout = await transactionsService.createCheckout({
        orderId: buildOrderId(user.id),
        userId: Number(user.id),
        amount: finalTotal,
        description: `Pago pedido CraftYourStyle (${totalItems} artículos)`,
        currency: "COP",
        tax: 0,
        taxBase: finalTotal,
        customer: billingInfo,
      });

      setPendingPaymentReference(checkout.payment.provider_reference);
      setPendingPaymentStatus(checkout.payment.status);
      await openEpaycoCheckout(checkout);
      await Swal.fire({
        title: "Checkout abierto",
        text: "Completa el pago en ePayco. Cuando vuelva la confirmación, validaremos el estado automáticamente.",
        icon: "info",
      });

      void pollPaymentStatus(checkout.payment.provider_reference);
    } catch (error) {
      console.error("Error iniciando checkout:", error);
      await Swal.fire({
        title: "No se pudo iniciar el pago",
        text: "Verifica la configuración de ePayco e inténtalo nuevamente.",
        icon: "error",
      });
    } finally {
      setIsPaying(false);
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
              <h3 className="font-medium">Cuentas guardadas</h3>
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
                  No tienes cuentas bancarias registradas. Puedes pagar con ePayco igualmente.
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

            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              El cobro final se procesa con ePayco. Si quieres, puedes conservar aquí tus cuentas bancarias como referencia.
            </p>
          </div>

          <button
            onClick={handleFinalizePurchase}
            disabled={isCartEmpty || creatingInvoice || isPaying}
            className={`w-full py-3 rounded-lg mb-3 transition ${
              isCartEmpty || creatingInvoice || isPaying
                ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-300 cursor-not-allowed"
                : "bg-[#c65a4f] text-white hover:opacity-90 cursor-pointer"
            }`}
          >
            {creatingInvoice
              ? "Generando factura..."
              : isPaying
                ? "Abriendo ePayco..."
                : "Pagar con ePayco"}
          </button>

          {pendingPaymentReference && (
            <button
              type="button"
              onClick={() => void checkPaymentStatus(pendingPaymentReference)}
              disabled={isCheckingPayment || creatingInvoice}
              className="w-full border border-[#c65a4f] text-[#c65a4f] py-3 rounded-lg mb-3 hover:bg-red-50 dark:hover:bg-gray-700 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isCheckingPayment
                ? "Consultando estado..."
                : `Verificar pago${pendingPaymentStatus ? ` (${pendingPaymentStatus})` : ""}`}
            </button>
          )}

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
