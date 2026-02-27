# Documentacion de Cambio de Tema (Light/Dark)

## Objetivo
Implementar un sistema de tema global (claro/oscuro) controlado por contexto de React, persistido en `localStorage`, y aplicado con utilidades `dark:` de Tailwind CSS.

## Flujo General
1. El usuario pulsa el boton de tema (desktop en `Header` o mobile en `DropMenu`).
2. Se ejecuta `toggleTheme()` del contexto.
3. `ThemeProvider` actualiza el estado `theme`.
4. Un `useEffect` en `ThemeProvider` agrega o quita la clase `dark` en `document.documentElement` (`<html>`).
5. Los componentes con clases `dark:*` cambian su apariencia automaticamente.

---

## Componentes y Archivos Clave

## 1) Contexto de tema
- Archivo: `src/context/ThemeContext.tsx`
- Responsabilidad:
  - Define tipo `Theme = "light" | "dark"`.
  - Define interfaz `ThemeContextType`.
  - Crea y exporta `ThemeContext`.
  - Expone hook `useThemeContext()` para consumir el estado global.

## 2) Provider de tema
- Archivo: `src/context/ThemeProvider.tsx`
- Responsabilidad:
  - Inicializa tema desde `localStorage` o preferencia del sistema (`prefers-color-scheme`).
  - Expone `theme`, `setTheme` y `toggleTheme`.
  - Sincroniza la clase `dark` en `<html>`.
  - Persiste el tema en `localStorage`.

## 3) Punto de montaje global
- Archivo: `src/main.tsx`
- Responsabilidad:
  - Envuelve la app con `<ThemeContextProvider>`.
  - Esto habilita el tema para toda la aplicacion.

## 4) Disparadores del cambio de tema
- Archivo: `src/components/header/Header.tsx`
  - Boton desktop de cambio de tema.
  - Usa `useThemeContext()` y `toggleTheme()`.
- Archivo: `src/components/header/DropMenu.tsx`
  - Opcion `Theme` en menu hamburguesa mobile.
  - Usa `useThemeContext()` y `toggleTheme()`.

---

## Configuracion de Tailwind para dark mode por clase
- Archivo: `src/index.css`
- Configuracion usada:

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
```

Esto hace que clases como `dark:bg-gray-900` respondan a la clase `dark` en `<html>`.

---

## Componentes donde se aplico Dark Theme

## Home
- `src/components/homeComponents/HomeP2.tsx`
  - Fondo y textos adaptados a dark mode.
- `src/components/homeComponents/HomeP3.tsx`
  - Fondo, tarjetas, encabezado y textos adaptados.

## Header
- `src/components/header/Header.tsx`
  - Header adaptado visualmente a dark mode.
  - Boton desktop de tema.
- `src/components/header/DropMenu.tsx`
  - Boton/opcion mobile de tema funcional.

## Catalogo
- `src/pages/Catalogo.tsx`
  - Fondo y textos adaptados.
  - Se removio `h-full` para evitar que en mobile el fondo dark solo cubriera parte del contenido.

## Vistas de productos (Hombre/Mujer/Gorros)
- `src/layouts/ProductsLayout.tsx`
  - Fondo dark global de la seccion.
  - Textos en dark configurados en `gray-300` (no blanco).
- `src/components/ui/cards/ProductCard.tsx`
  - Tarjetas y textos adaptados a dark.

## Vista dinamica de producto
- `src/pages/vistaDinamica/VistaDinamica.tsx`
  - Fondo, bloques y textos adaptados.
  - En dark: textos principales en `gray-300`.

## Carrito
- `src/pages/carrito/CarritoDeCompras.tsx`
  - Fondo, cards, resumen, bordes y textos adaptados.
  - En dark: textos en `gray-300`.

## Login y modal
- `src/components/modals/Modal.tsx`
  - Fondo del modal y overlay adaptados.
- `src/components/auth/AuthForm.tsx`
  - Titulo y textos auxiliares adaptados.
- `src/components/ui/inputs/CustomInput.tsx`
  - Inputs (label, fondo, borde, texto, placeholder) adaptados.
- `src/components/ui/buttons/SocialBotton.tsx`
  - Botones sociales adaptados.

---

## Convencion de color en modo oscuro usada
- Requisito aplicado: evitar texto blanco puro en muchas vistas.
- Valor usado para texto principal en dark: `dark:text-gray-300`.
- Fondos dark frecuentes:
  - `dark:bg-gray-900` para contenedores principales.
  - `dark:bg-gray-800` para tarjetas/bloques secundarios.

---

## Notas de mantenimiento
1. Si un componente no cambia de tema, verificar que tenga clases `dark:*`.
2. Si `dark:*` no responde, verificar:
   - `ThemeContextProvider` montado en `main.tsx`.
   - Clase `dark` en `<html>` al hacer toggle.
   - `@custom-variant dark` en `src/index.css`.
3. Evitar alturas fijas (`h-full`, `h-screen`) cuando el contenido sobrepasa la pantalla en mobile, porque puede aparentar cortes visuales del fondo.

