import { ChartColumnBig, Box, Truck, Palette, UserCheck } from "lucide-react"
import { ADMIN_VIEWS } from "../../data/adminViews"
import type { AdminViewType } from "../../data/adminViews"

interface Props {
  active: AdminViewType
  onChange: (view: AdminViewType) => void
}

export const AdminNavbar = ({ active, onChange }: Props) => {
  const itemClass = (view: AdminViewType) =>
    `flex gap-2 items-center rounded-md w-fit px-3 py-1 cursor-pointer border dark:hover:bg-gary-700 dark:text-gray-500 border-gray-300 dark:hover:text-gray-200 dark:border-gray-500
     ${active === view ? "bg-red-100 dark:bg-red-100/50 dark:hover:bg-black text-red-500 dark:text-white border-red-500 dark:border-red-500" : "bg-[#f3f0eb] dark:bg-gray-900 text-gray-800 "}
     hover:border-red-500 hover:bg-red-50 w-full md:w-fit justify-center dark:hover:bg-gray-700`

  return (
    <nav>
      <ul className="flex gap-2 justify-center md:justify-start overflow-y-auto md:overflow-y-hidden">
        <li className={itemClass(ADMIN_VIEWS.RESUMEN)} onClick={() => onChange(ADMIN_VIEWS.RESUMEN)}>
          <ChartColumnBig size={20} />
          <p className="hidden md:block">Resumen</p>
        </li>

        <li className={itemClass(ADMIN_VIEWS.PRODUCTOS)} onClick={() => onChange(ADMIN_VIEWS.PRODUCTOS)}>
          <Box size={20} />
          <p className="hidden md:block">Productos</p>
        </li>

        <li className={itemClass(ADMIN_VIEWS.PEDIDOS)} onClick={() => onChange(ADMIN_VIEWS.PEDIDOS)}>
          <Truck size={20} />
          <p className="hidden md:block">Pedidos</p>
        </li>

        <li className={itemClass(ADMIN_VIEWS.IA)} onClick={() => onChange(ADMIN_VIEWS.IA)}>
          <Palette size={20} />
          <p className="hidden md:block">IA</p>
        </li>

        <li className={itemClass(ADMIN_VIEWS.CLIENTES)} onClick={() => onChange(ADMIN_VIEWS.CLIENTES)}>
          <UserCheck size={20} />
          <p className="hidden md:block">Clientes</p>
        </li>
      </ul>
    </nav>
  )
}
