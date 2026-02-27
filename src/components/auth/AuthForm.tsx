import { useState } from "react";
import { EyeIcon, EyeOffIcon, MailIcon, LockIcon } from "lucide-react";
import { CustomInput } from "../ui/inputs/CustomInput";
import { SocialButton } from "../ui/buttons/SocialBotton";
import { FacebookIcon } from "../icons/FacebookIcon";
import { GoogleIcon } from "../icons/GoogleIcon";
import Swal from "sweetalert2";

export const AuthForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.email ||
      !formData.password ||
      (!isLogin && !formData.username)
    ) {
      setError("Todos los campos son obligatorios");
      return;
    }

    Swal.fire({
      title: isLogin ? "Inicio de sesión exitoso" : "Registro exitoso",
      text: isLogin
        ? "Bienvenido de nuevo"
        : "Revisa tu correo, te enviamos un link de confirmacion de cuenta",
      icon: "success",
      confirmButtonColor: "#059669",
    });

    onSuccess();
  };

  //=======================ALERTS========================//

  return (
    <>
      <h1 className="text-black font-serif text-center text-2xl font-bold mb-6">
        {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
      </h1>

      <section className="flex flex-col gap-1">
        <SocialButton
          border="#ff6467"
          bgColor="#fffafa"
          icon={
            <GoogleIcon
              size={20}
              className="text-[#666666] group-hover:text-[#ff6467] transition-colors"
            />
          }
          text="Continuar con Google"
        />

        <SocialButton
          border="#0866ff"
          bgColor="#f4f8ff"
          icon={
            <FacebookIcon
              size={22}
              className="text-[#666666] group-hover:text-[#0866ff] transition-colors"
            />
          }
          text="Continuar con Facebook"
        />
      </section>

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
          label="Correo electrónico"
          name="email"
          type="email"
          value={formData.email}
          placeholder="tu@email.com"
          icon={<MailIcon size={18} className="" />}
          onChange={handleChange}
        />

        <CustomInput
          label="Contraseña"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          placeholder="Tu contraseña"
          icon={<LockIcon size={18} className="" />}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
          }
          onChange={handleChange}
        />

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          className="w-full bg-red-500/90 hover:bg-red-500 text-white transition px-6 py-2 mt-2 rounded-lg font-medium cursor-pointer"
        >
          {isLogin ? "Iniciar sesión" : "Crear cuenta"}
        </button>
      </form>
      <div className="flex justify-center mt-4 text-sm">
        {isLogin ? (
          <>
            <p>¿No tienes cuenta?</p>
            <p
              onClick={() => setIsLogin(false)}
              className="ml-1 text-red-500 cursor-pointer hover:underline"
            >
              Regístrate aquí
            </p>
          </>
        ) : (
          <>
            <p>¿Ya tienes cuenta?</p>
            <p
              onClick={() => setIsLogin(true)}
              className="ml-1 text-red-500 cursor-pointer hover:underline"
            >
              Inicia sesión
            </p>
          </>
        )}
      </div>
    </>
  );
};
