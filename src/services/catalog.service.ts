import { apiClient, CATALOG_API, ADMIN_API } from "../config/api";
import type { ApiProducto, ApiCategoria } from "../types/api.types";

/**
 * Servicio de catálogo — consume micro catálogo a través del gateway.
 *
 * Rutas gateway:
 *   /api/catalogo/productos/*   → micro catálogo /productos/*
 *   /api/catalogo/catalogo/*    → micro catálogo /catalogo/*
 *   /api/admin/crearProducto    → micro admin (requiere JWT admin)
 */
export const catalogService = {
  /* ================= Productos ================= */

  getProducts: async (): Promise<ApiProducto[]> => {
    const { data } = await apiClient.get<{ data: ApiProducto[] }>(
      `${CATALOG_API}/productos/obtenerProductos`
    );
    return data.data ?? [];
  },

  getProductById: async (id: number): Promise<ApiProducto> => {
    const { data } = await apiClient.get<{ data: ApiProducto }>(
      `${CATALOG_API}/productos/obtenerProducto/${id}`
    );
    return data.data;
  },

  getProductsByCategory: async (categoriaId: number): Promise<ApiProducto[]> => {
    const { data } = await apiClient.get<{ data: ApiProducto[] }>(
      `${CATALOG_API}/productos/obtenerProductosConDetalles/${categoriaId}`
    );
    return data.data ?? [];
  },

  createProduct: async (producto: Omit<ApiProducto, "id">): Promise<ApiProducto> => {
    const { data } = await apiClient.post<ApiProducto>(
      `${ADMIN_API}/crearProducto`,
      producto
    );
    return data;
  },

  updateProduct: async (
    id: number,
    producto: Partial<ApiProducto>
  ): Promise<ApiProducto> => {
    const { data } = await apiClient.patch<ApiProducto>(
      `${CATALOG_API}/productos/actualizarProducto/${id}`,
      producto
    );
    return data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await apiClient.delete(`${CATALOG_API}/productos/eliminarProducto/${id}`);
  },

  /* ================= Categorías ================= */

  getCategories: async (): Promise<ApiCategoria[]> => {
    const { data } = await apiClient.get<{ data: ApiCategoria[] }>(
      `${CATALOG_API}/catalogo/obtenerCategorias`
    );
    return data.data ?? [];
  },

  getCategoryById: async (id: number): Promise<ApiCategoria> => {
    const { data } = await apiClient.get<{ data: ApiCategoria }>(
      `${CATALOG_API}/catalogo/obtenerCategoria/${id}`
    );
    return data.data;
  },

  createCategory: async (categoria: Omit<ApiCategoria, "id">): Promise<ApiCategoria> => {
    const { data } = await apiClient.post<ApiCategoria>(
      `${ADMIN_API}/crearCategoria`,
      categoria
    );
    return data;
  },
};
