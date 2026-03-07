# Documentacion de la Vista Dinamica (actualizada)

## Objetivo
Mostrar detalle de producto por `id` en URL y permitir agregar al carrito o navegar a personalizacion.

Archivo principal:
- `src/pages/vistaDinamica/VistaDinamica.tsx`

## Flujo real actual
1. Ruta en `src/App.tsx`:
   - `/vista-dinamica/:id` -> `VistaDinamica`.
2. `ProductCard` navega al detalle con el id.
3. `VistaDinamica` obtiene `id` con `useParams`.
4. Carga producto real desde API:
   - `catalogService.getProductById(id)`
   - `catalogService.getCategories()`
5. Convierte datos API a UI con `toUiProducto`.
6. Renderiza estados:
   - `Cargando producto...`
   - `Producto no encontrado`
   - detalle completo
7. En `Agregar al carrito`, llama `addToCart` del `ShopContext`.
8. Muestra alerta temporal (`BadgeAlert`) durante 1.8 segundos.

## Dependencias clave
- `src/services/catalog.service.ts`
- `src/utils/catalogProducts.ts`
- `src/context/shopContext.ts`
- `src/context/ShopProvide.tsx`
- `src/components/ui/BadgeAlert.tsx`

## Hooks usados
- `useParams`: leer `id`.
- `useEffect`: cargar producto y controlar timeout de alerta.
- `useState`: producto, loading, imagen seleccionada, alerta.
- `useContext(ShopContext)`: `addToCart`.
- `useNavigate`: ir a `/personalizacion`.

## Estado actual
- Vista conectada a backend de catalogo.
- Fallbacks de carga/no encontrado implementados.
- Integracion con carrito global funcional.

## Pendientes
1. Conectar estado real de stock/personalizable (hoy son flags locales).
2. Corregir typo visual en mensaje de alerta (`agregaddo`).
