import type { ReactNode } from "react";

interface Props {
  categoriaLabel: string;
  titulo: string;
  totalProductos: number;
  filtros?: readonly string[];
  children: ReactNode;
}

export const ProductsLayout = ({
  categoriaLabel,
  titulo,
  totalProductos,
  filtros = [],
  children,
}: Props) => {
  return (
    <section
      className="
        h-220
        md:h-240
        bg-[#f3f0eb]
        p-4
        flex
        flex-col
        gap-4
        overflow-hidden
      "
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:px-16 shrink-0">
        <div>
          <p className="text-red-400 font-medium">{categoriaLabel}</p>
          <h1 className="text-3xl md:text-4xl font-serif font-semibold">
            {titulo}
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            {totalProductos} productos disponibles
          </p>
        </div>

        {filtros.length > 0 && (
          <div className="flex gap-3 flex-wrap">
            {filtros.map((filtro) => (
              <button
                key={filtro}
                className="
                  border
                  px-4
                  py-2
                  rounded-lg
                  text-sm
                  hover:bg-gray-200
                  transition
                  focus:bg-black
                  focus:text-[#f3f0eb]
                "
              >
                {filtro}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto md:px-16 ">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-14">
          {children}
        </div>
      </div>
    </section>
  );
};