export interface Product {
  id: number;
  name: string;
  price: number;
}

/** Estados de pedido en la UI */
export type OrderStatus = "confirmado" | "pendiente" | "vencida";

/** Representación UI de un pedido/factura */
export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  items: number;
  total: number;
  status: OrderStatus;
}
