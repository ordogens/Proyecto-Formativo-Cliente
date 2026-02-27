import hombre from "../../assets/photo.png";
import mujer from "../../assets/mujer.jpg";
import gorros from "../../assets/gorros.jpg";
import { useNavigate } from "react-router-dom";

export const HomeP2 = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-[#f3f0eb] dark:bg-gray-900 text-black dark:text-gray-100 transition-colors duration-300 py-24 px-8 md:px-20">
      {/* Encabezado */}
      <div className="text-center mb-16">
        <p className="text-red-500 font-bold tracking-widest uppercase text-sm">
          Nuestras colecciones
        </p>
        <h2 className="text-4xl font-serif md:text-5xl font-semibold mt-4 dark:text-gray-300">
          Explora por categorias
        </h2>
        <p className="text-md md:text-lg text-gray-600 dark:text-gray-300 mt-4">Explora nuestras categorias y encuentra tu prenda perfecta</p>
      </div>

      {/* Grid de cards */}
      <div className="grid md:grid-cols-3 gap-10">
        {/* Card 1 */}
        <div className="relative rounded-3xl overflow-hidden group cursor-pointer" onClick={() => navigate("/ropa-hombre")}>
          <img
            src={hombre}
            alt="Moda hombre"
            className="w-full h-[500px] object-cover transition duration-500 group-hover:scale-105"
          />

          {/* Overlay oscuro */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

          {/* Contenido */}
          <div className="absolute bottom-8 left-8 text-white">
            <h3 className="text-3xl font-semibold font-serif">Hombre</h3>
            <p className="text-gray-300 mt-2">Estilo masculino moderno</p>
            <p className="text-red-400 mt-4 inline-block">Explorar →</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="relative rounded-3xl overflow-hidden group cursor-pointer" onClick={() => navigate("/ropa-mujer")}>
          <img
            src={mujer}
            alt="Moda mujer"
            className="w-full h-[500px] object-cover transition duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

          <div className="absolute bottom-8 left-8 text-white">
            <h3 className="text-3xl font-semibold font-serif">Mujer</h3>
            <p className="text-gray-300 mt-2">Elegancia contemporánea</p>
            <p className="text-red-400 mt-4 inline-block">Explorar →</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="relative rounded-3xl overflow-hidden group cursor-pointer" onClick={() => navigate("/gorros")}>
          <img
            src={gorros}
            alt="Gorras"
            className="w-full h-[500px] object-cover transition duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

          <div className="absolute bottom-8 left-8 text-white">
            <h3 className="text-3xl font-semibold font-serif">Gorros</h3>
            <p className="text-gray-300 mt-2">Accesorios con actitud</p>
            <p className="text-red-400 mt-4 inline-block">Explorar →</p>
          </div>
        </div>
      </div>
    </section>
  );
};
