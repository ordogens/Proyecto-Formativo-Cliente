import { NavLink } from "react-router-dom";
import modelo from "../../assets/Sleeveless shirt.png";

export const HomeP1 = () => {
  return (
   <section className="min-h-screen grid md:grid-cols-2 items-center px-8 md:px-20 py-20 ">
        {/* Columna izquierda */}
        <div className="space-y-6 max-w-xl">
          <p className="text-red-400 font-medium tracking-wide">
            Inteligencia artificial + moda
          </p>

          <h1 className="text-4xl md:text-6xl font-semibold font-serif leading-tight">
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
  )
}

