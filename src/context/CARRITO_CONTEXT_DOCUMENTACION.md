# Documentacion del contexto de carrito (actualizada)

## Objetivo
Centralizar estado del carrito para agregar, modificar y eliminar productos con totales en tiempo real.

## Archivos
- `src/context/shopContext.ts`
- `src/context/ShopProvide.tsx`
- `src/pages/vistaDinamica/VistaDinamica.tsx`
- `src/pages/carrito/CarritoDeCompras.tsx`
- `src/components/header/Header.tsx`

## Flujo general
1. `src/main.tsx` monta `ShopProvider` a nivel global.
2. `ShopProvide.tsx` mantiene `cart` y funciones de negocio.
3. `VistaDinamica` agrega productos con `addToCart`.
4. `Header` lee `totalItems` para contador.
5. `CarritoDeCompras` gestiona cantidades, elimina items y muestra resumen.

## Orden real de providers en `main.tsx`
1. `ThemeContextProvider`
2. `AuthProvider`
3. `ShopProvider`
4. `BrowserRouter`
5. `App`

## API del contexto
- `cart`
- `addToCart`
- `removeFromCart`
- `increaseQuantity`
- `decreaseQuantity`
- `clearCart`
- `total`
- `totalItems`

## Reglas actuales
- `addToCart` fusiona items si coinciden `productId` y `personalized`.
- `decreaseQuantity` elimina item cuando llega a `0`.
- `total` y `totalItems` se recalculan en cada render.

## Estado actual
- Contexto funcional y estable para flujo de compra frontend.

## Pendientes
1. Persistencia de carrito por usuario/sesion (backend o storage).
2. Sincronizacion directa con modulo invoice para evitar datos mock.
