# Documentacion del modulo Invoice (actualizada)

## Objetivo
Mostrar factura en modal al finalizar compra y permitir descarga en PDF.

Carpeta:
- `src/components/invoice`

## Flujo actual
1. En `CarritoDeCompras.tsx`, usuario pulsa `Finalizar compra`.
2. Si el carrito esta vacio, boton deshabilitado y no se abre modal.
3. Si hay items, se abre `InvoiceModal`.
4. `InvoiceModal` reutiliza `Modal` y monta `Invoice`.
5. `Invoice` arma datos de factura y renderiza:
   - `InvoiceMainModal`
   - `InvoiceFooterModal`
6. `InvoiceFooterModal` permite descargar PDF con `PDFDownloadLink` usando `InvoicePDF`.

## Archivos y rol
- `InvoiceModal.tsx`: wrapper de apertura/cierre.
- `Invoice.tsx`: contenido principal de la factura.
- `InvoiceMainModal.tsx`: detalle de productos/totales.
- `InvoiceFooterModal.tsx`: acciones de descargar/cerrar.
- `src/pdf/InvoicePDF.tsx`: plantilla PDF.
- `src/utils/invoice.ts`: utilidades de fecha y totales.

## Estado actual
- Funcional para modal y descarga PDF.
- Integrado al flujo de carrito para apertura/cierre.

Limitacion vigente:
- `Invoice.tsx` usa `products` mock local, no items reales del carrito.

## Pendientes
1. Recibir productos reales desde `ShopContext` en `Invoice`.
2. Conectar creacion de factura en backend (`orderService.createInvoice`) dentro del flujo de compra.
3. Sincronizar campos de factura modal/PDF con contrato de API.
