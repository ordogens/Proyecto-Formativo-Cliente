export const ADMIN_VIEWS = {
  RESUMEN: "resumen",
  PRODUCTOS: "productos",
  PEDIDOS: "pedidos",
  IA: "ia",
  CLIENTES: "clientes",
} as const

export type AdminViewType = typeof ADMIN_VIEWS[keyof typeof ADMIN_VIEWS]
