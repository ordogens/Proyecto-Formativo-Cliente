# Proyecto Formativo Cliente

Frontend SPA para e-commerce con personalizacion IA y panel admin.

## Stack
- React 19 + TypeScript + Vite
- React Router DOM
- Context API (tema, auth, carrito)
- Tailwind CSS v4
- Axios
- Firebase Auth (Google popup)
- SweetAlert2

## Scripts
- `npm run dev`: entorno local
- `npm run build`: build de produccion
- `npm run lint`: analisis estatico
- `npm run preview`: previsualizacion del build

## Arquitectura general
- Entrada: `src/main.tsx`
- Ruteo: `src/App.tsx`
- Layout principal: `src/layouts/PrincipalLayout.tsx`
- Contextos globales:
  - `src/context/ThemeProvider.tsx`
  - `src/context/AuthContext.tsx`
  - `src/context/ShopProvide.tsx`
- Servicios API:
  - `src/services/auth.service.ts`
  - `src/services/catalog.service.ts`
  - `src/services/order.service.ts`
  - `src/services/nanoService.ts`

## Funcionalidades implementadas
- Navegacion publica: home, catalogo, categorias, detalle, carrito, personalizacion.
- Login/registro con backend y soporte de login con Google.
- Proteccion de ruta `/admin-view` por rol `admin`.
- Catalogo conectado a API (productos/categorias).
- Panel admin con vistas activas de resumen, productos y pedidos.
- CRUD base de productos (crear, editar, eliminar) conectado a API.
- Vista de pedidos consumiendo facturas desde API.
- Carrito con contexto global y calculo de totales.
- Factura en modal con descarga PDF.

## Variables de entorno esperadas
- `VITE_GATEWAY_URL` (opcional): URL base del gateway (default `http://localhost:1010`).
- `VITE_USERS_LOGOUT_PATH` (opcional): endpoint de logout para usuarios.
- Variables de Firebase usadas en `src/config/firebase.ts`.

## Endpoints consumidos (via gateway)
Definidos en `src/config/api.ts`:
- Auth: `.../api/usuarios/v1/usuarios`
- Catalogo: `.../api/catalogo`
- Admin: `.../api/admin/admin`
- IA: `.../api/generate` y otros prefijos

## Estado actual
El frontend esta funcional y ya consume API en auth, catalogo y pedidos.
Aun hay partes en transicion a flujo 100% productivo (ejemplo: invoice del carrito todavia usa productos mock para el PDF/modal).

## Documentacion interna
- Flujo general: `src/FLUJO_GENERAL_APP.md`
- Auth: `src/components/auth/AUTH_DOCUMENTACION.md`
- Admin (page): `src/pages/adminView/ADMIN_VIEW_DOCUMENTACION.md`
- Admin (componentes): `src/components/admin/ADMIN_COMPONENTS_DOCUMENTACION.md`
- Vista dinamica: `src/pages/vistaDinamica/VISTA_DINAMICA_DOCUMENTACION.md`
- Invoice: `src/components/invoice/INVOICE_DOCUMENTACION.md`
- Personalizacion: `src/components/componentesPersonalizacion/PERSONALIZACION_DOCUMENTACION.md`
- Carrito: `src/context/CARRITO_CONTEXT_DOCUMENTACION.md`
- Tema: `src/context/THEME_CONTEXT_DOCUMENTACION.md`
