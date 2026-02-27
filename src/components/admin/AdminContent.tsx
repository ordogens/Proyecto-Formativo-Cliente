import { ProductosView } from "../../pages/adminView/views/ProductosView"
import { ClientesView } from "../../pages/adminView/views/ClientesView"
import { ResumenView } from "../../pages/adminView/views/ResumenView"
import { PedidosView } from "../../pages/adminView/views/PedidosView"
import { IAView } from "../../pages/adminView/views/IAView"
import { ADMIN_VIEWS } from "../../data/adminViews"

import type { AdminViewType } from "../../data/adminViews"

interface Props {
  view: AdminViewType
}

export const AdminContent = ({ view }: Props) => {
  switch (view) {
    case ADMIN_VIEWS.RESUMEN:
      return <ResumenView />
    case ADMIN_VIEWS.PRODUCTOS:
      return <ProductosView />
    case ADMIN_VIEWS.PEDIDOS:
      return <PedidosView />
    case ADMIN_VIEWS.IA:
      return <IAView />
    case ADMIN_VIEWS.CLIENTES:
      return <ClientesView />
    default:
      return null
  }
}