import { NavLink } from "react-router-dom";
import modelo from "../assets/Sleeveless shirt.png";
import hombre from "../assets/photo.png";
import mujer from "../assets/mujer.jpg";
import gorros from "../assets/gorros.jpg";

export const Home = () => {
  return (
    <div className="bg-[#0f0a07] text-white overflow-x-hidden min-h-screen">
      {/* HERO */}
      <section className="min-h-screen grid md:grid-cols-2 items-center px-8 md:px-20 py-20 ">
        {/* Columna izquierda */}
        <div className="space-y-6 max-w-xl">
          <p className="text-red-400 font-medium tracking-wide">
            Inteligencia artificial + moda
          </p>

          <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
            Personaliza tu estilo con IA
          </h1>

          <p className="text-gray-400 text-lg">
            Crea prendas únicas con diseños generados por inteligencia
            artificial. Tu imaginación es el límite.
          </p>

          <div className="flex gap-4 pt-4">
            <NavLink
              to="/catalogo"
              className="bg-red-500 hover:bg-red-600 transition px-6 py-3 rounded-lg font-medium"
            >
              Ver catálogo →
            </NavLink>

            <NavLink
              to="/personalizacion"
              className="border border-gray-600 hover:border-white transition px-6 py-3 rounded-lg"
            >
              Personalizar
            </NavLink>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="flex justify-center mt-12 md:mt-0">
          <img
            src={modelo}
            alt="Modelo con camiseta personalizada"
            className="rounded-3xl w-88  object-cover shadow-2xl"
          />
        </div>
      </section>

      {/* SECCIÓN EXTRA PARA SCROLL */}
      {/* CATEGORÍAS */}
      <section className="bg-[#f3f0eb] text-black py-24 px-8 md:px-20">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <p className="text-red-500 font-semibold tracking-widest uppercase text-sm">
            Nuestras colecciones
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold mt-4">
            Explora por categorías
          </h2>
        </div>

        {/* Grid de cards */}
        <div className="grid md:grid-cols-3 gap-10">
          {/* Card 1 */}
          <div className="relative rounded-3xl overflow-hidden group cursor-pointer">
            <img
              src={hombre}
              alt="Moda hombre"
              className="w-full h-[500px] object-cover transition duration-500 group-hover:scale-105"
            />

            {/* Overlay oscuro */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

            {/* Contenido */}
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-3xl font-semibold">Hombre</h3>
              <p className="text-gray-300 mt-2">Estilo masculino moderno</p>
              <span className="text-red-400 mt-4 inline-block"><NavLink to="/ropa-hombre">Explorar →</NavLink></span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative rounded-3xl overflow-hidden group cursor-pointer">
            <img
              src={mujer}
              alt="Moda mujer"
              className="w-full h-[500px] object-cover transition duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-3xl font-semibold">Mujer</h3>
              <p className="text-gray-300 mt-2">Elegancia contemporánea</p>
              <span className="text-red-400 mt-4 inline-block"><NavLink to="/ropa-mujer">Explorar →</NavLink></span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="relative rounded-3xl overflow-hidden group cursor-pointer">
            <img
              src={gorros}
              alt="Gorras"
              className="w-full h-[500px] object-cover transition duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-3xl font-semibold">Gorros</h3>
              <p className="text-gray-300 mt-2">Accesorios con actitud</p>
              <span className="text-red-400 mt-4 inline-block"><NavLink to="/gorros">Explorar →</NavLink></span>
            </div>
          </div>
        </div>
      </section>

      {/* POR QUÉ ELEGIRNOS */}
      <section className="bg-[#f1ece4] py-24 px-8 md:px-20">
        {/* Encabezado */}
        <div className="text-center mb-20">
          <p className="text-red-500 font-semibold tracking-widest uppercase text-sm">
            Por qué elegirnos
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold mt-4">
            Moda inteligente, hecha para ti
          </h2>
        </div>

        {/* Grid de beneficios */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Card 1 */}
          <div className="bg-white rounded-3xl p-10 text-center shadow-sm hover:shadow-lg transition">
            <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-gray-200 flex items-center justify-center text-xl">
              ✨
            </div>
            <h3 className="text-red-500 font-semibold mb-4">Diseño con IA</h3>
            <p className="text-gray-500">
              Genera diseños únicos usando inteligencia artificial avanzada para
              cada prenda.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl p-10 text-center shadow-sm hover:shadow-lg transition">
            <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-gray-200 flex items-center justify-center text-xl">
              🎨
            </div>
            <h3 className="text-red-500 font-semibold mb-4">
              Personalización Total
            </h3>
            <p className="text-gray-500">
              Controla cada detalle de tu prenda: colores, patrones y estilos a
              tu gusto.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl p-10 text-center shadow-sm hover:shadow-lg transition">
            <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-gray-200 flex items-center justify-center text-xl">
              🧵
            </div>
            <h3 className="text-red-500 font-semibold mb-4">Calidad Premium</h3>
            <p className="text-gray-500">
              Materiales de primera calidad con procesos de producción
              sostenibles.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-3xl p-10 text-center shadow-sm hover:shadow-lg transition">
            <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-gray-200 flex items-center justify-center text-xl">
              🚚
            </div>
            <h3 className="text-red-500 font-semibold mb-4">Envío Rápido</h3>
            <p className="text-gray-500">
              Recibe tus prendas personalizadas en la puerta de tu casa en días.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0f0a07] text-gray-400 px-8 md:px-20 py-16">
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
    </div>
  );
};
