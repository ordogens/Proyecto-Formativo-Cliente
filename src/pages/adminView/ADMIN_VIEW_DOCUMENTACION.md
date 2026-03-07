# Documentacion de `pages/adminView` (actualizada)

## Objetivo
Documentar la pagina administrativa real, su composicion y el estado de cada vista activa.

Carpeta:
- `src/pages/adminView`

## Estructura actual valida
- `AdminView.tsx`
- `views/ResumenView.tsx`
- `views/ProductosView.tsx`
- `views/PedidosView.tsx`

Nota:
- No existen en el flujo actual `IAView.tsx` ni `ClientesView.tsx`.

## Flujo principal del panel admin
1. En `src/App.tsx` la ruta `/admin-view` esta protegida por `RequireAdmin`.
2. `AdminView.tsx` inicializa `activeView = ADMIN_VIEWS.RESUMEN`.
3. `AdminView.tsx` renderiza encabezado, `AdminNavbar` y `AdminContent`.
4. `AdminNavbar` cambia `activeView`.
5. `AdminContent` resuelve que vista montar (`resumen`, `productos`, `pedidos`).

## 1) `AdminView.tsx`
- Rol: orquestador de la pagina.
- Estado: `useState<AdminViewType>`.
- Usa `useAuth()` para mostrar nombre del admin en cabecera.

Detalle a revisar:
- Contenedor visual temporal: `h-200 bg-red-400`.

## 2) `views/ResumenView.tsx`
- Dashboard inicial.
- Renderiza KPIs con `AdminCards`.
- Fuente actual: `src/data/cards.ts` (mock local).

## 3) `views/ProductosView.tsx`
- Gestion de productos funcional.
- Abre `ModalProducts` para crear/editar.
- Carga categorias desde API (`catalogService.getCategories`).
- Guarda cambios con:
  - `catalogService.createProduct`
  - `catalogService.updateProduct`
- Filtra por categoria y genero.

## 4) `views/PedidosView.tsx`
- Vista activa de pedidos.
- Renderiza `PedidosTable`.
- Incluye botones de filtro visual (sin logica aplicada aun).

## Estado actual del modulo admin
- Panel operativo en tres tabs reales: resumen, productos y pedidos.
- Integracion API activa en productos y pedidos.
- Pendiente persistencia de cambios de estado en pedidos.

## Pendientes del modulo
1. Persistir cambio de estado de pedidos en backend.
2. Conectar filtros de `PedidosView` a logica real.
3. Reemplazar KPI mock por datos reales.
4. Ajustar layout temporal del contenedor principal.
