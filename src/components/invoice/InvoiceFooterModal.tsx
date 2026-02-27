import { CircleX, PrinterIcon } from "lucide-react"
import { PDFDownloadLink } from "@react-pdf/renderer";
import { InvoicePDF } from "../../pdf/InvoicePDF";
import type { Product } from "../../types/invoice";
import { formatDate } from "../../utils/invoice";

interface Props {
  onClose: () => void;
  products: Product[];
  totalProducts: number;
  totalValor: number;
  issueDate: Date;
  dueDate: Date;
}

export const InvoiceFooterModal = ({ onClose, products, totalProducts, totalValor, issueDate, dueDate }: Props) => {
  return (
    <footer className="mt-1">
      <p className="text-[10px] text-justify">Gracias por su compra. Para cualquier consulta relacionada con esta factura, comuníquese con nosotros dentro de los plazos establecidos.</p>
      <section className="flex flex-col text-[10px] mt-2">
        <p className="text-[10px] font-extrabold">Información adicional</p>
        <p>
          <span className="font-bold mr-1">
            Teléfono:
          </span>
          +57 323 525 1372
        </p>
        <p>
          <span className="font-bold mr-1">
            Correo electrónico:
          </span>
          soportecys@gmail.com
        </p>
        <p>
          <span className="font-bold mr-1">
            Dirección:
          </span>
          Cr.4 #453 - 72
        </p>
        <p>
          <span className="font-bold mr-1">
            Ciudad:
          </span>
          Armenia, Quindío, Colombia
        </p>
      </section>

      <section className="flex gap-2 border-t-1 pt-2 border-zinc-600">
        <PDFDownloadLink
          document={
            <InvoicePDF
              products={products}
              totalProducts={totalProducts}
              totalValor={totalValor}
              issueDate={formatDate(issueDate)}
              dueDate={formatDate(dueDate)}
            />
          }
          fileName="factura-compra.pdf"
          className="flex items-center justify-center gap-1 bg-gray-200 p-1 border-1 dark:bg-transparent dark:hover:bg-gray-950 border-zinc-500 group hover:bg-gray-800 transition duration-200 rounded-md cursor-pointer w-full"
        >
          {({ loading }) => (
            <>
              <PrinterIcon
                strokeWidth={1.5}
                size={20}
                className="text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-100 transition duration-200"
              />
              <p className="text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-100 transition duration-200">
                {loading ? "Generando..." : "Descargar"}
              </p>
            </>
          )}
        </PDFDownloadLink>
        <button
          className="flex items-center justify-center gap-1 bg-red-200 dark:bg-transparent dark:hover:bg-red-500 p-1 border-1 border-red-500 group transition duration-200 hover:bg-red-500 rounded-md cursor-pointer w-full"
          onClick={onClose}
        >
          <CircleX strokeWidth={1.5} size={20} className="text-red-500 rotate-180 group-hover:text-white transition duration-200" />
          <p className="text-red-500 group-hover:text-white transition duration-200 ">Volver</p>
        </button>
      </section>
    </footer>
  )
}
