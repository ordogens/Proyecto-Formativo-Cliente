import { Moon, Sun, LogIn, X, ShoppingBag } from "lucide-react";
import { useNavigate, NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { DropMenu } from "./DropMenu";
import { ShopContext } from "../../context/shopContext";
import { AuthModal } from "../auth/AuthModal";

export const Header = () => {
  const [menuMobileOpen, setMenuMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const navigate = useNavigate();
  const shop = useContext(ShopContext);

  if (!shop) {
    throw new Error("ShopContext must be used inside ShopProvider");
  }

  const { totalItems: cartCount } = shop;

  return (
    <header className="w-full border-b border-gray-200">
      <div className="w-full bg-gray-200 md:bg-white h-16 flex justify-between items-center px-4 md:px-8">
        {/* ===== MOBILE VIEW ===== */}
        <div className="flex items-center md:hidden w-full justify-between">
          <img
            src="/logo-cys-pos.png"
            alt="logo"
            className="size-12"
            onClick={() => navigate("/")}
          />

          <div className="flex items-center gap-4">
            <div className="relative">
              <ShoppingBag size={26} onClick={() => navigate("/carrito")} />

              {cartCount > 0 && (
                <span
                  className="
                  absolute -top-1 -right-1
                  bg-red-500 text-white
                  text-[10px] font-bold
                  rounded-full
                  min-w-[16px] h-[16px]
                  flex items-center justify-center
                  px-1
                "
                >
                  {cartCount}
                </span>
              )}
            </div>
            <DropMenu onLoginClick={() => setIsLoginOpen(true)} />

            <button onClick={() => setMenuMobileOpen(!menuMobileOpen)}>
              {menuMobileOpen ? <X size={30} /> : null}
            </button>
          </div>
        </div>

        {/* ===== DESKTOP VIEW ===== */}
        <div className="hidden md:flex w-full justify-between items-center">
          <NavLink to="/" className="text-2xl font-semibold">
            CraftYourStyle
          </NavLink>

          <nav className="flex gap-10">
            <NavLink to="/catalogo" className="hover:text-red-500">
              Catálogo
            </NavLink>
            <NavLink to="/personalizacion" className="hover:text-red-500">
              Personalización
            </NavLink>
          </nav>

          <div className="flex gap-4 items-center">
            <div className="relative">
              <ShoppingBag
                className="cursor-pointer"
                size={26}
                onClick={() => navigate("/carrito")}
              />

              {cartCount > 0 && (
                <span
                  className="
                  absolute -top-1 -right-1
                  bg-red-500 text-white
                  text-[10px] font-bold
                  rounded-full
                  min-w-[16px] h-[16px]
                  flex items-center justify-center
                  px-1
                "
                >
                  {cartCount}
                </span>
              )}
            </div>

            <button
              className="cursor-pointer"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun size={26} color="yellow" /> : <Moon size={26} />}
            </button>

            <button
              type="button"
              className="cursor-pointer"
              onClick={() => setIsLoginOpen(true)}
              aria-label="Abrir login"
            >
              <LogIn size={26} />
            </button>
          </div>
        </div>
      </div>

      {isLoginOpen && (
        <AuthModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      )}
    </header>
  );
};
