import { useState } from "react";
import {
  EyeIcon,
  EyeOffIcon,
  MailIcon,
  LockIcon,
  Facebook,
  Chromium,
} from "lucide-react";
import { CustomInput } from "../ui/inputs/CustomInput";
import { SocialButton } from "../ui/buttons/SocialBotton";

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

    alert(isLogin ? "Login simulado ✅" : "Registro simulado ✅");

    onSuccess();
  };

  return (
    <>
      <h1 className="text-red-500 text-center text-2xl font-bold mb-4">
        {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
      </h1>
      
      <SocialButton icon={<Chromium size={20} />} text="Continuar con Google" />
      <SocialButton
        icon={<Facebook size={20} />}
        text="Continuar con Facebook"
      />
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
          icon={<MailIcon size={18} />}
          onChange={handleChange}
        />

        <CustomInput
          label="Contraseña"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          placeholder="Tu contraseña"
          icon={<LockIcon size={18} />}
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
          className="w-full rounded-md bg-emerald-600 px-6 py-3 text-white text-sm font-medium hover:bg-emerald-700 transition"
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
