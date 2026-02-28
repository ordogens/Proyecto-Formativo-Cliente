# Documentacion de Autenticacion y Roles

Proyecto: `Proyecto-Formativo-Cliente`  
Ubicacion del feature: `src/components/auth`

## 1) Objetivo actual
Este modulo implementa una autenticacion simulada para probar flujo de login, cierre de sesion y control de acceso por rol (`admin` vs `user`) sin backend real.

## 2) Archivos que hacen posible el flujo

- `src/context/AuthContext.tsx`
  - Estado global de sesion.
  - Expone `user`, `login(role)` y `logout()`.
  - Simula usuario con datos fake (`Admin Master` o `Usuario Normal`).
  - Persiste sesion en `localStorage` y la restaura al iniciar la app.

- `src/data/auth.types.ts`
  - Contratos de tipos:
    - `Role = "user" | "admin"`
    - `User`
    - `AuthContextType`

- `src/main.tsx`
  - Monta `AuthProvider` para que toda la app tenga acceso al contexto.

- `src/components/auth/AuthModal.tsx`
  - Envoltura del modal de autenticacion.
  - Renderiza `AuthForm` dentro de `Modal`.

- `src/components/auth/AuthForm.tsx`
  - Formulario de login/registro.
  - En login permite elegir rol simulado (`Usuario` o `Admin`).
  - Llama `login(selectedRole)` al enviar.
  - Ejecuta `onSuccess()` para cerrar modal.

- `src/components/modals/Modal.tsx`
  - Contenedor reutilizable: overlay, cierre con `X`, cierre al click fuera.

- `src/components/header/Header.tsx`
  - Abre/cierra modal de login.
  - Muestra `Login` o `Logout` segun `user`.
  - Habilita acceso visual al panel admin solo si `user.role === "admin"`.

- `src/components/header/DropMenu.tsx`
  - Version movil del flujo.
  - Muestra `Panel admin` solo para admin.
  - Muestra `Login` o `Logout` segun sesion.

- `src/App.tsx`
  - Protege ruta `/admin-view` con `RequireAdmin`.
  - Si no es admin, redirige a `/`.

- `src/pages/adminView/AdminView.tsx`
  - Vista de administracion.
  - Muestra nombre de usuario actual tomado de `AuthContext`.

## 3) Flujo completo (como funciona hoy)

1. Usuario abre modal desde `Header` o `DropMenu`.
2. `AuthForm` valida campos.
3. Si es login:
   - Toma rol seleccionado (`user` o `admin`).
   - Llama `login(role)` en `AuthContext`.
4. Se actualiza `user` global y la UI reacciona:
   - Boton cambia de `Login` a `Logout`.
   - Aparece badge de rol.
   - Se habilita opcion admin solo si corresponde.
   - La sesion queda guardada para mantener el rol al recargar.
5. Al navegar a `/admin-view`:
   - `RequireAdmin` permite acceso solo a `admin`.
   - `user` normal o no autenticado: redireccion a `/`.
6. `logout()` limpia `user` y revierte UI/permisos.
7. `AuthProvider` restaura automaticamente la sesion guardada al montar.

## 4) Estado y permisos actuales

- Persistencia: si hay, usando `localStorage` (`auth_user_session`).
- Seguridad real: no hay (es simulacion frontend).
- Autorizacion real: no hay validacion del servidor.
- Tokens: no se usan aun.

## 5) Como conectarlo mas adelante con backend (plan recomendado)

## Fase A: crear capa de API de auth

Crear archivo sugerido: `src/services/auth.service.ts`

Responsabilidades:
- `login(email, password)` -> llama backend y retorna usuario + tokens.
- `register(payload)` -> crea usuario.
- `refreshToken(refreshToken)` -> renueva access token.
- `logout()` -> opcionalmente invalida refresh token en backend.

## Fase B: ajustar modelo de datos

Actualizar `auth.types.ts` con datos reales:
- `User` con campos reales del backend (`id`, `name`, `email`, `role`).
- `AuthTokens` (`accessToken`, `refreshToken`, expiracion).
- `AuthSession` si quieres agrupar `user + tokens`.

