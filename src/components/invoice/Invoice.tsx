import { InvoiceFooterModal } from "./InvoiceFooterModal";
import { InvoiceMainModal } from "./InvoiceMainModal";
import type { Product } from "../../types/invoice";
import { formatDate, getInvoiceTotals } from "../../utils/invoice";
import type { ApiFactura } from "../../types/api.types";

interface Props {
  onClose: () => void;
  factura: ApiFactura;
}

export const Invoice = ({ onClose, factura }: Props) => {
  const products: Product[] = factura.productos.map((item, index) => ({
    id: index + 1,
    name: item.nombre_producto,
    price: item.subtotal,
  }));

  const issueDate = new Date(factura.fecha_emision);
  const dueDate = new Date(factura.fecha_vencimiento);

  const { totalProducts, totalValor } = getInvoiceTotals(products);

  return (
    <div id="invoice-pdf" className="py-2 px-2 bg-white text-black mr-2 rounded-lg w-full relative font-mono pdg-safe">

      <header className="flex flex-col gap-2">
        <h2 className="text-xl text-center">FACTURA DE COMPRA</h2>

        <p className="flex flex-col font-extralight text-[10px] border-b-1 border-black pb-2 mb-1">
          <span>Factura Nº: {factura.id}</span>
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
      <InvoiceFooterModal
        onClose={onClose}
        products={products}
        totalProducts={totalProducts}
        totalValor={totalValor}
        issueDate={issueDate}
        dueDate={dueDate}
        invoiceId={factura.id}
      />    </div>
  );
};
