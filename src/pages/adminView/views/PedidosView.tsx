import { PedidosTable } from "../../../components/admin/table/PedidosTable"

const options = [
  "Todos",
  "Pedientes",
  "Confirmados",
  "Eviados"
]

export const PedidosView = () => {
  return (
    <div className="bg-[#f3f0eb] w-full h-full md:p-4 dark:bg-gray-900 dark:text-gray-300">
      <header className="mb-4 flex flex-col md:flex-row w-full items-start md:items-center justify-between">
        <h2 className="font-serif text-2xl md:text-xl">Pedidos</h2>
        <section className="flex gap-2">
          {options.map((op) => (
            <button className="border-1 border-gray-300 hover:bg-red-500 hover:text-white cursor-pointer px-2 rounded-md">
              {op}
            </button>))}
        </section>
      </header>

      <PedidosTable />
    </div>
  )
}
