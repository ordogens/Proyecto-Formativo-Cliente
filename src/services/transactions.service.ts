import { apiClient, TRANSACTIONS_API } from "../config/api";
import type {
  ApiBanco,
  ApiCuentaBancaria,
  ApiCuentasUsuario,
  ApiTipoCuenta,
} from "../types/api.types";

interface ApiEnvelope<T> {
  message: string;
  data?: T;
  bancos?: ApiBanco[];
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

interface BankPayload {
  nombre: string;
}

export const transactionsService = {
  async getBanks(): Promise<ApiBanco[]> {
    const { data } = await apiClient.get<ApiEnvelope<ApiBanco[]>>(
      `${TRANSACTIONS_API}/obtenerBancos`
    );

    if (Array.isArray(data.data)) {
      return data.data;
    }

    return data.bancos ?? [];
  },

  async createBank(payload: BankPayload): Promise<ApiBanco> {
    const { data } = await apiClient.post<ApiEnvelope<ApiBanco>>(
      `${TRANSACTIONS_API}/crearBanco`,
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

  async updateBank(bankId: number, payload: BankPayload): Promise<ApiBanco> {
    const { data } = await apiClient.patch<ApiEnvelope<ApiBanco>>(
      `${TRANSACTIONS_API}/actualizarBanco/${bankId}`,
      payload
    );

    if (data.data) {
      return data.data;
    }

    return {
      id: bankId,
      ...payload,
    };
  },

  async deleteBank(bankId: number): Promise<void> {
    await apiClient.delete(`${TRANSACTIONS_API}/eliminarBanco/${bankId}`);
  },

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
