# Documentacion de Autenticacion y Roles

Proyecto: `Proyecto-Formativo-Cliente`
Ubicacion del feature: `src/components/auth`

## 1) Objetivo actual

Este modulo implementa autenticacion local (sin backend) con:
- `login` por `email + password`
- `register` con seleccion de rol (`user` o `admin`)
- `logout`
- control de acceso al panel admin

## 2) Archivos clave

- `src/context/AuthContext.tsx`
  - expone `user`, `login`, `register`, `logout`
  - persiste:
    - cuentas locales: `auth_users_db`
    - sesion activa: `auth_user_session`

- `src/types/auth.types.ts`
  - `Role`, `User`
  - `LoginCredentials`
  - `RegisterData`
  - `AuthActionResult`
  - `AuthContextType`

- `src/components/auth/AuthForm.tsx`
  - alterna login/registro
  - en login NO hay selector de rol
  - en registro SI se elige rol de cuenta

- `src/components/auth/AuthModal.tsx`
  - wrapper de `Modal` + `AuthForm`

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
   - valida `email + password`
   - busca coincidencia en cuentas registradas locales
   - toma rol desde la cuenta encontrada
5. Registro:
   - valida `username + email + password`
   - usuario elige rol de cuenta (`user/admin`)
   - crea cuenta local y abre sesion
6. UI se actualiza:
   - Login/Logout en header
   - badge de rol
   - opcion admin segun rol
7. Si el rol es `admin`, `RequireAdmin` permite `/admin-view`.

## 4) Estado de seguridad

- Es un flujo de frontend local.
- No hay tokens reales ni validacion de servidor.
- Sirve para MVP y pruebas de UX/roles en cliente.

## 5) Siguiente paso para backend real

1. Crear `src/services/auth.service.ts`.
2. Mover `login/register/logout/me` a API.
3. Mantener `AuthContext` como capa de estado, no como almacenamiento de cuentas.
4. Mantener `RequireAdmin` basado en rol real del backend.
