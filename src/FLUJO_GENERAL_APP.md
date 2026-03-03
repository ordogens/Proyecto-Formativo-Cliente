# Flujo General de la Aplicacion (Mapa de Estudio)

Proyecto: `Proyecto-Formativo-Cliente`
Enfoque: explicar como se conecta lo que existe hoy para que la app funcione.

## 1) Vision global

La app es una SPA con React + TypeScript + Vite, con:
- Enrutamiento con `react-router-dom`.
- Estado global con Context API para:
  - Tema (`ThemeContext`)
  - Carrito (`ShopContext`)
  - Autenticacion (`AuthContext`) con `login/register/logout`
- Layout principal con header persistente.
- Vistas publicas (home, catalogo, categorias, detalle, carrito, personalizacion).
- Vista administrativa protegida por rol (`admin`) obtenido desde backend.

## 2) Punto de entrada real

Archivo: `src/main.tsx`

Orden de montaje:
1. `ThemeContextProvider`
2. `AuthProvider`
3. `ShopProvider`
4. `BrowserRouter`
5. `App`

## 3) Enrutamiento y layout base

Archivo: `src/App.tsx`

Rutas actuales:
- `/` -> `Home`
- `/catalogo` -> `Catalogo`
- `/personalizacion` -> `Personalizacion`
- `/ropa-hombre` -> `RopaHombre`
- `/ropa-mujer` -> `RopaMujer`
- `/gorros` -> `Gorros`
- `/vista-dinamica/:id` -> `VistaDinamica`
- `/carrito` -> `CarritoDeCompras`
- `/admin-view` -> `AdminView` protegido por `RequireAdmin`

Guardia:
- `RequireAdmin` revisa `user?.role`.
- Si no hay usuario o no es admin, redirige a `/`.

## 4) Header y capa global de UI

Archivo: `src/components/header/Header.tsx`

El header conecta:
- Navegacion (`useNavigate`, `NavLink`)
- Tema (`useThemeContext`)
- Carrito (`ShopContext`)
- Auth (`useAuth`)
- Apertura de `AuthModal`

## 5) Flujo de autenticacion actual

Archivos clave:
- `src/context/AuthContext.tsx`
- `src/components/auth/AuthForm.tsx`
- `src/components/auth/AuthModal.tsx`
- `src/components/modals/Modal.tsx`
- `src/services/auth.service.ts`
- `src/App.tsx`

Flujo:
1. Usuario abre modal desde Header/DropMenu.
2. `Modal` bloquea scroll del fondo, renderiza en portal (`document.body`) y permite cierre por:
   - `X`
   - click fuera
   - tecla `Esc`
3. En login:
   - se valida `email + contraseña`
   - NO se selecciona rol en pantalla
   - request: `POST /v1/usuarios/login` con `{ email, contraseña }`
   - backend responde con sesion, token y rol del usuario
4. En registro:
   - se captura `username`, `email`, `password` en UI
   - NO se envia ni asigna rol desde frontend
   - request: `POST /v1/usuarios` con `{ nombre, email, contraseña }`
   - el backend gestiona rol/privilegios y crea el admin automaticamente segun su configuracion
5. `AuthContext` mantiene estado de sesion, guarda `auth_user_session` y token `auth_access_token`.
6. El rol se reconoce segun los datos devueltos por backend.
7. `RequireAdmin` mantiene protegido `/admin-view`.

## 6) Flujo de carrito y compra

Archivos clave:
- `src/context/ShopProvide.tsx`
- `src/pages/vistaDinamica/VistaDinamica.tsx`
- `src/pages/carrito/CarritoDeCompras.tsx`
- `src/components/invoice/*`

### 6.1 Agregar al carrito
1. En `/vista-dinamica/:id`, usuario pulsa agregar.
2. Se usa `addToCart(...)` del contexto.
3. Header actualiza contador.

### 6.2 Administrar carrito
En `CarritoDeCompras`:
- Listar items.
- Aumentar/disminuir cantidad.
- Eliminar item.
- Calcular subtotal y total con envio.

