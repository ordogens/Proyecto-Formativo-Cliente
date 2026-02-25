import { productos } from "../../data/Productos";
import { ProductCard } from "../../components/cards/ProductCard";

export const RopaHombre = () => {
  const productosHombre = productos.filter((p) => p.categoria === "hombre");

  return (
    <section className="h-full bg-[#f3f0eb] py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:px-16">
        <div>
          <p className="text-red-400 font-medium">Categorías</p>
          <h1 className="text-3xl md:text-4xl font-serif font-semibold">
            Ropa de hombre
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            {productosHombre.length} productos disponibles
          </p>
        </div>

        <div className="flex gap-3 ">
          <button className="border px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition">
            Camisas
          </button>
          <button className="border px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition">
            Pantalones
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-5  w-screen md:px-10">
        {productosHombre.map((producto) => (
          <ProductCard key={producto.id} producto={producto} />
        ))}
      </div>
    </section>
  );
};
