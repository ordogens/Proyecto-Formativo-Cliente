const EPAYCO_SCRIPT_SRC = "https://checkout.epayco.co/checkout.js";

declare global {
  interface Window {
    ePayco?: {
      checkout: {
        configure: (config: { key: string; test?: boolean }) => {
          open: (data: Record<string, unknown>) => void;
        };
      };
    };
  }
}

let epaycoScriptPromise: Promise<void> | null = null;

function loadEpaycoScript() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("ePayco solo puede cargarse en el navegador."));
  }

  if (window.ePayco?.checkout) {
    return Promise.resolve();
  }

  if (epaycoScriptPromise) {
    return epaycoScriptPromise;
  }

  epaycoScriptPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${EPAYCO_SCRIPT_SRC}"]`
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("No se pudo cargar el script de ePayco.")),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.src = EPAYCO_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("No se pudo cargar el script de ePayco."));
    document.body.appendChild(script);
  });

  return epaycoScriptPromise;
}

export async function openEpaycoCheckout(checkoutConfig: Record<string, unknown>) {
  const key = String(checkoutConfig.key ?? "").trim();
  const test = Boolean(checkoutConfig.test);

  if (!key) {
    throw new Error("La configuracion del checkout no incluye la llave publica de ePayco.");
  }

  await loadEpaycoScript();

  if (!window.ePayco?.checkout) {
    throw new Error("ePayco no quedo disponible despues de cargar el script.");
  }

  const { key: _key, test: _test, provider: _provider, ...openConfig } = checkoutConfig;
  const handler = window.ePayco.checkout.configure({ key, test });
  handler.open(openConfig);
}
