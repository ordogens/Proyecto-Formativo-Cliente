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
    <section className="h-full bg-[#f3f0eb] p-4 flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:px-16">
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
          <div className="flex gap-3">
            {filtros.map((filtro) => (
              <button
                key={filtro}
                className="border px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition"
              >
                {filtro}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 w-screen pl-3 md:pl-15">
        {children}
      </div>
    </section>
  );
};
