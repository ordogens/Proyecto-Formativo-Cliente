import { NavLink } from "react-router-dom";
import hombre from "../assets/photo.png";
import mujer from "../assets/mujer.jpg";
import gorros from "../assets/gorros.jpg";

export const Catalogo = () => {
  return (
    <section className="bg-[#f3f0eb] text-black py-4 h-full px-8 md:px-20">
      {/* Encabezado */}
      <div className="text-center mb-8">
        <p className="text-red-500 font-semibold tracking-widest uppercase text-sm">
          Nuestras colecciones
        </p>
        <h2 className="text-4xl font-serif md:text-5xl font-semibold mt-4">
          Catalogo
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
            <span className="text-red-400 mt-4 inline-block">
              <NavLink to="/ropa-hombre">
                <p>Explorar →</p>
              </NavLink>
            </span>
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
            <span className="text-red-400 mt-4 inline-block">
              <NavLink to="/ropa-mujer">Explorar →</NavLink>
            </span>
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
            <span className="text-red-400 mt-4 inline-block">
              <NavLink to="/gorros">Explorar →</NavLink>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
