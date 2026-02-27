# Documentacion del Modulo Invoice

## Objetivo
El modulo `invoice` permite mostrar una factura en un modal al finalizar compra y descargarla como PDF.

Carpeta principal:
- `src/components/invoice`

---

## Flujo general (en orden)
1. En el carrito (`CarritoDeCompras.tsx`) el usuario pulsa `Finalizar compra`.
2. Se abre `InvoiceModal`.
3. `InvoiceModal` reutiliza el componente base `Modal` y renderiza `Invoice`.
4. `Invoice` prepara fechas, productos y totales.
5. `InvoiceMainModal` muestra el detalle de productos y resumen numerico.
6. `InvoiceFooterModal` muestra datos de contacto y acciones.
7. En `InvoiceFooterModal`, `PDFDownloadLink` construye el archivo usando `InvoicePDF`.
8. El usuario descarga `factura-compra.pdf`.

---

## Archivos de la carpeta invoice y su rol

## 1) `InvoiceModal.tsx`
- Responsabilidad:
  - Es el contenedor de apertura/cierre.
  - Recibe `isOpen` y `onClose`.
  - Renderiza:
    - `Modal` (estructura visual del popup)
    - `Invoice` (contenido de la factura)

Punto clave:
- No tiene logica de negocio de factura; solo orquesta el modal.

## 2) `Invoice.tsx`
- Responsabilidad:
  - Es el nucleo del contenido de factura.
  - Define datos base (productos de ejemplo).
  - Calcula:
    - fecha de emision (`issueDate`),
    - fecha de vencimiento (`dueDate = +30 dias`),
    - totales con `getInvoiceTotals`.
  - Renderiza:
    - encabezado legal/comercial,
    - `InvoiceMainModal`,
    - `InvoiceFooterModal`.

Dependencias directas:
- `src/utils/invoice.ts` (`formatDate`, `getInvoiceTotals`)
- `src/types/invoice.ts` (`Product`)

## 3) `InvoiceMainModal.tsx`
- Responsabilidad:
  - Pintar el cuerpo de la factura:
    - lista de productos (`id`, `name`, `price`),
    - total de productos,
    - valor total.

Punto clave:
- Es componente presentacional; recibe todo por props.

## 4) `InvoiceFooterModal.tsx`
- Responsabilidad:
  - Mostrar texto final e informacion de contacto.
  - Exponer acciones:
    - `Descargar` PDF (con `PDFDownloadLink`),
    - `Volver` (cerrar modal con `onClose`).

Dependencias directas:
- `@react-pdf/renderer` (`PDFDownloadLink`)
- `src/pdf/InvoicePDF.tsx` (plantilla PDF real)
- `src/utils/invoice.ts` (formato de fechas)

---

## Archivos relacionados (fuera de la carpeta invoice)

## 1) `src/pdf/InvoicePDF.tsx`
- Define la plantilla del PDF con `@react-pdf/renderer`:
  - `Document`, `Page`, `Text`, `View`.
- Recibe datos listos y genera la version exportable.

## 2) `src/types/invoice.ts`
- Define el contrato `Product`:
  - `id`, `name`, `price`.

## 3) `src/utils/invoice.ts`
- `formatDate(date)`: convierte fecha a `dd/mm/yyyy`.
- `getInvoiceTotals(products)`: calcula:
  - `totalProducts`
  - `totalValor`

## 4) `src/components/modals/Modal.tsx`
- Componente modal reutilizable:
  - overlay,
  - cierre por click externo,
  - boton `X`,
  - render de `children`.

## 5) `src/pages/carrito/CarritoDeCompras.tsx`
- Punto donde se integra invoice en el flujo real de compra:
  - maneja estado `isInvoiceOpen`,
  - monta `InvoiceModal`.

---

## Flujo de datos resumido
1. Carrito abre modal.
2. `Invoice` crea datos de factura.
3. `InvoiceMainModal` consume y muestra tabla + totales.
4. `InvoiceFooterModal` consume mismos datos para descargar.
5. `InvoicePDF` recibe props y genera el PDF final.

---

## Guia de estudio recomendada (orden)
1. `CarritoDeCompras.tsx`: entiende cuando y por que se abre la factura.
2. `InvoiceModal.tsx`: entiende wrapper modal + contenido.
3. `Invoice.tsx`: identifica origen de datos y calculos.
4. `InvoiceMainModal.tsx`: revisa estructura visual del detalle.
5. `InvoiceFooterModal.tsx`: revisa botones y descarga PDF.
6. `InvoicePDF.tsx`: revisa documento exportable.
7. `utils/invoice.ts` y `types/invoice.ts`: cierra la parte de reglas y tipado.

---

## Checklist para mantener este modulo
- Si cambias campos de producto, actualiza:
  - `types/invoice.ts`,
  - `InvoiceMainModal.tsx`,
  - `InvoicePDF.tsx`.
- Si cambias formato de fecha, centraliza cambio en `utils/invoice.ts`.
- Si quieres usar productos reales del carrito:
  - pasa `cart` desde `CarritoDeCompras` hacia `InvoiceModal`/`Invoice`.
- Si cambias estilo del popup, hazlo en `Modal.tsx` para impactar todos los modales.

---

## Nota tecnica importante
Actualmente `Invoice.tsx` usa una lista fija `products` (mock local).  
Eso significa que la factura no refleja aun los productos reales del carrito; para produccion, conviene conectar este modulo al estado real de `ShopContext`.
