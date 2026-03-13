import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import { transactionsService } from "../services/transactions.service";
import type { ApiCuentaBancaria, ApiTipoCuenta } from "../types/api.types";

interface AccountForm {
  numero_de_cuenta: string;
  tipo_de_cuenta: ApiTipoCuenta;
  banco: string;
}

const emptyForm: AccountForm = {
  numero_de_cuenta: "",
  tipo_de_cuenta: "debito",
  banco: "",
};

export const MetodosPago = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<ApiCuentaBancaria[]>([]);
  const [form, setForm] = useState<AccountForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const userId = user?.id ? Number(user.id) : null;

  const loadAccounts = async () => {
    if (!userId || Number.isNaN(userId)) {
      setAccounts([]);
      return;
    }

    try {
      setLoading(true);
      const data = await transactionsService.getAccountsByUser(userId);
      setAccounts(data);
    } catch (error) {
      console.error("Error cargando cuentas:", error);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAccounts();
  }, [userId]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userId || Number.isNaN(userId)) {
      await Swal.fire("Inicia sesión", "Necesitas iniciar sesión para guardar métodos de pago.", "warning");
      return;
    }

    if (!form.numero_de_cuenta.trim() || !form.banco.trim()) {
      await Swal.fire("Faltan datos", "Completa todos los campos.", "warning");
      return;
    }

    try {
      if (editingId) {
        await transactionsService.updateAccount(userId, editingId, form);
      } else {
        await transactionsService.createAccount({
          ...form,
          id_user: userId,
        });
      }

      resetForm();
      await loadAccounts();
    } catch (error) {
      console.error("Error guardando cuenta:", error);
      await Swal.fire("Error", "No se pudo guardar la cuenta bancaria.", "error");
    }
  };

  const handleEdit = (account: ApiCuentaBancaria) => {
    setEditingId(account.id);
    setForm({
      numero_de_cuenta: account.numero_de_cuenta,
      tipo_de_cuenta: account.tipo_de_cuenta,
      banco: account.banco,
    });
  };

  const handleDelete = async (accountId: number) => {
    if (!userId || Number.isNaN(userId)) return;

    try {
      await transactionsService.deleteAccount(userId, accountId);
      await loadAccounts();
    } catch (error) {
      console.error("Error eliminando cuenta:", error);
      await Swal.fire("Error", "No se pudo eliminar la cuenta bancaria.", "error");
    }
  };

  return (
    <section className="min-h-screen bg-[#f5f3ef] dark:bg-gray-900 text-black dark:text-gray-300 transition-colors duration-300 px-4 py-8 md:px-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm h-fit">
          <h1 className="text-3xl font-serif mb-2">Metodos de pago</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Guarda tus cuentas bancarias para usarlas durante la compra.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Numero de cuenta"
              value={form.numero_de_cuenta}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, numero_de_cuenta: e.target.value }))
              }
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 py-3"
            />

            <select
              value={form.tipo_de_cuenta}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  tipo_de_cuenta: e.target.value as ApiTipoCuenta,
                }))
              }
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 py-3"
            >
              <option value="debito">Debito</option>
              <option value="credito">Credito</option>
            </select>

            <input
              type="text"
              placeholder="Banco"
              value={form.banco}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, banco: e.target.value }))
              }
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-4 py-3"
            />

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-[#c65a4f] text-white py-3 rounded-lg hover:opacity-90"
              >
                {editingId ? "Actualizar" : "Guardar"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-serif mb-4">Cuentas guardadas</h2>

          {loading && <p className="text-gray-500 dark:text-gray-400">Cargando...</p>}

          {!loading && accounts.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400">
              Aun no tienes cuentas registradas.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accounts.map((account) => (
              <article
                key={account.id}
                className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex flex-col gap-3"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-red-500">
                    {account.tipo_de_cuenta}
                  </p>
                  <h3 className="font-semibold text-lg">{account.banco}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Terminada en {account.numero_de_cuenta.slice(-4)}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleEdit(account)}
                    className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 py-2"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(account.id)}
                    className="flex-1 rounded-lg bg-red-500 text-white py-2"
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
