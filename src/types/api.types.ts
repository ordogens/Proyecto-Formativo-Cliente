/* ========================================================
   Tipos que representan exactamente los contratos del backend.
   NO mezclar con tipos de UI — usar adapters para transformar.
======================================================== */

/** Coincide con CategoriaDto del micro catálogo */
export interface ApiCategoria {
  id?: number;
  nombre: string;
}

/** Coincide con ProductosDto del micro catálogo */
export interface ApiProducto {
  id?: number;
  nombre: string;
  /** BD usa image_url, DTO usa imagen_url */
  imagen_url?: string;
  image_url?: string;
  descripcion?: string;
  /** BD usa category_id, DTO usa categoria_id */
  categoria_id?: number;
  category_id?: number;
  price: number;
  talla: string;
  genero?: string;
  gender?: string;
  created_at?: string;
  updated_at?: string;
}

/** Coincide con VariantProductos del micro catálogo */
export interface ApiVariante {
  id?: number;
  producto_id: number;
  talla: string;
  color: string;
  existencias: number;
  precio: number;
}

/** Coincide con ProductoFactura del micro admin */
export interface ApiProductoFactura {
  nombre_producto: string;
  precio_unitario: number;
  cantidad: number;
  subtotal: number;
}

export interface ApiCreateFacturaInput {
  id_usuario: string;
  productos: Array<{
    nombre_producto: string;
    precio_unitario: number;
    cantidad: number;
    subtotal?: number;
  }>;
  estado?: EstadoFactura;
  dias_vencimiento?: number;
}

export interface ApiCreateFacturaResult {
  factura: ApiFactura;
  notificacion: unknown;
}

/** Coincide con Factura del micro admin */
export type EstadoFactura = "PENDIENTE" | "PAGADA" | "VENCIDA";

export interface ApiFactura {
  id: string;
  id_usuario: string;
  nombre_usuario: string;
  correo_usuario: string;
  productos: ApiProductoFactura[];
  total_productos: number;
  valor_total: number;
  fecha_emision: string;
  fecha_vencimiento: string;
  estado: EstadoFactura;
}
