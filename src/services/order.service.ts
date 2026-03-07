import { apiClient, ADMIN_API } from "../config/api";
import type {
  ApiCreateFacturaInput,
  ApiCreateFacturaResult,
  ApiFactura,
} from "../types/api.types";

interface ApiEnvelope<T> {
  message: string;
  data: T;
}

const ADMIN_FACTURAS_API = `${ADMIN_API}/facturas`;

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
    const { data } = await apiClient.get<ApiEnvelope<ApiFactura[]>>(
      ADMIN_FACTURAS_API
    );
    return data.data;
  },

  createInvoice: async (
    factura: ApiCreateFacturaInput
  ): Promise<ApiCreateFacturaResult> => {
    const { data } = await apiClient.post<ApiEnvelope<ApiCreateFacturaResult>>(
      `${ADMIN_FACTURAS_API}/crear`,
      factura
    );
    return data.data;
  },

  createInvoiceForCustomer: async (
    factura: Omit<ApiCreateFacturaInput, "id_usuario"> & { id_usuario?: string }
  ): Promise<ApiCreateFacturaResult> => {
    const { data } = await apiClient.post<ApiEnvelope<ApiCreateFacturaResult>>(
      `${ADMIN_FACTURAS_API}/crear-cliente`,
      factura
    );
    return data.data;
  },

  getInvoicesByUser: async (userId: string): Promise<ApiFactura[]> => {
    const { data } = await apiClient.get<ApiEnvelope<ApiFactura[]>>(
      `${ADMIN_FACTURAS_API}/usuario/${userId}`
    );
    return data.data;
  },

  getInvoiceById: async (id: string): Promise<ApiFactura> => {
    const { data } = await apiClient.get<ApiEnvelope<ApiFactura>>(
      `${ADMIN_FACTURAS_API}/${id}`
    );
    return data.data;
  },

  sendInvoiceEmail: async (id: string): Promise<void> => {
    await apiClient.post(`${ADMIN_FACTURAS_API}/${id}/enviar-correo`);
  },
};
