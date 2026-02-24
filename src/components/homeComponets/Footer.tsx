import { NavLink } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-[#130e0a] text-gray-400 px-8 md:px-20 py-16">
        {/* Contenido principal */}
        <div className="grid md:grid-cols-3 gap-10 mb-12 text-sm">
          {/* Columna 1 */}
          <div>
            <p className="leading-relaxed max-w-sm">
              Crea prendas únicas con diseños generados por inteligencia
              artificial. Tu imaginación es el límite.
            </p>
          </div>

          {/* Columna 2 */}
          <div>
            <ul className="space-y-2">
              <li className="hover:text-white transition cursor-pointer">
                <NavLink to="/catalogo">Catálogo</NavLink>
              </li>
              <li className="hover:text-white transition cursor-pointer">
                <NavLink to="/personalizacion">Personalización</NavLink>
              </li>
              <li className="hover:text-white transition cursor-pointer">
                Categoría
              </li>
            </ul>
          </div>

          {/* Columna 3 */}
          <div>
            <p>Av. Siempre viva Cl. 23 #45 local 23</p>
            <p className="mt-2">📞 300 222 11 33</p>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
          2026 CraftYourStyle
        </div>
      </footer>
  );
};


