import { apiClient, CATALOG_API, ADMIN_API } from "../config/api";
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
    getProducts: async () => {
        const { data } = await apiClient.get(`${CATALOG_API}/productos/obtenerProductos`);
        return data.data ?? [];
    },
    getProductById: async (id) => {
        const { data } = await apiClient.get(`${CATALOG_API}/productos/obtenerProducto/${id}`);
        return data.data;
    },
    getProductsByCategory: async (categoriaId) => {
        const { data } = await apiClient.get(`${CATALOG_API}/productos/obtenerProductosConDetalles/${categoriaId}`);
        return data.data ?? [];
    },
    createProduct: async (producto) => {
        const { data } = await apiClient.post(`${ADMIN_API}/crearProducto`, producto);
        return data;
    },
    updateProduct: async (id, producto) => {
        const { data } = await apiClient.patch(`${CATALOG_API}/productos/actualizarProducto/${id}`, producto);
        return data;
    },
    deleteProduct: async (id) => {
        await apiClient.delete(`${CATALOG_API}/productos/eliminarProducto/${id}`);
    },
    /* ================= Categorías ================= */
    getCategories: async () => {
        const { data } = await apiClient.get(`${CATALOG_API}/catalogo/obtenerCategorias`);
        return data.data ?? [];
    },
    getCategoryById: async (id) => {
        const { data } = await apiClient.get(`${CATALOG_API}/catalogo/obtenerCategoria/${id}`);
        return data.data;
    },
    createCategory: async (categoria) => {
        const { data } = await apiClient.post(`${ADMIN_API}/crearCategoria`, categoria);
        return data;
    },
};
