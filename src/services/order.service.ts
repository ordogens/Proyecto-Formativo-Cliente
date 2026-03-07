import { apiClient, ADMIN_API } from "../config/api";
import type { ApiFactura } from "../types/api.types";

/**
 * Servicio de pedidos/facturas — consume micro admin a través del gateway.
 *
 * Rutas gateway:
 *   /api/admin/facturas/crear                  → POST crear factura
 *   /api/admin/facturas/usuario/:id_usuario    → GET facturas por usuario
 *   /api/admin/facturas/:id                    → GET factura por id
 *   /api/admin/facturas/:id/enviar-correo      → POST enviar por email
 */
export const orderService = {
  getAllInvoices: async (): Promise<ApiFactura[]> => {
    const { data } = await apiClient.get<{ data: ApiFactura[] }>(
      `${ADMIN_API}/facturas`
    );
    return data.data;
  },

  createInvoice: async (
    factura: Omit<ApiFactura, "id">
  ): Promise<ApiFactura> => {
    const { data } = await apiClient.post<ApiFactura>(
      `${ADMIN_API}/facturas/crear`,
      factura
    );
    return data;
  },

  getInvoicesByUser: async (userId: string): Promise<ApiFactura[]> => {
    const { data } = await apiClient.get<ApiFactura[]>(
      `${ADMIN_API}/facturas/usuario/${userId}`
    );
    return data;
  },

  getInvoiceById: async (id: string): Promise<ApiFactura> => {
    const { data } = await apiClient.get<ApiFactura>(
      `${ADMIN_API}/facturas/${id}`
    );
    return data;
  },

  sendInvoiceEmail: async (id: string): Promise<void> => {
    await apiClient.post(`${ADMIN_API}/facturas/${id}/enviar-correo`);
  },
};
