# Documentacion de `pages/adminView`

## Objetivo
Explicar la pagina admin como modulo funcional: estado de vista activa, estructura principal y vistas hijas.

Carpeta documentada:
- `src/pages/adminView`

---

## Por que esta guia va separada de `components/admin`
Si, aqui conviene tener dos guias:
1. `components/admin`: piezas reutilizables y UI.
2. `pages/adminView`: composicion final y flujo de la pantalla.

Separarlas ayuda a estudiar y mantener mejor:
- una capa para bloques reutilizables,
- otra para la pagina que los orquesta.

---

## Estructura actual de la carpeta
- `AdminView.tsx`
- `views/ResumenView.tsx`
- `views/ProductosView.tsx`
- `views/PedidosView.tsx`
- `views/IAView.tsx`
- `views/ClientesView.tsx`

---

## Flujo principal del panel admin (en orden)
1. Ruta en `src/App.tsx`:
   - `/admin-view` -> `AdminView`.
2. `AdminView.tsx` inicializa estado:
   - `activeView = ADMIN_VIEWS.RESUMEN`.
3. `AdminView.tsx` renderiza:
   - encabezado del panel,
   - `AdminNavbar`,
   - zona de contenido.
4. `AdminNavbar` actualiza `activeView` cuando el usuario cambia de tab.
5. `AdminContent` recibe `activeView` y monta la vista correspondiente.
6. Las vistas (`views/*`) renderizan contenido especifico por modulo.

---

## 1) `AdminView.tsx` (orquestador)
- Responsabilidad:
  - Componer todo el panel.
  - Mantener el estado de navegacion interna (`activeView`).
  - Pasar props a `AdminNavbar` y `AdminContent`.

Estado:
- `useState<AdminViewType>(ADMIN_VIEWS.RESUMEN)`

Composicion:
- Header de panel
- Navegacion interna (`AdminNavbar`)
- Contenedor de contenido (`AdminContent`)

---

## 2) `views/ResumenView.tsx`
- Responsabilidad:
  - Vista dashboard inicial.
  - Mostrar tarjetas KPI con `AdminCards`.
  - Reservar espacio para futuras graficas.

Dependencias:
- `AdminCards` (components/admin)
- `cards` (data mock de `src/data/cards.ts`)

## 3) `views/ProductosView.tsx`
- Estado actual:
  - Placeholder visual (`ProductosView`).
- Proposito esperado:
  - Gestion CRUD de productos.

## 4) `views/PedidosView.tsx`
- Estado actual:
  - Placeholder visual (`PedidosView`).
- Proposito esperado:
  - Tabla/estado de ordenes y seguimiento.

## 5) `views/IAView.tsx`
- Estado actual:
  - Placeholder visual (`IAView`).
- Proposito esperado:
  - Gestion de personalizaciones IA y colas de generacion.

## 6) `views/ClientesView.tsx`
- Estado actual:
  - Placeholder visual (`ClientesView`).
- Proposito esperado:
  - Listado y analitica de clientes.

---

## Como se complementa con `components/admin`
- `AdminView.tsx` no decide contenido por si solo.
- Delega:
  - navegacion de tabs a `AdminNavbar`,
  - seleccion de vista a `AdminContent`,
  - tarjetas KPI a `AdminCards` (dentro de `ResumenView`).

Resumen tecnico:
- `pages/adminView` = capa de pagina y experiencia final.
- `components/admin` = bloques de UI + router interno reutilizable.

---

## Guia de estudio recomendada (orden)
1. `App.tsx`: ubica la ruta `/admin-view`.
2. `AdminView.tsx`: identifica estado y estructura general.
3. `AdminNavbar.tsx`: entiende como cambia `activeView`.
4. `AdminContent.tsx`: entiende como se resuelve cada tab.
5. `views/ResumenView.tsx`: analiza el primer caso real con `AdminCards`.
6. `views/*` restantes: define qué falta para completarlas.

---

## Checklist para dejar el panel listo para produccion
- Reemplazar placeholders de `Productos/Pedidos/IA/Clientes` por componentes reales.
- Conectar `cards.ts` a datos reales (API o estado global).
- Agregar manejo de carga y error por cada vista.
- Revisar accesibilidad de tabs (soporte teclado y `button` semantico).
- Corregir altura fija del contenedor (`h-200`) si genera cortes en pantallas pequeñas.
