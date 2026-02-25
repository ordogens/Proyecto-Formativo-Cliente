import type { Producto } from "../../data/Productos";
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
      className="bg-white rounded-2xl flex flex-col gap-1 shadow-sm hover:shadow-md w-40 md:w-60 h-82 md:h-120 transition overflow-hidden cursor-pointer"
    >
      <img
        src={producto.imagen}
        alt={producto.nombre}
        className="w-full h-fit"
      />

      <div className="px-2 flex flex-col gap-1">
        <h3 className="font-medium text-sm text-gray-800">{producto.nombre}</h3>
        <p className="font-bold text-sm text-gray-900">${producto.precio.toLocaleString()}</p>

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
