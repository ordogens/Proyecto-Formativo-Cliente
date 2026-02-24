import { Producto } from "../../data/Productos";

interface ProductCardProps {
  producto: Producto;
}

export const ProductCard = ({ producto }: ProductCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden  ">
      
      <img
        src={producto.imagen}
        alt={producto.nombre}
        className="w-full h-72 object-cover"
      />

      <div className="p-4 space-y-2">
        <h3 className="font-medium text-gray-800">
          {producto.nombre}
        </h3>

        <p className="font-semibold text-gray-900">
          ${producto.precio.toLocaleString()}
        </p>

        <button className="w-full border border-gray-300 rounded-lg py-2 text-sm hover:bg-gray-100 transition">
          Ver detalles
        </button>
      </div>
    </div>
  );
};