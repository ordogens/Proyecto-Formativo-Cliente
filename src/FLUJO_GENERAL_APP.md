# Flujo General de la Aplicacion (Mapa de Estudio)

Proyecto: `Proyecto-Formativo-Cliente`  
Enfoque: explicar como se conecta todo lo que existe hoy para que la app funcione.

## 1) Vision global

La app es una SPA en React + TypeScript + Vite con:
- Enrutamiento con `react-router-dom`.
- Estado global con Context API para:
  - Tema (`ThemeContext`)
  - Carrito (`ShopContext`)
  - Autenticacion simulada y rol (`AuthContext`)
- Layout principal con header persistente.
- Vistas publicas (home, catalogo, categorias, detalle, carrito, personalizacion).
- Vista administrativa protegida por rol (`admin`).

## 2) Punto de entrada real

Archivo: `src/main.tsx`

Orden de montaje:
1. `ThemeContextProvider`
2. `AuthProvider`
3. `ShopProvider`
4. `BrowserRouter`
5. `App`

Por que este orden importa:
- Cualquier componente dentro de `App` puede leer tema, auth y carrito.
- Si un componente usa `useThemeContext`, `useAuth` o `ShopContext`, no rompe porque el provider ya esta arriba.

## 3) Enrutamiento y layout base

Archivo: `src/App.tsx`

Estructura:
- `PrincipalLayout` envuelve todas las rutas.
- `PrincipalLayout` siempre renderiza `Header`.
- Debajo del header cambia el contenido segun la ruta.

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

Guardia de rol:
- `RequireAdmin` revisa `user?.role`.
- Si no hay usuario o no es admin, redirige a `/`.

## 4) Header: centro de orquestacion de UX global

Archivo: `src/components/header/Header.tsx`

El header conecta varias capacidades transversales:
- Navegacion (`useNavigate` y `NavLink`)
- Tema (`useThemeContext`)
- Carrito (`ShopContext`) mostrando contador `totalItems`
- Autenticacion (`useAuth`) mostrando:
  - `Login` cuando no hay sesion
  - `Logout` cuando hay sesion
  - Badge con rol actual
  - acceso al panel admin solo cuando `role === "admin"`
- Modal de login (`AuthModal`)
- Menu movil (`DropMenu`) con opciones condicionales

En la practica, el header es la "capa de control UI" global de la app.

## 5) Flujo de autenticacion actual (simulada)

Archivos clave:
- `src/context/AuthContext.tsx`
- `src/components/auth/AuthModal.tsx`
- `src/components/auth/AuthForm.tsx`
- `src/App.tsx` (guard de admin)
- `src/components/header/Header.tsx` / `DropMenu.tsx`

Flujo:
1. Usuario abre login desde header o menu movil.
2. `AuthModal` monta `AuthForm` dentro de `Modal`.
3. En login, `AuthForm` permite elegir rol simulado: `Usuario` o `Admin`.
4. Al enviar, llama `login(role)` del contexto.
5. `AuthContext` crea usuario fake en memoria.
6. UI se actualiza automaticamente (React state):
   - login -> logout
   - badge de rol
   - opcion admin habilitada si es admin
7. Si navega a `/admin-view`, el guard valida rol.

Estado actual:
- No hay backend.
- No hay tokens.
- No hay persistencia: al recargar se pierde sesion.

## 6) Flujo de carrito y compra

Archivos clave:
- `src/context/ShopProvide.tsx`
- `src/context/shopContext.ts`
- `src/pages/vistaDinamica/VistaDinamica.tsx`
- `src/pages/carrito/CarritoDeCompras.tsx`
- `src/components/invoice/*`

### 6.1 Agregar al carrito
1. Usuario entra a detalle de producto en `/vista-dinamica/:id`.
2. `VistaDinamica` busca el producto en `productos`.
3. Boton "Agregar al carrito" llama `addToCart(...)`.
4. `ShopProvider`:
   - si existe mismo `productId` + mismo `personalized`, suma cantidad
   - si no existe, agrega nuevo item
5. Header refleja contador actualizado (`totalItems`).

### 6.2 Administrar carrito
En `CarritoDeCompras`:
- lista `cart`
- permite aumentar/disminuir cantidad
- permite eliminar item
- calcula subtotal desde contexto
- suma envio fijo para total final

