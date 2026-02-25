import { NavLink } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-[#130e0a] text-gray-400 px-8 md:px-20 py-16 flex flex-col">
      {/* Contenido principal */}
      <div className="grid md:grid-cols-3 mb-12 text-sm lg:flex justify-between px-8">
        {/* Columna 1 */}
        <div className="flex flex-col gap-3 w-80">
          <h2 className="font-bold text-white ">ESTILO + IA</h2>
          <p className="leading-relaxed max-w-sm">
            Personaliza tu estilo con inteligencia artificial. Prendas únicas, hechas a tu medida.
          </p>
        </div>

        {/* Columna 2 */}
        <div className="flex flex-col gap-3 w-80">
          <h2 className="font-bold text-white">NAVEGACIÓN</h2>
          <ul className="">
            <li className="hover:text-red-400 transition cursor-pointer">
              <NavLink to="/catalogo">Catálogo</NavLink>
            </li>
            <li className="hover:text-red-400 transition cursor-pointer">
              <NavLink to="/personalizacion">Personalización</NavLink>
            </li>
            <li className="hover:text-red-400 transition cursor-pointer">
              Categoría
            </li>
          </ul>
        </div>

        {/* Columna 3 */}
        <div className="flex flex-col gap-3 w-80">
          <h2 className="font-bold text-white">NAVEGACIÓN</h2>
          <ul className="list-none">
            <li className="hover:text-red-400 transition cursor-pointer"><a href="#">📩 craftyourstyle@gmail.com</a></li>
            <li className="hover:text-red-400 transition cursor-pointer"><a href="#">📞 300 222 11 33</a></li>
            <li>📍 Armenia, Quindío, Colombia</li>
          </ul>
        </div>
      </div>

      {/* Línea divisoria */}
      <div className="border-t border-gray-800 pt-6 text-center">
        <p className="text-xs text-gray-500">2026 CraftYourStyle</p>
      </div>
    </footer>
  );
};


