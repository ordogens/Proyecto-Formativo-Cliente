import type { Product } from "../../types/invoice";

interface Props {
  products: Product[];
  totalProducts: number;
  totalValor: number;
}

export const InvoiceMainModal = ({
  products,
  totalProducts,
  totalValor,
}: Props) => {
  return (
    <main className="flex flex-col gap-2">
      <p className="w-full flex justify-between font-bold">
        <span className="flex gap-2">
          <span>ID</span>
          <span className="ml-10">Nombre</span>
        </span>
        <span className="mr-8">Precio</span>
      </p>

      <ul className="">
        {products.map(({ id, name, price }) => (
          <li
            key={id}
            className="w-full flex justify-between h-[20px] bg-red-200:"
          >
            <span className="flex gap-4">
              <span className="w-12">{id}</span>
              <span className="w-20 text-left">{name}</span>
            </span>
            <span className="w-20 text-left">${price}</span>
          </li>
        ))}
      </ul>

      <hr />

      <p className="flex justify-between w-full font-bold">
        <span>Total productos: {totalProducts}</span>
        <span>Valor: ${totalValor}</span>
      </p>
    </main>
  );
};