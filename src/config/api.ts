import axios from "axios";

const AUTH_TOKEN_KEY = "auth_access_token";

/**
 * URL base del gateway. Todos los servicios se consumen a través de este punto único.
 * Configurable mediante variable de entorno VITE_GATEWAY_URL.
 */
export const GATEWAY_URL =
  import.meta.env.VITE_GATEWAY_URL ?? "http://localhost:1010";

/** URLs por dominio — cada una apunta a un prefijo del gateway */
export const AUTH_API = `${GATEWAY_URL}/api/usuarios/v1/usuarios`;
export const CATALOG_API = `${GATEWAY_URL}/api/catalogo`;
export const ADMIN_API = `${GATEWAY_URL}/api/admin`;
export const IA_API = `${GATEWAY_URL}/api/agente-ia`;
export const IA_GENERATE_API = `${GATEWAY_URL}/api/generate`;
export const TRANSACTIONS_API = `${GATEWAY_URL}/api/transacciones`;
export const NOTIFICATIONS_API = `${GATEWAY_URL}/api/notificaciones`;

/**
 * Instancia axios compartida con interceptor de token.
 * Usada por todos los servicios que necesitan autenticación.
 */
export const apiClient = axios.create({
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
