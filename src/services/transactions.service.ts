import { apiClient, TRANSACTIONS_API } from "../config/api";
import type { ApiCuentaBancaria, ApiCuentasUsuario, ApiTipoCuenta } from "../types/api.types";

interface ApiEnvelope<T> {
  message: string;
  data?: T;
  cuentas?: ApiCuentaBancaria[];
  usuario?: unknown;
}

interface CreateAccountPayload {
  numero_de_cuenta: string;
  tipo_de_cuenta: ApiTipoCuenta;
  banco: string;
  id_user: number;
}

interface UpdateAccountPayload {
  numero_de_cuenta?: string;
  tipo_de_cuenta?: ApiTipoCuenta;
  banco?: string;
}

export const transactionsService = {
  async getAccountsByUser(userId: number): Promise<ApiCuentaBancaria[]> {
    const { data } = await apiClient.get<ApiEnvelope<ApiCuentasUsuario>>(
      `${TRANSACTIONS_API}/obtenerCuentas/${userId}`
    );

    if (data.data?.cuentas) {
      return data.data.cuentas;
    }

    return data.cuentas ?? [];
  },

  async createAccount(payload: CreateAccountPayload): Promise<ApiCuentaBancaria> {
    const { data } = await apiClient.post<ApiEnvelope<ApiCuentaBancaria>>(
      `${TRANSACTIONS_API}/crearCuenta`,
      payload
    );

    if (data.data) {
      return data.data;
    }

    return {
      id: 0,
      ...payload,
    };
  },

  async updateAccount(
    userId: number,
    accountId: number,
    payload: UpdateAccountPayload
  ): Promise<void> {
    await apiClient.patch(
      `${TRANSACTIONS_API}/actualizarCuenta/${userId}/${accountId}`,
      payload
    );
  },

  async deleteAccount(userId: number, accountId: number): Promise<void> {
    await apiClient.delete(
      `${TRANSACTIONS_API}/eliminarCuenta/${accountId}/${userId}`
    );
  },
};
