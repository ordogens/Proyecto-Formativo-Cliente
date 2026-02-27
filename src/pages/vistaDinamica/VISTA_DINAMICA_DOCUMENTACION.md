# Documentacion de la Vista Dinamica

## Objetivo
La vista dinamica muestra el detalle de un producto segun su `id` en la URL y permite:
- ver informacion completa del producto,
- agregarlo al carrito global,
- navegar a personalizacion con IA.

Archivo principal:
- `src/pages/vistaDinamica/VistaDinamica.tsx`

---

## Flujo completo (en orden)
1. En `App.tsx` se declara la ruta dinamica:
   - `/vista-dinamica/:id` -> `VistaDinamica`.
2. Un producto se abre desde `ProductCard`:
   - `navigate(/vista-dinamica/${producto.id})`.
3. `VistaDinamica` lee el parametro con `useParams()`.
4. Busca el producto en `src/data/Productos.ts` usando ese `id`.
5. Si existe, renderiza imagen, nombre, precio, descripcion y estado.
6. Si no existe, muestra "Producto no encontrado".
7. Al hacer clic en "Agregar al carrito", llama `addToCart()` del `ShopContext`.
8. Se muestra `BadgeAlert` por 1.8 segundos con `useEffect + setTimeout`.

---

## Componentes y archivos que lo hacen posible

## 1) Ruta dinamica
- Archivo: `src/App.tsx`
- Rol:
  - Conecta URL con componente.
  - Sin esta ruta, `VistaDinamica` nunca se monta.

## 2) Disparador de navegacion
- Archivo: `src/components/ui/cards/ProductCard.tsx`
- Rol:
  - Redirige al detalle con `useNavigate`.
  - Construye la ruta con el id del producto.

## 3) Fuente de datos de productos
- Archivo: `src/data/Productos.ts`
- Rol:
  - Contiene arreglo `productos`.
  - Define el tipo `Producto`.
  - `VistaDinamica` consulta aqui para obtener el item a renderizar.

## 4) Componente principal de detalle
- Archivo: `src/pages/vistaDinamica/VistaDinamica.tsx`
- Rol:
  - Orquesta toda la vista.
  - Usa hooks de React y Router.
  - Consume el contexto del carrito.
  - Controla estados locales de UI (alerta temporal).

## 5) Contexto de carrito
- Archivo: `src/context/shopContext.ts`
- Archivo: `src/context/ShopProvide.tsx`
- Rol:
  - Expone `addToCart`.
  - Permite que desde esta vista se actualice el carrito global.

## 6) Componentes de soporte visual
- Archivo: `src/components/ui/BadgeAlert.tsx`
  - Muestra mensaje temporal de exito.
- Archivo: `src/components/icons/Stars.tsx`
  - Icono del boton de personalizacion IA.
- Libreria: `lucide-react`
  - Icono `ShoppingBag` del boton de agregar al carrito.

---

## Hooks usados y para que sirven
- `useParams()`:
  - Obtiene `id` desde la URL.
- `useContext(ShopContext)`:
  - Accede a `addToCart`.
- `useNavigate()`:
  - Navega a `/personalizacion`.
- `useState(addedMessageVisible)`:
  - Controla si se ve la alerta de producto agregado.
- `useEffect()`:
  - Ejecuta un temporizador para ocultar la alerta automaticamente.

---

## Logica clave del componente

## 1) Guard del contexto
Si `shop` no existe, lanza error:
- protege contra uso fuera de `<ShopProvider>`.

## 2) Busqueda del producto
Hace `productos.find((p) => p.id === Number(id))`.
- Convierte `id` (string) a numero.
- Si no encuentra, renderiza fallback.

## 3) Agregar al carrito
`handleAddToCart()` envia este objeto:
- `cartId` unico (`crypto.randomUUID()`),
- `productId`, `name`, `price`, `image`,
- `quantity: 1`,
- `personalized: false`.

Luego activa la alerta temporal.

## 4) Alerta temporal
Cuando `addedMessageVisible` es `true`:
- se inicia `setTimeout` de 1800 ms,
- despues vuelve a `false`,
- cleanup limpia el timer si el componente se desmonta.

---

## Guia de estudio recomendada
1. Lee `App.tsx` para entender la ruta `:id`.
2. Lee `ProductCard.tsx` para ver quien manda a la vista.
3. Lee `Productos.ts` para entender la estructura de datos.
4. Lee `VistaDinamica.tsx` de arriba hacia abajo identificando:
   - hooks,
   - validaciones,
   - handlers,
   - JSX final.
5. Lee `ShopProvide.tsx` para entender que hace realmente `addToCart`.
6. Prueba manual:
   - abre dos productos,
   - agrega ambos,
   - revisa contador en Header y carrito final.

---

## Checklist rapido para documentar futuros componentes
- Que ruta lo monta?
- Que componente lo dispara?
- De donde salen los datos?
- Que estado local maneja?
- Que contexto consume?
- Que acciones del usuario dispara?
- Cuales son sus casos de error/fallback?

Si completas ese checklist para cada vista, tu documentacion queda clara y mantenible.
