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
  stock?: number;
  existencias?: number;
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

export type ApiTipoCuenta = "debito" | "credito";

export interface ApiBanco {
  id: number;
  nombre: string;
}

export interface ApiCuentaBancaria {
  id: number;
  numero_de_cuenta: string;
  tipo_de_cuenta: ApiTipoCuenta;
  banco: string;
  id_user: number;
}

export interface ApiCuentasUsuario {
  usuario: unknown;
  cuentas: ApiCuentaBancaria[];
}

export type ApiEstadoPago =
  | "PENDIENTE"
  | "APROBADA"
  | "RECHAZADA"
  | "CANCELADA"
  | "EXPIRADA"
  | "ERROR";

export interface ApiCheckoutCustomer {
  name?: string;
  email?: string;
  phone?: string;
  docType?: string;
  docNumber?: string;
}

export interface ApiCheckoutPayload {
  orderId: string;
  userId: number;
  amount: number;
  currency?: string;
  description: string;
  tax?: number;
  taxBase?: number;
  customer?: ApiCheckoutCustomer;
}

export interface ApiPaymentRecord {
  id?: number | null;
  order_id: string;
  user_id: number;
  provider: "epayco" | "mock" | string;
  provider_reference: string;
  epayco_ref?: string | null;
  transaction_id?: string | null;
  amount: number;
  currency: string;
  description: string;
  status: ApiEstadoPago;
  raw_response?: string | null;
}

export interface ApiCheckoutConfig {
  provider: "epayco" | "mock" | string;
  key?: string;
  test?: boolean;
  [key: string]: unknown;
}

export interface ApiCheckoutResult {
  id: number | null;
  payment: ApiPaymentRecord;
  checkoutConfig: ApiCheckoutConfig;
}

export type ApiPagoEpayco = ApiPaymentRecord;

export type ApiCheckoutResponse = ApiCheckoutResult;
