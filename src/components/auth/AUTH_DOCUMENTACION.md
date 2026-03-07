# Documentacion de autenticacion y roles (actualizada)

Proyecto: `Proyecto-Formativo-Cliente`
Modulo: `src/components/auth` + `src/context/AuthContext.tsx`

## Objetivo actual
Gestionar autenticacion de usuario con backend y control de acceso por rol.

Flujos soportados:
- Login con email/password
- Registro
- Login con Google (Firebase + backend)
- Logout

## Archivos clave
- `src/context/AuthContext.tsx`
- `src/services/auth.service.ts`
- `src/components/auth/AuthForm.tsx`
- `src/components/auth/AuthModal.tsx`
- `src/components/modals/Modal.tsx`
- `src/types/auth.types.ts`
- `src/App.tsx` (`RequireAdmin`)

## Flujo real
1. Usuario abre modal desde header.
2. `AuthForm` ejecuta login, register o Google.
3. `auth.service` llama API de usuarios.
4. Si hay token en respuesta, se guarda en `auth_access_token`.
5. `AuthContext` guarda usuario en memoria y en `auth_user_session`.
6. `RequireAdmin` habilita `/admin-view` solo si `user.role === "admin"`.

## Endpoints usados
Base definida en `AUTH_API` (`src/config/api.ts`):
- `POST /login`
- `POST /` (registro)
- `POST /login/google`
- `GET /me`
- `POST /logout` (fallback `/cerrar-sesion`)

## Comportamientos relevantes
- Normaliza email a minusculas.
- Intenta login automatico tras timeout de registro (`ECONNABORTED`).
- Extrae mensajes de error de diferentes formatos de backend.
- Mapea rol a `admin` o `user`.

## Estado actual
- Modulo funcional para autenticacion tradicional y Google.
- Persistencia de sesion y token activa.
- Control de ruta admin funcional.

## Pendientes recomendados
1. Revisar estrategia de seguridad del token en cliente.
2. Unificar contrato de respuestas backend para simplificar parseo.
3. Incorporar recuperacion de password si aplica al alcance.
