import { CircleX, PrinterIcon } from "lucide-react"

interface Props {
  onClose: () => void;
}

export const InvoiceFooterModal = ({ onClose }: Props) => {
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
        <button
          className="flex items-center justify-center gap-1 bg-gray-200 p-1 border-1 border-zinc-500 group hover:bg-gray-800 transition duration-200 rounded-md cursor-pointer w-full"
          onClick={() => { }}
        >
          <PrinterIcon strokeWidth={1.5} size={20} className="text-zinc-700 group-hover:text-zinc-100 transition duration-200" />
          <p className="text-zinc-700 group-hover:text-zinc-100 transition duration-200">Descargar</p>
        </button>
        <button
          className="flex items-center justify-center gap-1 bg-red-200 p-1 border-1 border-red-500 group transition duration-200 hover:bg-red-500 rounded-md cursor-pointer w-full"
          onClick={onClose}
        >
          <CircleX strokeWidth={1.5} size={20} className="text-red-500 rotate-180 group-hover:text-white transition duration-200" />
          <p className="text-red-500 group-hover:text-white transition duration-200">Volver</p>
        </button>
      </section>
    </footer>
  )
}