### 6.3 Finalizar compra (simulado)
- Se lanza alerta de compra exitosa (`sweetalert2`).
- Se abre `InvoiceModal` para mostrar factura.
- El PDF se puede generar con utilidades (`generateInvoicePDF`), segun flujo del modulo invoice.

## 7) Flujo de catalogo y navegacion de productos

### 7.1 Catalogo general
Archivo: `src/pages/Catalogo.tsx`
- Muestra 3 cards de categoria.
- Cada card navega a su pagina.

### 7.2 Paginas por categoria
Archivos:
- `RopaHombre.tsx`
- `RopaMujer.tsx`
- `Gorros.tsx`

Patron comun:
1. filtran `productos` por categoria
2. renderizan `ProductsLayout`
3. dentro, renderizan `ProductCard` por item

### 7.3 Card y detalle
`ProductCard` navega a `/vista-dinamica/:id` para ver informacion completa y comprar.

## 8) Flujo de tema (light/dark)

Archivos:
- `src/context/ThemeProvider.tsx`
- `src/context/ThemeContext.tsx`
- `src/components/header/Header.tsx`
- `src/components/header/DropMenu.tsx`

Comportamiento:
1. Al iniciar, lee `localStorage("theme")`.
2. Si no hay valor, usa preferencia del sistema.
3. Aplica clase `dark` al elemento `html`.
4. Guarda cambios en `localStorage`.
5. Header y menu movil exponen boton para alternar tema.

## 9) Flujo de panel administrador

Archivos:
- `src/pages/adminView/AdminView.tsx`
- `src/components/admin/AdminNavbar.tsx`
- `src/components/admin/AdminContent.tsx`
- `src/data/adminViews.ts`
- `src/pages/adminView/views/*`

Como opera:
1. Solo entra un usuario `admin` por `RequireAdmin`.
2. `AdminView` maneja `activeView` local.
3. `AdminNavbar` cambia pestaña (`resumen`, `productos`, `pedidos`, `ia`, `clientes`).
4. `AdminContent` decide que vista renderizar con switch.

Resultado:
- Navegacion interna del panel sin cambiar URL.

## 10) Dependencias funcionales entre capas

Mapa simplificado:

`main.tsx`  
-> providers globales  
-> `App.tsx` (rutas + guardias)  
-> `PrincipalLayout` (header fijo)  
-> pagina activa por ruta  
-> componentes de feature  
-> contextos/estado global (auth, carrito, tema)

Regla general del proyecto:
- Datos compartidos: contextos.
- Datos de vista puntual: `useState` local en componentes.
- Navegacion: router.

## 11) Que permite que tu app funcione hoy

1. Providers en `main.tsx` correctamente montados.
2. Router y rutas en `App.tsx`.
3. Header persistente que conecta navigation + auth + carrito + tema.
4. `ShopProvider` con logica de carrito.
5. `AuthContext` con rol simulado y guard de admin.
6. Componentes de pagina conectados a `productos` y `ProductCard`.
7. Modulo de factura para cierre visual de compra.

Sin cualquiera de esos bloques, el flujo end-to-end se rompe.

## 12) Observaciones tecnicas actuales (importante para estudiar)

1. La autenticacion es simulada, no segura para produccion.
2. En `Gorros.tsx` se esta filtrando por `"hombre"` y no por `"gorros"`.
3. En `data/Productos.ts` hay IDs repetidos en productos de hombre.
4. La factura actual usa lista de productos hardcodeada en `Invoice.tsx`, no toma directamente el carrito real.
5. Hay varios textos con caracteres mal codificados (tildes) por encoding.

Estas observaciones no impiden estudiar arquitectura, pero si son puntos claros de mejora.

## 13) Orden recomendado para estudiar tu codigo

1. `src/main.tsx`
2. `src/App.tsx`
3. `src/layouts/PrincipalLayout.tsx`
4. `src/components/header/Header.tsx`
5. `src/context/*`
6. `src/pages/Catalogo.tsx`
7. `src/pages/RHombre|RMujer|Gorros/*.tsx`
8. `src/pages/vistaDinamica/VistaDinamica.tsx`
9. `src/pages/carrito/CarritoDeCompras.tsx`
10. `src/pages/adminView/*`
11. `src/components/invoice/*`

## 14) Resumen rapido

Tu app funciona porque combina:
- Router para mover pantallas,
- Contextos para estado global,
- Layout con header persistente,
- Componentes de feature por dominio (catalogo, carrito, auth, admin, invoice),
- y guardias de rol para separar usuario comun vs administrador en modo simulacion.
