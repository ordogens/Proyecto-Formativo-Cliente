# Flujo General de la Aplicacion (Mapa de estudio actualizado)

Proyecto: `Proyecto-Formativo-Cliente`
Objetivo: documentar como funciona hoy la app con los cambios recientes.

## 1) Vision general

Aplicacion SPA con React + TypeScript + Vite.

Capas principales:
- Ruteo con `react-router-dom`.
- Estado global con Context API:
  - Tema (`ThemeContext`)
  - Autenticacion (`AuthContext`)
  - Carrito (`ShopContext`)
- Layout principal con header persistente.
- Integracion con gateway para auth, catalogo, admin, pedidos y IA.

## 2) Punto de entrada real

Archivo: `src/main.tsx`

Orden de providers:
1. `ThemeContextProvider`
2. `AuthProvider`
3. `ShopProvider`
4. `BrowserRouter`
5. `App`

## 3) Rutas activas

Archivo: `src/App.tsx`

Rutas:
- `/` -> `Home`
- `/catalogo` -> `Catalogo`
- `/personalizacion` -> `Personalizacion`
- `/ropa-hombre` -> `RopaHombre`
- `/ropa-mujer` -> `RopaMujer`
- `/gorros` -> `Gorros`
- `/vista-dinamica/:id` -> `VistaDinamica`
- `/carrito` -> `CarritoDeCompras`
- `/admin-view` -> `AdminView` (protegida por rol `admin`)

Guardia de acceso:
- `RequireAdmin` valida `user?.role === "admin"`.
- Si no cumple, redirige a `/`.

## 4) Capa de API y servicios

Archivo de configuracion: `src/config/api.ts`

Base:
- `VITE_GATEWAY_URL` (default: `http://localhost:1010`)

Prefijos usados:
- Auth: `/api/usuarios/v1/usuarios`
- Catalogo: `/api/catalogo`
- Admin: `/api/admin/admin`
- IA: `/api/generate` y otros

Servicios activos:
- `src/services/auth.service.ts`
- `src/services/catalog.service.ts`
- `src/services/order.service.ts`
- `src/services/nanoService.ts`

## 5) Flujo de autenticacion

Archivos clave:
- `src/context/AuthContext.tsx`
- `src/services/auth.service.ts`
- `src/components/auth/AuthForm.tsx`
- `src/components/auth/AuthModal.tsx`
- `src/components/modals/Modal.tsx`

Flujo:
1. Usuario abre modal desde header.
2. `AuthForm` soporta:
   - login email/password
   - registro
   - login con Google (Firebase popup + backend)
3. `auth.service` guarda token en `auth_access_token`.
4. `AuthContext` persiste usuario en `auth_user_session`.
5. El rol retornado por backend controla acceso a admin.

## 6) Flujo de catalogo y detalle

Archivos:
- `src/pages/RHombre/RopaHombre.tsx`
- `src/pages/RMujer/RopaMujer.tsx`
- `src/pages/Gorros/Gorros.tsx`
- `src/pages/vistaDinamica/VistaDinamica.tsx`
- `src/services/catalog.service.ts`
- `src/utils/catalogProducts.ts`

Estado actual:
- Las vistas de categoria consultan productos y categorias desde API.
- Se filtra por genero/categoria con helpers (`matchesAudience`).
- `VistaDinamica` carga producto por id desde API.

## 7) Flujo de carrito y compra

Archivos:
- `src/context/ShopProvide.tsx`
- `src/pages/carrito/CarritoDeCompras.tsx`
- `src/components/invoice/*`

Estado:
- Carrito global funcional (agregar, quitar, aumentar/disminuir, total).
- Finalizar compra abre modal de invoice solo si hay items.
- Invoice modal y PDF existen, pero usan lista local mock en `Invoice.tsx`.

## 8) Flujo de personalizacion IA

Archivos:
- `src/pages/Personalizacion.tsx`
- `src/components/componentesPersonalizacion/*`
- `src/services/nanoService.ts`

Estado:
- Subida de imagen por input o drag & drop.
- Prompt + aspect ratio + creatividad.
- Generacion de imagen contra endpoint IA (`IA_GENERATE_API`).
- Acciones de descargar y compartir (con fallback).

## 9) Flujo del panel admin

Archivos:
- `src/pages/adminView/AdminView.tsx`
- `src/components/admin/AdminNavbar.tsx`
- `src/components/admin/AdminContent.tsx`
- `src/pages/adminView/views/ResumenView.tsx`
- `src/pages/adminView/views/ProductosView.tsx`
- `src/pages/adminView/views/PedidosView.tsx`

Tabs activas:
- Resumen
- Productos
- Pedidos

Estado:
- `ProductosView` + `ProductsTable` consumen API de catalogo.
- Crear/editar/eliminar productos integrado al servicio.
- `PedidosTable` consume facturas con `orderService`.
- Cambio de estado en pedidos es solo local en UI (no persiste aun).

## 10) Estado actual del proyecto (marzo 2026)

Estado general:
- Frontend funcional con integracion real de API en auth, catalogo, admin productos y lectura de pedidos.
- Estructura modular consolidada y documentada por feature.

Completado:
1. Ruteo base y proteccion de admin por rol.
2. Sesion de usuario persistida en cliente con token para requests.
3. Catalogo y detalle de producto conectados a backend.
4. Gestion admin de productos (alta/edicion/eliminacion).
5. Listado de pedidos/facturas en panel admin.
6. Flujo de personalizacion IA conectado a endpoint.
7. Carrito funcional y modal de factura con descarga PDF.

## 11) Que falta (pendientes reales)

1. Conectar invoice del carrito con items reales (`ShopContext`) en lugar de productos mock.
2. Persistir en backend los cambios de estado de pedidos desde `PedidosTable`.
3. Persistir stock real en backend (hoy el ajuste `+/-` en tabla es solo local).
4. Manejo uniforme de estados de carga/error en todas las pantallas.
5. Mejorar accesibilidad en componentes interactivos (tabs con `button`, focus management).
6. Corregir detalles visuales y de layout en admin (ejemplo contenedor con `h-200 bg-red-400` temporal).
7. Agregar pruebas automatizadas (unitarias, integracion y e2e).
8. Limpiar archivos legacy/no usados y textos con codificacion rota.

## 12) Riesgos tecnicos vigentes

1. Inconsistencias de respuesta API entre endpoints (en algunos se usa `data.data`, en otros objeto directo).
2. Persistencia de token y sesion solo en `localStorage` sin estrategia adicional de seguridad.
3. Ausencia de monitoreo y logging funcional para produccion.
4. Falta de validaciones de negocio end-to-end para pedidos/facturacion.
