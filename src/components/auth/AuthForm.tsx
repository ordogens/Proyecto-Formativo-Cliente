import { useState } from "react";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import type { LoginCredentials, RegisterData } from "../../types/auth.types";
import { FacebookIcon } from "../icons/FacebookIcon";
import { GoogleIcon } from "../icons/GoogleIcon";
import { SocialButton } from "../ui/buttons/SocialBotton";
import { CustomInput } from "../ui/inputs/CustomInput";

export const AuthForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, loginWithGoogle, register } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password || (!isLogin && !formData.username)) {
      setError("Todos los campos son obligatorios");
      return;
    }

    const loginPayload: LoginCredentials = {
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    };

    const registerPayload: RegisterData = {
      username: formData.username.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    };

    setIsSubmitting(true);
    const result = isLogin
      ? await login(loginPayload)
      : await register(registerPayload);
    setIsSubmitting(false);

    if (!result.ok) {
      const message = result.error ?? "No se pudo completar la operacion";
      setError(message);
      Swal.fire({
        title: "Error",
        text: message,
        icon: "error",
        confirmButtonColor: "#fb2c36",
      });
      return;
    }

    const isDarkMode = document.documentElement.classList.contains("dark");
    Swal.fire({
      title: isLogin ? "Inicio de sesion exitoso" : "Registro exitoso",
      text: isLogin
        ? "Bienvenido de nuevo"
        : "Tu cuenta fue creada correctamente",
      icon: "success",
      confirmButtonColor: "#fb2c36",
      ...(isDarkMode && {
        background: "#101828",
        color: "#e5e7eb",
      }),
    });

    onSuccess();
  };

  return (
    <>
      <h1 className="mb-6 text-center text-2xl font-bold font-serif text-black dark:text-gray-100">
        {isLogin ? "Iniciar sesion" : "Crear cuenta"}
      </h1>

      <section className="flex flex-col gap-1">
      <SocialButton
          border="#ff6467"
          bgColor="#fffafa"
          icon={
            <GoogleIcon
              size={20}
              className="text-[#666666] transition-colors group-hover:text-[#ff6467]"
            />
          }
          text="Continuar con Google"
          disabled={isSubmitting}
          onClick={async () => {
            setIsSubmitting(true);
            setError("");
            const result = await loginWithGoogle();
            setIsSubmitting(false);

            if (!result.ok) {
              const message = result.error ?? "No se pudo iniciar sesion con Google";
              setError(message);
              Swal.fire({
                title: "Error",
                text: message,
                icon: "error",
                confirmButtonColor: "#fb2c36",
              });
              return;
            }

            const isDarkMode = document.documentElement.classList.contains("dark");
            Swal.fire({
              title: "Inicio de sesion exitoso",
              text: "Bienvenido",
              icon: "success",
              confirmButtonColor: "#fb2c36",
              ...(isDarkMode && {
                background: "#101828",
                color: "#e5e7eb",
              }),
            });

            onSuccess();
          }}
        />

        <SocialButton
          border="#0866ff"
          bgColor="#f4f8ff"
          icon={
            <FacebookIcon
              size={22}
              className="text-[#666666] transition-colors group-hover:text-[#0866ff]"
            />
          }
          text="Continuar con Facebook"
        />
      </section>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {!isLogin && (
          <CustomInput
            label="Nombre de usuario"
            name="username"
            type="text"
            value={formData.username}
            placeholder="Tu nombre"
            onChange={handleChange}
          />
        )}

        <CustomInput
          label="Correo electronico"
          name="email"
          type="email"
          value={formData.email}
          placeholder="tu@email.com"
          icon={<MailIcon size={18} />}
          onChange={handleChange}
        />

        <CustomInput
          label="Contrasena"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          placeholder="Tu contrasena"
          icon={<LockIcon size={18} />}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
          }
          onChange={handleChange}
        />

        {error && <p className="text-center text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full cursor-pointer rounded-lg bg-red-500/90 px-6 py-2 font-medium text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting
            ? "Procesando..."
            : isLogin
              ? "Iniciar sesion"
              : "Crear cuenta"}
        </button>
      </form>

      <div className="mt-4 flex justify-center text-sm text-gray-700 dark:text-gray-300">
        {isLogin ? (
          <>
            <p>No tienes cuenta?</p>
            <p
              onClick={() => setIsLogin(false)}
              className="ml-1 cursor-pointer text-red-500 hover:underline"
            >
              Registrate aqui
            </p>
          </>
        ) : (
          <>
            <p>Ya tienes cuenta?</p>
            <p
              onClick={() => setIsLogin(true)}
              className="ml-1 cursor-pointer text-red-500 hover:underline"
            >
              Inicia sesion
            </p>
          </>
        )}
      </div>
    </>
  );
};
