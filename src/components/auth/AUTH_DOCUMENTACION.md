# Documentacion de Autenticacion y Roles

Proyecto: `Proyecto-Formativo-Cliente`
Ubicacion del feature: `src/components/auth`

## 1) Objetivo actual

Este modulo implementa autenticacion con backend con:
- `login` por `email + contraseña`
- `register` sin seleccion de rol en frontend
- `logout`
- control de acceso al panel admin

## 2) Archivos clave

- `src/context/AuthContext.tsx`
  - expone `user`, `login`, `register`, `logout`
  - mantiene el estado de sesion del cliente usando datos de la API
  - persiste sesion de usuario en `auth_user_session`

- `src/types/auth.types.ts`
  - `Role`, `User`
  - `LoginCredentials`
  - `RegisterData`
  - `AuthActionResult`
  - `AuthContextType`

- `src/components/auth/AuthForm.tsx`
  - alterna login/registro
  - no hay selector de rol en login/registro
  - muestra alertas de error/exito segun respuesta del backend

- `src/components/auth/AuthModal.tsx`
  - wrapper de `Modal` + `AuthForm`

- `src/services/auth.service.ts`
  - cliente `axios` de autenticacion
  - endpoints:
    - `POST /v1/usuarios/login`
    - `POST /v1/usuarios`
    - `POST /v1/usuarios/logout` (con fallback `POST /v1/usuarios/cerrar-sesion`)
  - guarda token en `auth_access_token`

- `src/components/modals/Modal.tsx`
  - overlay reutilizable
  - bloqueo de scroll del fondo
  - cierre por click fuera, `X` y `Esc`
  - render en `createPortal(document.body)`

- `src/App.tsx`
  - `RequireAdmin` protege `/admin-view`

## 3) Flujo actual

1. Usuario abre login desde Header/DropMenu.
2. Se monta `AuthModal`.
3. `Modal` bloquea interaccion de fondo.
4. Login:
   - valida `email + contraseña`
   - autentica contra backend
   - toma `role` desde la respuesta del login (`ADMIN`/`USER`)
   - guarda token de sesion para requests autenticados
5. Registro:
   - valida `username + email + password`
   - frontend envia datos al backend sin rol
   - payload actual al backend: `nombre`, `email`, `contraseña`
   - backend define rol y devuelve datos de usuario
   - si hay timeout de red pero el usuario se crea, se intenta login automatico
6. UI se actualiza:
   - Login/Logout en header
   - badge de rol
   - opcion admin segun rol
7. Si el rol es `admin`, `RequireAdmin` permite `/admin-view`.

## 4) Estado de seguridad

- El control de identidad y rol depende del backend.
- El frontend no asigna roles ni crea admins.
- El backend crea el admin automaticamente segun su configuracion.
- El frontend usa token `Bearer` almacenado en cliente.

## 5) Contrato actual esperado (backend usuarios)

1. Login (`POST /v1/usuarios/login`):
   - body: `{ "email": string, "contraseña": string }`
2. Register (`POST /v1/usuarios`):
   - body: `{ "nombre": string, "email": string, "contraseña": string }`
3. Respuesta login:
   - incluye `token`, `role`, `usuario` (u objeto equivalente).
4. `RequireAdmin`:
   - usa `user.role` mapeado desde `role` de backend (`ADMIN -> admin`).
