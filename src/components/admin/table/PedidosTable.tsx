import { useState, useEffect } from "react"
import type { Order, OrderStatus } from "../../../types/invoice"
import { orderService } from "../../../services/order.service"
import { apiFacturaToOrder } from "../../../adapters/invoice.adapter"

/* =====================
   Estilos y labels de estado (alineados con backend)
   PENDIENTE → pendiente, PAGADA → confirmado, VENCIDA → vencida
===================== */
const statusStyles: Record<OrderStatus, string> = {
  confirmado: "bg-green-100 text-green-700 border-green-700",
  pendiente: "bg-yellow-100 text-yellow-700 border-yellow-700",
  vencida: "bg-red-100 text-red-700 border-red-700"
}

const statusLabels: Record<OrderStatus, string> = {
  confirmado: "Pagada",
  pendiente: "Pendiente",
  vencida: "Vencida"
}

const formatPrice = (price: number) =>
  price.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0
  })


export const PedidosTable = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const facturas = await orderService.getAllInvoices()
        setOrders(facturas.map(apiFacturaToOrder))
      } catch (err) {
        console.error("Error cargando pedidos:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const handleStatusChange = (id: string, newStatus: OrderStatus) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    )
  }

  if (loading) {
    return <p className="p-4 text-gray-500">Cargando pedidos...</p>
  }

  return (
    <table className="w-full block max-h-[65vh] overflow-x-auto overflow-y-auto max-w-[700px] md:max-w-full md:table md:max-h-none md:overflow-visible dark:text-gray-300 dark:bg-gray-900">
      <thead>
        <tr className="border-b">
          <th className="px-3 py-2 text-left text-sm font-medium">Pedido</th>
          <th className="px-3 py-2 text-left text-sm font-medium">Cliente</th>
          <th className="px-3 py-2 text-left text-sm font-medium">Fecha</th>
          <th className="px-3 py-2 text-left text-sm font-medium">Items</th>
          <th className="px-3 py-2 text-left text-sm font-medium">Total</th>
          <th className="px-3 py-2 text-left text-sm font-medium">Estado</th>
          <th className="px-3 py-2 text-left text-sm font-medium">Cambiar</th>
        </tr>
      </thead>

      <tbody>
        {orders.map(order => (
          <tr
            key={order.id}
            className="border-b last:border-b-0 hover:bg-[#ebe7e1] dark:hover:bg-gray-800"
          >
            <td className="px-3 py-2 font-light md:font-medium text-[10px] md:text-md">
              {order.id}
            </td>

            <td className="px-3 py-2">
              <div className="flex flex-col">
                <span className="font-normal text-sm md:text-md text-black dark:text-gray-300 md:font-medium ">{order.customerName}</span>
                <span className="text-xs text-gray-500">
                  {order.customerEmail}
                </span>
              </div>
            </td>

            <td className="px-3 py-2 text-sm md:text-md font-light md:font-medium">
              {order.date}
            </td>

            <td className="px-3 py-2 text-sm md:text-md font-light md:font-medium">
              {order.items}
            </td>

            <td className="px-3 py-2 text-sm md:text-md font-semibold md:font-medium">
              {formatPrice(order.total)}
            </td>

            <td className="px-3 py-2 text-sm md:text-md font-light md:font-medium">
              <span
                className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusStyles[order.status]} border-1`}
              >
                {statusLabels[order.status]}
              </span>
            </td>

            <td className="px-3 py-2">
              <select
                value={order.status}
                onChange={(e) =>
                  handleStatusChange(order.id, e.target.value as OrderStatus)
                }
                className="rounded-md border px-2 py-1 text-sm bg-background cursor-pointer dark:bg-gray-900 dark:text-gray-300"
              >
                <option value="confirmado">Pagada</option>
                <option value="pendiente">Pendiente</option>
                <option value="vencida">Vencida</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}