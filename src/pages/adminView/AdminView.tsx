import { useState } from "react"
import { AdminNavbar } from "../../components/admin/AdminNavbar"
import { AdminContent } from "../../components/admin/AdminContent"
import { ADMIN_VIEWS, } from "../../data/adminViews"
import type { AdminViewType } from "../../data/adminViews"

export const AdminView = () => {
  const [activeView, setActiveView] = useState<AdminViewType>(ADMIN_VIEWS.RESUMEN)

  return (
    <div className="px-4 md:px-8 flex flex-col gap-4">
      <section>
        <h1 className="font-bold font-serif text-xl md:text-3xl flex justify-between items-center gap-2 dark:text-gray-300">
          Panel de Administración
          <span className="bg-white text-xs w-fit font-medium p-1 rounded-sm dark:bg-gray-700 px-2">admin@admin.com</span>
        </h1>
        <p className="text-sm font-extralight md:font-normal text-gray-500">
          Gestiona productos, pedidos y personalizaciones IA.
        </p>
      </section>
      <AdminNavbar active={activeView} onChange={setActiveView} />
      <section className="mt-2 h-200 bg-red-400">
        <AdminContent view={activeView} />
      </section>
    </div>
  )
}