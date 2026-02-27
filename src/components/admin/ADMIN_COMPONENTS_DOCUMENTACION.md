# Documentacion de `components/admin`

## Objetivo
Documentar los componentes UI/reutilizables del panel admin y explicar como se conectan con `pages/adminView`.

Carpeta documentada:
- `src/components/admin`

---

## Que contiene esta carpeta
- `AdminNavbar.tsx`
- `AdminContent.tsx`
- `AdminCards.tsx`
- `AdminViews.tsx` (archivo legado/no usado en el flujo actual)

---

## Flujo de uso (de esta carpeta hacia el panel)
1. `AdminView.tsx` (page) guarda el estado `activeView`.
2. `AdminView.tsx` renderiza `AdminNavbar` y le pasa:
   - vista activa (`active`)
   - callback para cambiar vista (`onChange`)
3. Al hacer clic en navbar, cambia `activeView`.
4. `AdminView.tsx` pasa `activeView` a `AdminContent`.
5. `AdminContent` decide qué componente de `pages/adminView/views` renderizar.
6. En `ResumenView`, se usa `AdminCards` para mostrar métricas.

---

## 1) `AdminNavbar.tsx`
- Responsabilidad:
  - Renderizar tabs del panel (Resumen, Productos, Pedidos, IA, Clientes).
  - Marcar visualmente la vista activa.
  - Disparar cambios de vista.

Props:
- `active: AdminViewType`
- `onChange: (view: AdminViewType) => void`

Dependencia clave:
- `ADMIN_VIEWS` (`src/data/adminViews.ts`) para usar constantes tipadas y evitar strings sueltos.

Punto fuerte:
- `itemClass(view)` centraliza estilos de estado activo/inactivo.

## 2) `AdminContent.tsx`
- Responsabilidad:
  - Actuar como router interno del panel admin.
  - Recibir `view` y seleccionar la vista correcta con `switch`.

Props:
- `view: AdminViewType`

Salida por caso:
- `resumen` -> `ResumenView`
- `productos` -> `ProductosView`
- `pedidos` -> `PedidosView`
- `ia` -> `IAView`
- `clientes` -> `ClientesView`

Punto clave:
- Separa la logica de seleccion de vista del archivo principal `AdminView.tsx`.

## 3) `AdminCards.tsx`
- Responsabilidad:
  - Mostrar tarjetas KPI reutilizables para el dashboard.
  - Recibe icono dinamico (`LucideIcon`) + valor + descripcion.

Props:
- `title`
- `icon`
- `value`
- `description?`

Uso real actual:
- En `ResumenView.tsx` mapeando `cards` desde `src/data/cards.ts`.

## 4) `AdminViews.tsx`
- Estado actual:
  - Exporta componentes simples (`ResumenView`, `ProductosView`, etc.) en el mismo archivo.
  - No aparece importado por `AdminView` ni por `AdminContent` en el flujo vigente.

Recomendacion:
- Mantenerlo solo si lo vas a reutilizar.
- Si no se usa, conviene eliminarlo para evitar confusion con `pages/adminView/views`.

---

## Dependencias de datos del modulo
- `src/data/adminViews.ts`
  - Define constantes de vistas y tipo `AdminViewType`.
- `src/data/cards.ts`
  - Define data mock de KPIs para `AdminCards`.

---

## Guia de estudio (solo components/admin)
1. Lee `AdminNavbar.tsx` y entiende el contrato `active/onChange`.
2. Lee `adminViews.ts` para comprender el tipado de vistas.
3. Lee `AdminContent.tsx` y sigue el `switch`.
4. Lee `AdminCards.tsx` y revisa por qué recibe `icon` como componente.
5. Revisa `ResumenView.tsx` para ver el uso real de `AdminCards`.

---

## Checklist de mantenimiento
- Si agregas una nueva vista:
  - agrega constante en `adminViews.ts`,
  - agrega item en `AdminNavbar.tsx`,
  - agrega caso en `AdminContent.tsx`,
  - crea la vista en `pages/adminView/views`.
- Si cambias diseño de KPIs:
  - ajusta `AdminCards.tsx`,
  - verifica que `cards.ts` siga cumpliendo el contrato.
