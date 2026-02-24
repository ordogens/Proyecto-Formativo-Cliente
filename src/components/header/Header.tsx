import { ShoppingCart, Moon, Sun, LogIn } from "lucide-react";
import { NavLink } from "react-router-dom";

export const Header = () => {
  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-10xl mx-auto px-4 h-16 flex justify-between items-center">

        {/* Logo */}
        <NavLink to="/" className="text-2xl font-semibold">
          CraftYourStyle
        </NavLink>

        {/* Navegación */}
        <nav className="hidden md:flex gap-10">
          <NavLink to="/personalizacion" className="hover:text-red-500 transition">
            Personalización
          </NavLink>
          <NavLink to="/catalogo" className="hover:text-red-500 transition">
            Catálogo
          </NavLink>
        </nav>

        {/* Iconos */}
        <div className="flex gap-4 items-center">
          <ShoppingCart size={30} />
          <Moon size={30} />
          <Sun size={30} />
          <LogIn size={30} />
        </div>

      </div>
    </header>
  );
};