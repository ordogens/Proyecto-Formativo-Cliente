import { InvoiceFooterModal } from "./InvoiceFooterModal";
import { InvoiceMainModal } from "./InvoiceMainModal";
import type { Product } from "../../types/invoice";
import { formatDate, getInvoiceTotals } from "../../utils/invoice";

const products: Product[] = [
  { id: 1423, name: "Camisa1", price: 10000 },
  { id: 213424, name: "Camisa2", price: 50000 },
  { id: 143123, name: "Camisa3", price: 60000 },
  { id: 443, name: "Camisa4", price: 1000 },
  { id: 5432, name: "Camisa5", price: 15000 },
  { id: 656623, name: "Camisa6", price: 150000 },
  { id: 723, name: "Camisa7", price: 2000 },
  { id: 842342, name: "Camisa8", price: 20000 },
];

interface Props {
    onClose: () => void;
}

export const Invoice = ({ onClose }: Props) => {
  const issueDate = new Date();
  const dueDate = new Date(issueDate);
  dueDate.setDate(dueDate.getDate() + 30);

  const { totalProducts, totalValor } = getInvoiceTotals(products);

  return (
    <div className="py-2 px-2 mr-2 rounded-lg w-full relative font-mono">

      <header className="flex flex-col gap-2">
        <h2 className="text-xl text-center">FACTURA DE COMPRA</h2>

        <p className="flex flex-col font-extralight text-[10px] border-b-1 border-black pb-2 mb-1">
          <span>Factura Nº: 000123</span>
          <span>Fecha de emisión: {formatDate(issueDate)}</span>
          <span>Fecha de vencimiento: {formatDate(dueDate)}</span>
          <span className="text-justify mt-2">
            Por medio de la presente se detallan los productos adquiridos conforme
            a las condiciones acordadas entre las partes.
          </span>
        </p>
      </header>

      <InvoiceMainModal
        products={products}
        totalProducts={totalProducts}
        totalValor={totalValor}
      />
      <InvoiceFooterModal onClose={onClose} />
    </div>
  );
};