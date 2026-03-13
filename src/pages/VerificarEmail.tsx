import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { authService } from "../services/auth.service";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | {
          message?: string;
          error?: string;
          mensaje?: string;
          detalle?: string;
          details?: string;
        }
      | undefined;

    const directMessage =
      data?.message ??
      data?.mensaje ??
      data?.error ??
      data?.detalle ??
      data?.details;

    if (typeof directMessage === "string" && directMessage.trim()) {
      return directMessage.trim();
    }

    if (typeof error.message === "string" && error.message.trim()) {
      return error.message.trim();
    }

    return fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

export const VerificarEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Verificando tu correo...");

  useEffect(() => {
    const token = searchParams.get("token")?.trim();

    if (!token) {
      const fallback = "Token inválido o inexistente.";
      setStatus("error");
      setMessage(fallback);
      void Swal.fire({
        icon: "error",
        title: "Error",
        text: fallback,
        confirmButtonColor: "#ef4444",
      }).then(() => navigate("/"));
      return;
    }

    authService
      .verifyEmail(token)
      .then((responseMessage) => {
        const successMessage =
          responseMessage || "Correo verificado. Ya puedes iniciar sesión.";
        setStatus("success");
        setMessage(successMessage);
        return Swal.fire({
          icon: "success",
          title: "Correo verificado",
          text: successMessage,
          confirmButtonColor: "#ef4444",
        });
      })
      .then(() => navigate("/"))
      .catch((error) => {
        const errorMessage = getErrorMessage(
          error,
          "No se pudo verificar el correo. Intenta de nuevo."
        );
        setStatus("error");
        setMessage(errorMessage);
        void Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
          confirmButtonColor: "#ef4444",
        }).then(() => navigate("/"));
      });
  }, [navigate, searchParams]);

  return (
    <section
      className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4"
    >
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100">
        {status === "loading" ? "Verificando correo" : "Estado de verificación"}
      </h1>
      <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-xl">
        {message}
      </p>
      <button
        type="button"
        className="mt-6 border border-zinc-200 dark:border-gray-600 hover:bg-red-500 hover:text-white py-2 px-4 rounded-md cursor-pointer transition-colors duration-200"
        onClick={() => navigate("/")}
      >
        Ir al inicio
      </button>
    </section>
  );
};
