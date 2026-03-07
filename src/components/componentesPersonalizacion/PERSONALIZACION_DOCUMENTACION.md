# Documentacion del modulo de Personalizacion (actualizada)

Proyecto: `Proyecto-Formativo-Cliente`
Ubicacion: `src/pages/Personalizacion.tsx` y `src/components/componentesPersonalizacion/*`

## Objetivo del modulo
Permitir personalizar imagen con IA y exportar resultado.

Incluye:
1. Subida de imagen por archivo o drag & drop.
2. Prompt de personalizacion.
3. Seleccion de aspect ratio (`1:1`, `16:9`, `9:16`).
4. Ajuste de creatividad (`0-100`).
5. Generacion contra API IA.
6. Descargar/compartir resultado.

## Archivos principales
- `src/pages/Personalizacion.tsx`
- `src/components/componentesPersonalizacion/CustomizationCanvas.tsx`
- `src/components/componentesPersonalizacion/CustomizationForm.tsx`
- `src/services/nanoService.ts`
- `src/config/api.ts`

## Flujo real
1. Usuario carga imagen en `CustomizationCanvas`.
2. `Personalizacion` guarda imagen/prompt/opciones en estado local.
3. `handleGenerate` llama `nanoService.generateImage`.
4. `nanoService` hace `POST` a `IA_GENERATE_API` (gateway).
5. Si responde bien, UI reemplaza imagen con `generatedImage`.
6. Usuario puede descargar o compartir el resultado.

## Endpoint actual
- Se usa `IA_GENERATE_API` definido en `src/config/api.ts`.
- Ya no depende de URL fija hardcodeada en el servicio.

## Estado actual
- Feature funcional de extremo a extremo en frontend.
- Integrado con endpoint IA via gateway.

## Pendientes
1. Manejo de errores visible en UI (hoy solo `console.error`).
2. Definir validaciones adicionales de peso/formato de imagen.
3. Agregar tracking de intentos y tiempos de generacion.
