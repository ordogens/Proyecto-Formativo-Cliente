import type { Producto } from "../../../data/Productos";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  producto: Producto;
}

export const ProductCard = ({ producto }: ProductCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => navigate(`/vista-dinamica/${producto.id}`);

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-2xl flex flex-col gap-2 shadow-sm hover:shadow-md w-45 md:w-60 h-75 md:h-95 transition overflow-hidden cursor-pointer mt-3 md:mt-1"
    >
      <img
        src={producto.imagen}
        alt={producto.nombre}
        className="w-full h-50 md:h-70"
      />

      <div className="px-2 flex flex-col gap-1">
        <h3 className="font-medium text-sm text-gray-800">{producto.nombre}</h3>
        <p className="font-bold text-sm text-gray-900">
          ${producto.precio.toLocaleString()}
        </p>

        <button
          onClick={handleClick}
          className="w-full border border-gray-300 rounded-lg p-1 text-sm hover:bg-gray-100 transition cursor-pointer"
        >
          Ver detalles
        </button>
      </div>
    </div>
  );
};
