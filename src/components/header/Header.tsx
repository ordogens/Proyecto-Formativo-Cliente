import { ShoppingCart, Moon, Sun, LogIn, Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";

export const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full border-b border-gray-200">

      {/* Barra principal */}
      <div className="w-full bg-gray-200 md:bg-white h-16 flex justify-between items-center px-4 md:px-8">

        {/* ===== MOBILE VIEW ===== */}
        <div className="flex items-center md:hidden w-full justify-between">
          
          {/* Círculo gris (como en tu imagen) */}
          <div className="w-10 h-10 bg-gray-500 rounded-full" />

          {/* Botón hamburguesa */}
          <button onClick={() => setOpen(!open)}>
            {open ? <X size={30} /> : <Menu size={30} />}
          </button>

        </div>

        {/* ===== DESKTOP VIEW ===== */}
        <div className="hidden md:flex w-full justify-between items-center">

          {/* Logo */}
          <NavLink to="/" className="text-2xl font-semibold">
            CraftYourStyle
          </NavLink>

          {/* Navegación */}
          <nav className="flex gap-10">
            <NavLink to="/personalizacion" className="hover:text-red-500 transition">
              Personalización
            </NavLink>
            <NavLink to="/catalogo" className="hover:text-red-500 transition">
              Catálogo
            </NavLink>
          </nav>

          {/* Iconos */}
          <div className="flex gap-4 items-center">
            
            <NavLink to="/carrito">
              <ShoppingCart size={26} />
            </NavLink>

            <button className ="cursor-pointer" onClick={() => setOpen(!open)}>
              {open ? <Sun size={26} color="yellow"/> : <Moon size={26} />}
            </button>
            <LogIn size={26} />
          </div>

        </div>
      </div>

      {/* ===== MENÚ MOBILE DESPLEGABLE ===== */}
      {open && (
        <div className="md:hidden bg-white shadow-md flex flex-col gap-6 px-6 py-6 text-lg">
          <NavLink to="/" onClick={() => setOpen(false)}>Inicio</NavLink>
          <NavLink to="/catalogo" onClick={() => setOpen(false)}>Catálogo</NavLink>
          <NavLink to="/personalizacion" onClick={() => setOpen(false)}>Personalización</NavLink>
        </div>
      )}

    </header>
  );
};