### 6.3 Finalizar compra y factura
- Si el carrito esta vacio:
  - boton `Finalizar compra` deshabilitado
  - no se ejecuta la funcion de compra
  - no se abre factura
- Si hay productos:
  - se muestra alerta de compra
  - se abre `InvoiceModal`

## 7) Flujo de catalogo y detalle

- `Catalogo.tsx`: entrada por categorias.
- `RopaHombre.tsx`, `RopaMujer.tsx`, `Gorros.tsx`: filtrado por categoria.
- `ProductCard` navega a `/vista-dinamica/:id`.

## 8) Flujo de personalizacion

Archivo: `src/pages/Personalizacion.tsx`

Incluye:
- Carga de imagen
- Drag and drop
- Descarga
- Compartir (con fallback)

## 9) Flujo de tema

Archivos:
- `src/context/ThemeProvider.tsx`
- `src/components/header/Header.tsx`
- `src/components/header/DropMenu.tsx`

Comportamiento:
- Lee/guarda tema en `localStorage`.
- Aplica clase `dark` en `html`.

## 10) Flujo de panel admin

Archivos:
- `src/pages/adminView/AdminView.tsx`
- `src/pages/adminView/views/ProductosView.tsx`
- `src/components/admin/ModalProducts.tsx`
- `src/components/admin/table/ProductsTable.tsx`

Estado actual:
- Panel por tabs funcional.
- Vista de productos con modal de alta/edicion.
- Validaciones en modal:
  - obligatorios: `name`, `stock`, `category`, `image`
  - `price/stock` permiten placeholder cuando estan vacios
  - `Seleccionar categoria` no es opcion valida para guardar

## 11) Estado actual del MVP

Estado: `MVP funcional de frontend`.

Incluye:
1. Navegacion completa y estructura modular.
2. Login/registro con roles definidos por backend y proteccion de vista admin.
3. Modal reutilizable con bloqueo de fondo y cierre por `Esc`.
4. Carrito funcional con regla de no generar factura cuando esta vacio.
5. Modulo de personalizacion operativo.
6. Panel admin funcional en frontend con gestion base de productos.

## 12) Limites actuales del MVP

1. No hay backend real para productos/pedidos/clientes.
2. Panel admin usa datos mock/locales y no persiste cambios.
3. Factura aun no usa productos reales del carrito en todo el flujo PDF.
4. No hay validaciones de negocio del lado servidor para compras/pedidos/clientes.
5. Faltan estados de carga/error consistentes en toda la app.
6. Faltan pruebas automatizadas (unitarias, integracion, e2e).
7. Falta accesibilidad completa en modales/formularios (focus trap, navegacion teclado completa).
8. El bundle es grande (warning de chunks > 500 kB en build).
9. No hay observabilidad de produccion (logs estructurados, metricas, tracing).

## 13) Backlog recomendado para construir (roadmap)

1. Backend base: API para `products`, `orders`, `users` (auth/roles ya definidos en backend).
2. Seguridad: consolidar estrategia de sesion/token y evitar persistencia sensible en frontend.
3. Catalogo real: listar/crear/editar/eliminar productos conectados a backend.
4. Admin real: conectar `ProductosView` y tabla a endpoints CRUD con persistencia.
5. Carrito persistente: guardar carrito por usuario y restaurarlo al iniciar sesion.
6. Factura real: generar factura desde items reales del carrito/orden creada.
7. Pedidos reales: crear orden al comprar y mostrar historial de pedidos.
8. Manejo de UX de red: loaders, errores, reintentos y mensajes unificados.
9. Validaciones: reglas compartidas front+back para formularios y archivos.
10. Accesibilidad: focus trap en modales, roles ARIA y flujo teclado.
11. Testing: unit tests, integracion de flujos criticos y e2e basico.
12. Observabilidad: logging de errores, metricas y alertas.
13. Performance: dividir chunks, lazy loading y optimizacion de assets.
14. DevOps: ambientes `dev/staging/prod`, variables de entorno y pipeline de despliegue.
