# Documentacion del Contexto de Carrito de Compras

## Objetivo
Centralizar el estado global del carrito para que cualquier componente pueda:
- agregar productos,
- modificar cantidades,
- eliminar productos,
- limpiar el carrito,
- y leer totales en tiempo real.

---

## Flujo General (en orden)
1. `src/main.tsx` monta `<ShopProvider>` alrededor de la app.
2. `src/context/shopContext.ts` define el contrato del contexto (`ShopContextType`).
3. `src/context/ShopProvide.tsx` implementa la logica real del carrito con `useState`.
4. `src/components/header/Header.tsx` consume `totalItems` para mostrar el contador en el icono de bolsa.
5. `src/pages/vistaDinamica/VistaDinamica.tsx` usa `addToCart()` para agregar productos.
6. `src/pages/carrito/CarritoDeCompras.tsx` consume `cart`, `total` y funciones de actualizacion para renderizar y gestionar el carrito.

---

## 1) Definicion del contexto
- Archivo: `src/context/shopContext.ts`
- Responsabilidad:
  - Define la interfaz `ShopContextType`.
  - Declara las propiedades que cualquier consumidor puede usar:
    - `cart`
    - `addToCart`
    - `removeFromCart`
    - `increaseQuantity`
    - `decreaseQuantity`
    - `clearCart`
    - `total`
    - `totalItems`
  - Crea `ShopContext` con valor inicial `undefined` para forzar uso dentro del provider.

Nota: el tipo de producto en carrito viene de `src/data/carrito.ts` (`CartItem`).

---

## 2) Implementacion del provider
- Archivo: `src/context/ShopProvide.tsx`
- Responsabilidad:
  - Mantiene el estado `cart` con `useState<CartItem[]>([])`.
  - Implementa toda la logica de negocio:
    - `addToCart(item)`:
      - Busca si ya existe un item con el mismo `productId` y mismo valor de `personalized`.
      - Si existe, suma cantidades.
      - Si no existe, agrega una nueva entrada al arreglo.
    - `removeFromCart(cartId)`:
      - Elimina un item por su `cartId`.
    - `increaseQuantity(cartId)`:
      - Incrementa la cantidad del item seleccionado.
    - `decreaseQuantity(cartId)`:
      - Decrementa la cantidad y elimina el item si queda en `0`.
    - `clearCart()`:
      - Vacia completamente el carrito.
  - Calcula derivados:
    - `total`: suma de `price * quantity`.
    - `totalItems`: suma de todas las cantidades.
  - Expone todo por `ShopContext.Provider`.

---

## 3) Montaje global del contexto
- Archivo: `src/main.tsx`
- Orden de wrappers:
  1. `<ThemeContextProvider>`
  2. `<ShopProvider>`
  3. `<BrowserRouter>`
  4. `<App />`

Que significa este orden:
- Todas las rutas y componentes dentro de `App` pueden leer y actualizar el carrito.
- Si un componente usa `ShopContext` fuera de este arbol, lanzara error.

---

## 4) Componente que refleja el estado global (Header)
- Archivo: `src/components/header/Header.tsx`
- Uso del contexto:
  - Lee `totalItems` y lo renombra a `cartCount`.
  - Muestra una burbuja roja en el icono de bolsa cuando `cartCount > 0`.

Resultado:
- El usuario ve en tiempo real cuantos articulos hay en el carrito desde cualquier vista.

---

## 5) Componente que agrega productos (VistaDinamica)
- Archivo: `src/pages/vistaDinamica/VistaDinamica.tsx`
- Uso del contexto:
  - Consume `addToCart`.
  - En `handleAddToCart()` crea el objeto `CartItem` y lo envia al contexto.
  - Genera `cartId` unico con `crypto.randomUUID()`.

Campos enviados:
- `cartId`
- `productId`
- `name`
- `price`
- `quantity`
- `image`
- `personalized`

Resultado:
- Al hacer clic en "Agregar al carrito", el estado global cambia y el `Header` se actualiza solo.

---

## 6) Componente que administra el carrito (CarritoDeCompras)
- Archivo: `src/pages/carrito/CarritoDeCompras.tsx`
- Uso del contexto:
  - Lee `cart`, `total`, `totalItems`.
  - Ejecuta `removeFromCart`, `increaseQuantity`, `decreaseQuantity`.

Comportamiento:
- Renderiza cada item del `cart`.
- Permite:
  - eliminar item,
  - aumentar cantidad,
  - disminuir cantidad.
- Muestra resumen:
  - subtotal (`total` del contexto),
  - envio fijo,
  - total final (`subtotal + envio`).

Resultado:
- Esta vista es la "fuente visual" principal del estado del carrito.

---

## Validaciones y errores esperados
En `Header`, `VistaDinamica` y `CarritoDeCompras` hay guardas como:
- `if (!shop) throw new Error(...)`

Esto protege contra uso incorrecto del contexto fuera de `<ShopProvider>`.

---

## Resumen tecnico
El carrito funciona por un patron simple y robusto:
1. contrato tipado (`shopContext.ts`),
2. estado y logica central (`ShopProvide.tsx`),
3. montaje global (`main.tsx`),
4. consumidores que leen/escriben estado (`Header`, `VistaDinamica`, `CarritoDeCompras`).

Con esta estructura, cualquier nuevo componente puede integrarse al carrito con `useContext(ShopContext)` y reutilizar la misma logica global.