## Fase C: reescribir login/logout del contexto

En `AuthContext`:
- Cambiar `login(role)` por `login(credentials)`.
- Dentro de `login`:
  - consumir `auth.service.login`.
  - guardar `user` en estado.
  - guardar tokens de forma segura (ver fase D).
- `logout` debe:
  - limpiar estado local.
  - limpiar almacenamiento.
  - redirigir si aplica.

## Fase D: estrategia de almacenamiento

Recomendacion de seguridad:
- Access token en memoria (estado/contexto).
- Refresh token en cookie `httpOnly` (manejada por backend).

Si aun no tienes cookie `httpOnly`:
- Guardar temporalmente en `localStorage` (menos seguro).
- Considerarlo solo como paso transitorio.

## Fase E: interceptores HTTP

Si usas `axios`:
- Request interceptor:
  - agrega `Authorization: Bearer <token>`.
- Response interceptor:
  - si 401 por expiracion, intenta refresh una sola vez.
  - reintenta request original.
  - si falla refresh, ejecutar `logout`.

## Fase F: proteccion de rutas escalable

Generalizar guardias:
- `RequireAuth` para usuarios autenticados.
- `RequireRole({ roles: [...] })` para permisos por rol.

Asi podras proteger muchas rutas sin repetir logica.

## Fase G: mapeo de endpoints sugeridos

- `POST /auth/login`
  - input: `{ email, password }`
  - output: `{ user, accessToken, refreshToken }`

- `POST /auth/register`
  - input: `{ name, email, password }`
  - output: `{ user }` o `{ message }`

- `POST /auth/refresh`
  - input: cookie/refresh token
  - output: `{ accessToken }`

- `POST /auth/logout`
  - invalida refresh token (si aplica)

- `GET /auth/me`
  - retorna usuario autenticado para restaurar sesion al iniciar app

## Fase H: restauracion de sesion al iniciar

En `AuthProvider`, al montar:
1. intentar `GET /auth/me` (o usar token persistido).
2. si responde ok, setear `user`.
3. si falla, dejar sesion en null.
4. exponer `isLoadingAuth` para evitar flicker en rutas protegidas.

## 6) Cambios puntuales que tendras que hacer

- `AuthForm.tsx`
  - reemplazar simulacion por consumo real del backend.
  - mantener validacion de UI, mover reglas duras al backend.

- `AuthContext.tsx`
  - convertir `login` a async.
  - manejar estados `loading` y `error`.

- `App.tsx`
  - mantener `RequireAdmin`, pero basarlo en usuario real.
  - opcional: crear `RequireAuth` para otras rutas privadas.

- `Header.tsx` y `DropMenu.tsx`
  - mantener comportamiento actual de UI.
  - consumir `user` real y cerrar sesion con endpoint si aplica.

## 7) Checklist de integracion backend

- Backend retorna `role` en login y en `me`.
- Front valida `role` antes de mostrar/permitir panel admin.
- Rutas protegidas siguen redirigiendo sin sesion.
- Logout limpia estado + almacenamiento.
- Recargar pagina no rompe sesion si hay mecanismo de restauracion.
- Si token expira, refresh funciona o cierra sesion de forma controlada.

## 8) Riesgos comunes al integrar

- Confiar solo en ocultar botones en frontend.
  - Solucion: backend debe validar rol en endpoints admin.

- Guardar tokens sensibles en `localStorage` permanentemente.
  - Solucion: migrar a cookie `httpOnly` cuando sea posible.

- No manejar estado de carga inicial (`me`/refresh).
  - Solucion: usar `isLoadingAuth` y bloquear guards hasta resolver.

## 9) Resumen ejecutivo

Hoy tienes un flujo funcional para simulacion de roles y proteccion basica de ruta admin en frontend.  
Para pasar a produccion, el paso clave es mover autenticacion/autorizacion real al backend y dejar el frontend como consumidor de sesion (tokens, `me`, guards por rol, refresh y logout controlado).
