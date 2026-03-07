# Documentacion de `components/admin` (actualizada)

## Objetivo
Documentar componentes reutilizables del panel admin y su conexion con `pages/adminView`.

Carpeta:
- `src/components/admin`

## Componentes activos
- `AdminNavbar.tsx`
- `AdminContent.tsx`
- `AdminCards.tsx`
- `ModalProducts.tsx`
- `table/ProductsTable.tsx`
- `table/PedidosTable.tsx`

Componente legacy:
- `AdminViews.tsx` (no participa en el flujo principal actual).

## Flujo entre page y componentes
1. `AdminView.tsx` mantiene `activeView`.
2. `AdminNavbar` dispara cambios de vista.
3. `AdminContent` selecciona la vista concreta.
4. `ProductosView` usa `ModalProducts` y `ProductsTable`.
5. `PedidosView` usa `PedidosTable`.

## 1) `AdminNavbar.tsx`
- Renderiza tabs disponibles segun `ADMIN_VIEWS`:
  - `resumen`
  - `productos`
  - `pedidos`
- Contrato:
  - `active`
  - `onChange`

## 2) `AdminContent.tsx`
- Router interno del panel.
- `switch` real:
  - `ADMIN_VIEWS.RESUMEN` -> `ResumenView`
  - `ADMIN_VIEWS.PRODUCTOS` -> `ProductosView`
  - `ADMIN_VIEWS.PEDIDOS` -> `PedidosView`

## 3) `AdminCards.tsx`
- Tarjetas KPI para `ResumenView`.
- Datos actuales provienen de `src/data/cards.ts` (mock).

## 4) `ModalProducts.tsx`
- Formulario de crear/editar producto.
- Validaciones de campos obligatorios:
  - `name`
  - `stock`
  - `categoryId`
  - `image`
- `price`/`stock` permiten valor vacio para UX de placeholder.

## 5) `table/ProductsTable.tsx`
- Carga productos y categorias desde API (`catalogService`).
- Mapea datos API a formato UI local.
- Soporta:
  - editar (callback)
  - eliminar (API)
  - ajuste de stock local en tabla (no persistente)

## 6) `table/PedidosTable.tsx`
- Carga facturas desde API (`orderService.getAllInvoices`).
- Convierte API -> UI con `apiFacturaToOrder`.
- Permite cambiar estado en UI local (sin persistencia backend).

## Pendientes del modulo
1. Persistir ajustes de stock y estado de pedidos en backend.
2. Mejorar manejo de errores visibles (hoy se usa `console.error`).
3. Retirar o documentar definitivamente `AdminViews.tsx` para evitar confusion.
