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
      className="bg-white dark:bg-gray-800 rounded-2xl flex flex-col gap-2 shadow-sm hover:shadow-md w-45 md:w-60 h-75 md:h-95 transition-colors duration-300 overflow-hidden cursor-pointer mt-3 md:mt-1"
    >
      {/* <p className="relative flex self-end pr-2 pt-1 text-[12px] text-red-500/60 font-bold md:text-transparent  rounded-4xl drop-shadow-xl">Click para ver detalles</p> */}
      <img
        src={producto.imagen}
        alt={producto.nombre}
        className="w-full h-50 md:h-70 "
      />

      <div className="px-2 flex flex-col gap-1">
        <h3 className="font-medium text-sm text-gray-800 dark:text-gray-300">{producto.nombre}</h3>
        <p className="font-bold text-sm text-gray-900 dark:text-gray-300">
          ${producto.precio.toLocaleString()}
        </p>

        <button
          onClick={handleClick}
          className="w-full border border-red-500 text-red-500 bg-red-100 rounded-lg p-1 text-sm hover:bg-red-500 hover:text-white transition cursor-pointer"
        >
          Ver detalles
        </button>
      </div>
    </div>
  );
};
