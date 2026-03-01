import { ProductosView } from "../../pages/adminView/views/ProductosView"
import { ResumenView } from "../../pages/adminView/views/ResumenView"
import { PedidosView } from "../../pages/adminView/views/PedidosView"
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
    default:
      return null
  }
}
