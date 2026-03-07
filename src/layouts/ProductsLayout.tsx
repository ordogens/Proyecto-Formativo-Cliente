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
        min-h-screen
        bg-[#f3f0eb]
        dark:bg-gray-900
        text-black
        dark:text-gray-300
        transition-colors
        duration-300
        p-4
        flex
        flex-col
        gap-4
      "
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:px-16 shrink-0">
        <div>
          <p className="text-red-400 font-medium">{categoriaLabel}</p>
          <h1 className="text-3xl md:text-4xl font-serif font-semibold">
            {titulo}
          </h1>
          <p className="text-gray-500 dark:text-gray-300 text-sm mt-2">
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
                  border-gray-300
                  dark:border-gray-600
                  px-4
                  py-2
                  rounded-lg
                  text-sm
                  hover:bg-gray-200
                  dark:hover:bg-gray-700
                  transition
                  focus:bg-black
                  focus:text-[#f3f0eb]
                  dark:focus:bg-gray-100
                  dark:focus:text-gray-900
                "
              >
                {filtro}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="md:px-16 pb-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4">
          {children}
        </div>
      </div>
    </section>
  );
};
