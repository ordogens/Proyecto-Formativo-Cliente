import { NavLink } from "react-router-dom";
import modelo from "../../assets/Sleeveless shirt.png";

export const HomeP1 = () => {
  return (
    <section className="min-h-screen bg-[#0f0a08] text-white flex flex-col md:grid md:grid-cols-2 items-center px-6 md:px-20 py-16 md:py-20">
      
      {/* Imagen (arriba en móvil, derecha en desktop) */}
      <div className="order-1 md:order-2 w-full flex justify-center">
        <img
          src={modelo}
          alt="Modelo con camiseta personalizada"
          className="w-full max-w-sm md:max-w rounded-3xl object-cover shadow-2xl"
        />
      </div>

      {/* Texto */}
      <div className="order-2 md:order-1 text-center md:text-left mt-10 md:mt-0 max-w-xl space-y-6">
        
        <p className="text-red-400 font-medium tracking-wide">
          Inteligencia artificial + moda
        </p>

        <h1 className="text-3xl md:text-6xl font-semibold font-serif leading-tight">
          Personaliza tu estilo con IA
        </h1>

        <p className="text-gray-400 text-base md:text-lg">
          Crea prendas únicas con diseños generados por inteligencia
          artificial. Tu imaginación es el límite.
        </p>

        <div className="flex justify-center md:justify-start gap-4 pt-4">
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
    </section>
  );
};