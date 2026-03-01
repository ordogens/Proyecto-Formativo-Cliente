import { ChartColumnBig, Box, Truck } from "lucide-react"
import { ADMIN_VIEWS } from "../../data/adminViews"
import type { AdminViewType } from "../../data/adminViews"

interface Props {
  active: AdminViewType
  onChange: (view: AdminViewType) => void
}

export const AdminNavbar = ({ active, onChange }: Props) => {
  const itemClass = (view: AdminViewType) => {
    const isActive = active === view

    return `
      flex items-center gap-2
      px-4
      py-1
      rounded-lg
      cursor-pointer
      transition-all
      text-sm font-medium
      ${isActive
        ? "bg-red-100 text-red-600 dark:bg-red-100/40 dark:text-red-400"
        : "text-gray-700 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-gray-800"
      }
    `
  }

  return (
    <nav>
      <ul className="
        flex gap-2
        bg-[#efebe4] dark:bg-gray-900
        p-2
        rounded-xl
        w-fit
        mx-auto md:mx-0
      ">
        <li
          className={itemClass(ADMIN_VIEWS.RESUMEN)}
          onClick={() => onChange(ADMIN_VIEWS.RESUMEN)}
        >
          <ChartColumnBig size={18} />
          <span>Resumen</span>
        </li>

        <li
          className={itemClass(ADMIN_VIEWS.PRODUCTOS)}
          onClick={() => onChange(ADMIN_VIEWS.PRODUCTOS)}
        >
          <Box size={18} />
          <span>Productos</span>
        </li>

        <li
          className={itemClass(ADMIN_VIEWS.PEDIDOS)}
          onClick={() => onChange(ADMIN_VIEWS.PEDIDOS)}
        >
          <Truck size={18} />
          <span>Pedidos</span>
        </li>
      </ul>
    </nav>
  )
}