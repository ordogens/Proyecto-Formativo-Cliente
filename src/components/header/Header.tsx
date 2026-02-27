import { Moon, Sun, LogIn, X, ShoppingBag } from "lucide-react";
import { useNavigate, NavLink } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { DropMenu } from "./DropMenu";
import { ShopContext } from "../../context/shopContext";
import { AuthModal } from "../auth/AuthModal";
import { useThemeContext } from "../../context/ThemeContext";

export const Header = () => {
  const [menuMobileOpen, setMenuMobileOpen] = useState(false);
  const penRef = useRef<HTMLImageElement | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const navigate = useNavigate();
  const shop = useContext(ShopContext);
  const { theme, toggleTheme } = useThemeContext();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!penRef.current) return;

      const rect = penRef.current.getBoundingClientRect();

      const penX = rect.left + rect.width / 2;
      const penY = rect.top + rect.height / 2;

      const deltaX = e.clientX - penX;
      const deltaY = e.clientY - penY;

      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

      penRef.current.style.transform = `rotate(${angle + 90}deg)`;
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  if (!shop) {
    throw new Error("ShopContext must be used inside ShopProvider");
  }

  const { totalItems: cartCount } = shop;

  return (
    <header
      className="
        sticky
        top-0
        z-50
        w-full
        border-b
        border-gray-200 dark:border-gray-700
        bg-[#f3f0eb]/40 dark:bg-gray-900/40
        text-gray-900 dark:text-gray-100
        backdrop-blur-md
      "
    >
      <div className="h-16 flex justify-between items-center px-4 md:px-8">
        {/* ===== MOBILE VIEW ===== */}
        <div className="flex items-center md:hidden w-full justify-between">
          <img
            src="/logo-cys-pos.png"
            alt="logo"
            className="size-12 cursor-pointer"
            onClick={() => navigate("/")}
          />

          <div className="flex items-center gap-4">
            <div className="relative">
              <ShoppingBag
                size={26}
                className="cursor-pointer"
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

            <DropMenu onLoginClick={() => setIsLoginOpen(true)} />

            <button onClick={() => setMenuMobileOpen(!menuMobileOpen)}>
              {menuMobileOpen ? <X size={30} /> : null}
            </button>
          </div>
        </div>

        {/* ===== DESKTOP VIEW ===== */}
        <div className="hidden md:flex w-full justify-between items-center">
          <NavLink
            to="/"
            className="text-xl font-serif font-semibold dark:text-gray-300 flex gap-2 items-center"
          >
            <span className="w-11 hover:text-red-500 hover:scale-110 transition duration-200">Craft</span>
            <span className="w-11 hover:text-red-500 hover:scale-110 transition duration-200">Your</span>
            <span className="w-11 hover:text-red-500 hover:scale-110 transition duration-200">Style</span>

            {/* <span className="w-1 hover:text-red-500 hover:scale-110 ">C</span>
            <span className="w-1 hover:text-red-500 hover:scale-110 ">r</span>
            <span className="w-1 hover:text-red-500 hover:scale-110 ">a</span>
            <span className="w-1 hover:text-red-500 hover:scale-110 ">f</span>
            <span className="w-1 hover:text-red-500 hover:scale-110 ">t</span>

            <span className="w-1 hover:text-red-500 hover:scale-110 ">Y</span>
            <span className="w-1 hover:text-red-500 hover:scale-110 ">o</span>
            <span className="w-1 hover:text-red-500 hover:scale-110 ">u</span>
            <span className="w-1 hover:text-red-500 hover:scale-110 ">r</span>

            <span className="w-1 hover:text-red-500 hover:scale-110 ">S</span>
            <span className="w-1 hover:text-red-500 hover:scale-110 ">t</span>
            <span className="w-1 hover:text-red-500 hover:scale-110 ">y</span>
            <span className="w-1 hover:text-red-500 hover:scale-110 ">l</span>
            <span className="w-1 hover:text-red-500 hover:scale-110 ">e</span> */}
            <img ref={penRef} src="/pluma-de-tinta.png" alt="pluma" className="size-7 ml-2 transition-transform duration-75 origin-center pointer-events-none" />

          </NavLink>

          <nav className="flex gap-10">
            <NavLink to="/catalogo" className="hover:text-red-500 dark:text-gray-300">
              Catálogo
            </NavLink>
            <NavLink to="/personalizacion" className="hover:text-red-500 dark:text-gray-300">
              Personalización
            </NavLink>
          </nav>

          <div className="flex gap-4 items-center">
            <div className="relative">
              <ShoppingBag
                className="cursor-pointer hover:text-red-500 dark:text-gray-300"
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
              type="button"
              className="cursor-pointer transition-none"
              onClick={toggleTheme}
              aria-label="Cambiar tema"
            >
              {theme === "dark" ? (
                <Sun size={26} className="text-yellow-400" />
              ) : (
                <Moon size={26} className="text-gray-700" />
              )}
            </button>

            <button
              type="button"
              className="border border-zinc-200 dark:border-gray-600 group hover:bg-red-500 py-1 px-2 rounded-md flex items-center gap-1 cursor-pointer transition-colors duration-200"
              onClick={() => setIsLoginOpen(true)}
              aria-label="Abrir login"
            >
              <p className="text-lg text-red-500 dark:text-red-500 group-hover:text-[#f3f0eb] transition duration-200">
                Login
              </p>
              <LogIn
                size={20}
                className="text-red-500 dark:text-red-500 group-hover:text-[#f3f0eb] transition duration-200"
              />
            </button>
          </div>
        </div>
      </div>

      {isLoginOpen && (
        <AuthModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
        />
      )}
    </header>
  );
};
