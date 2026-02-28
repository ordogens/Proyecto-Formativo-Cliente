# Documentacion del Modulo de Personalizacion

Proyecto: `Proyecto-Formativo-Cliente`  
Ubicacion del modulo: `src/pages/Personalizacion.tsx` y `src/components/componentesPersonalizacion/*`

## 1) Objetivo del modulo

Este modulo permite:
1. Cargar una imagen desde el equipo.
2. Cargar una imagen arrastrandola (drag & drop).
3. Escribir un prompt de personalizacion.
4. Elegir `aspectRatio` (`1:1`, `16:9`, `9:16`).
5. Ajustar `creativity` con slider (`0-100`).
6. Generar una nueva imagen via backend (`nanoService`).
7. Descargar la imagen.
8. Compartir la imagen (con fallback a descarga si el navegador no soporta compartir archivos).

## 2) Componentes que lo hacen posible

### `src/pages/Personalizacion.tsx`
Componente contenedor/orquestador del feature.

Responsabilidades:
- Mantener el estado principal:
  - `prompt`
  - `image`
  - `isDragging`
  - `loading`
  - `aspectRatio`
  - `creativity`
- Enviar la solicitud al backend con `nanoService.generateImage`.
- Implementar acciones globales:
  - `handleDownloadImage`
  - `handleShareImage`
- Conectar `CustomizationCanvas` y `CustomizationForm` por props.

### `src/components/componentesPersonalizacion/CustomizationCanvas.tsx`
Componente visual para trabajar la imagen.

Responsabilidades:
- Subida por `input type="file"`.
- Subida por arrastre y suelta (`onDragOver`, `onDragLeave`, `onDrop`).
- Validar que el archivo sea imagen (`file.type.startsWith("image/")`).
- Previsualizar imagen cargada.
- Permitir eliminar imagen.
- Mostrar estado visual cuando se arrastra (`isDragging`).

### `src/components/componentesPersonalizacion/CustomizationForm.tsx`
Componente de controles del panel lateral.

Orden del panel (como en tu referencia):
1. Icono + botones `Descargar` / `Compartir`.
2. `SMART PROMPT`.
3. `ASPECT RATIO` (3 botones).
4. `CREATIVIDAD` (slider + porcentaje).
5. Boton `GENERAR IMAGEN`.

Responsabilidades:
- Captura de prompt.
- Seleccion de ratio.
- Ajuste de creatividad.
- Disparar generar imagen.
- Ejecutar descarga/compartir delegadas desde la pagina padre.

### `src/services/nanoService.ts`
Servicio de integracion HTTP.

Responsabilidades:
- Definir `GeneratePayload`:
  - `image`
  - `prompt`
  - `aspectRatio`
  - `creativity`
- Enviar `POST` a `http://localhost:3000/api/generate`.
- Retornar JSON de respuesta o lanzar error si falla.

## 3) Flujo completo de ejecucion

1. Usuario carga imagen (archivo o drag & drop).
2. `CustomizationCanvas` convierte archivo a `dataURL` con `FileReader`.
3. `setImage(...)` actualiza estado en `Personalizacion`.
4. Usuario escribe prompt, selecciona ratio y ajusta creatividad.
5. Al hacer click en `GENERAR IMAGEN`:
   - `handleGenerate` valida `image` y `prompt`.
   - Activa `loading`.
   - Llama `nanoService.generateImage({ image, prompt, aspectRatio, creativity })`.
   - Si responde bien, reemplaza `image` por `result.generatedImage`.
   - Limpia prompt.
   - Desactiva `loading`.
6. `Descargar` crea un enlace temporal y guarda `.png`.
7. `Compartir`:
   - Convierte dataURL a `File`.
   - Usa Web Share API si soporta `files`.
   - Si no soporta, descarga automaticamente.

## 4) Contrato de props entre componentes

## `CustomizationCanvas` recibe:
- `image: string | null`
- `setImage: Dispatch<SetStateAction<string | null>>`
- `isDragging: boolean`
- `setIsDragging: Dispatch<SetStateAction<boolean>>`

## `CustomizationForm` recibe:
- `image: string | null`
- `prompt: string`
- `setPrompt`
- `aspectRatio: string`
- `setAspectRatio`
- `creativity: number`
- `setCreativity`
- `onDownload: () => void`
- `onShare: () => void`
- `onGenerate: () => void`
- `loading: boolean`

## 5) Reglas de habilitacion actuales

- `Descargar` deshabilitado si no hay imagen.
- `Compartir` deshabilitado si no hay imagen.
- `GENERAR IMAGEN` deshabilitado si:
  - no hay imagen, o
  - prompt vacio, o
  - esta generando (`loading`).

## 6) Estructura final del modulo

- `src/pages/Personalizacion.tsx`
- `src/components/componentesPersonalizacion/CustomizationCanvas.tsx`
- `src/components/componentesPersonalizacion/CustomizationForm.tsx`
- `src/services/nanoService.ts`

## 7) Notas tecnicas importantes

1. `image` se maneja actualmente como `dataURL` en memoria.
2. Para compartir archivo, se usa `fetch(dataURL) -> blob -> File`.
3. Si el dispositivo/navegador no soporta `navigator.share` con `files`, se usa fallback a descarga.
4. El backend debe responder con una estructura que incluya `generatedImage`.

## 8) Resumen corto

Quedo implementado un flujo completo de personalizacion, modular y funcional, con subida de imagen (input + drag & drop), controles de generacion (`prompt`, `aspectRatio`, `creativity`), integracion API y acciones finales de `descargar/compartir`.
