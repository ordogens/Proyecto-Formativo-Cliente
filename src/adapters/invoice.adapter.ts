import type { ApiFactura, EstadoFactura } from "../types/api.types";
import type { Order, OrderStatus } from "../types/invoice";

/* =============================================
   Mapeo de estados: Backend → UI
   PENDIENTE → pendiente
   PAGADA   → confirmado
   VENCIDA  → vencida
============================================= */
const estadoToStatus: Record<EstadoFactura, OrderStatus> = {
  PENDIENTE: "pendiente",
  PAGADA: "confirmado",
  VENCIDA: "vencida",
};

const statusToEstado: Record<OrderStatus, EstadoFactura> = {
  pendiente: "PENDIENTE",
  confirmado: "PAGADA",
  vencida: "VENCIDA",
};

/* =============================================
   Factura API → Order UI
============================================= */
export const apiFacturaToOrder = (api: ApiFactura): Order => ({
  id: api.id,
  customerName: api.nombre_usuario,
  customerEmail: api.correo_usuario,
  date: api.fecha_emision,
  items: api.total_productos,
  total: api.valor_total,
  status: estadoToStatus[api.estado] ?? "pendiente",
});

/* =============================================
   Order UI status → Estado backend
============================================= */
export const orderStatusToEstado = (status: OrderStatus): EstadoFactura =>
  statusToEstado[status] ?? "PENDIENTE";
