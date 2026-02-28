import { useNavigate } from "react-router-dom";
import { categorias } from "../../data/categorias";

export const HomeP2 = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-[#f3f0eb] dark:bg-gray-900 text-black dark:text-gray-300 transition-colors duration-300 py-4 px-8 md:px-20 flex flex-col gap-12">
      
      <div className="text-center mb-8">
        <p className="text-red-500 font-semibold tracking-widest uppercase text-sm">
          Nuestras colecciones
        </p>
        <h2 className="text-4xl font-serif md:text-5xl font-semibold mt-4">
          Catalogo
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        {categorias.map((categoria) => (
          <div
            key={categoria.title}
            className="relative rounded-3xl overflow-hidden group cursor-pointer"
            onClick={() => navigate(categoria.path)}
          >
            <img
              src={categoria.image}
              alt={categoria.title}
              className="w-full h-[500px] object-cover transition duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-3xl font-semibold">{categoria.title}</h3>
              <p className="text-gray-300 mt-2">
                {categoria.description}
              </p>
              <span className="text-red-400 mt-4 inline-block">
                Explorar →
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
