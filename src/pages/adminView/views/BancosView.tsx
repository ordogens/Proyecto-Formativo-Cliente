import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { Landmark, Pencil, Plus, Trash2 } from "lucide-react"
import { bankCatalogService } from "../../../services/bankCatalog.service"
import type { ApiBanco } from "../../../types/api.types"

const emptyBankName = ""

export const BancosView = () => {
  const [banks, setBanks] = useState<ApiBanco[]>([])
  const [bankName, setBankName] = useState(emptyBankName)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const loadBanks = async () => {
    try {
      setLoading(true)
      const data = await bankCatalogService.getBanks()
      setBanks(data)
    } catch (error) {
      console.error("Error cargando bancos:", error)
      setBanks([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadBanks()
  }, [])

  const resetForm = () => {
    setBankName(emptyBankName)
    setEditingId(null)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      if (editingId) {
        await bankCatalogService.updateBank(editingId, bankName)
      } else {
        await bankCatalogService.createBank(bankName)
      }

      await loadBanks()
      resetForm()

      await Swal.fire({
        title: editingId ? "Banco actualizado" : "Banco agregado",
        text: "El catalogo de bancos en la base de datos ya fue actualizado.",
        icon: "success",
        timer: 1800,
        showConfirmButton: false,
      })
    } catch (error) {
      await Swal.fire({
        title: "No se pudo guardar",
        text: error instanceof Error ? error.message : "Intenta nuevamente.",
        icon: "warning",
      })
    }
  }

  const handleEdit = (bank: ApiBanco) => {
    setEditingId(bank.id)
    setBankName(bank.nombre)
  }

  const handleDelete = async (bank: ApiBanco) => {
    const result = await Swal.fire({
      title: "Eliminar banco",
      text: `Se quitara ${bank.nombre} del catalogo de la base de datos.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#c65a4f",
    })

    if (!result.isConfirmed) return

    await bankCatalogService.deleteBank(bank.id)
    await loadBanks()

    if (editingId === bank.id) {
      resetForm()
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 bg-[#f3f0eb] p-1 dark:bg-gray-900 lg:grid-cols-[360px_1fr]">
      <section className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
        <div className="mb-6 flex items-start gap-3">
          <div className="rounded-2xl bg-red-50 p-3 text-red-500 dark:bg-red-500/10">
            <Landmark size={20} />
          </div>
          <div>
            <h2 className="font-serif text-2xl dark:text-gray-100">Gestion de bancos</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              El admin crea los bancos y luego los usuarios solo los eligen al registrar su cuenta.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Nombre del banco
            </label>
            <input
              type="text"
              value={bankName}
              onChange={(event) => setBankName(event.target.value)}
              placeholder="Ej: Bancolombia"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-red-400 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#c65a4f] px-4 py-3 text-white transition hover:opacity-90"
            >
              <Plus size={18} />
              <span>{editingId ? "Actualizar banco" : "Agregar banco"}</span>
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-gray-300 px-4 py-3 text-sm dark:border-gray-600 dark:text-gray-200"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="font-serif text-2xl dark:text-gray-100">Bancos disponibles</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {banks.length} banco{banks.length === 1 ? "" : "s"} visible{banks.length === 1 ? "" : "s"} para los usuarios.
            </p>
          </div>
        </div>

        {loading && (
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            Cargando bancos...
          </p>
        )}

        {!loading && banks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-500 dark:border-gray-600 dark:text-gray-400">
            Aun no has creado bancos para el flujo de pagos.
          </div>
        ) : !loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {banks.map((bank) => (
              <article
                key={bank.id}
                className="rounded-2xl border border-gray-200 p-4 dark:border-gray-700"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-xl bg-[#f7efe9] p-3 text-[#c65a4f] dark:bg-gray-700">
                    <Landmark size={18} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-red-400">
                      Banco
                    </p>
                    <h4 className="text-lg font-semibold dark:text-gray-100">{bank.nombre}</h4>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleEdit(bank)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm dark:border-gray-600 dark:text-gray-200"
                  >
                    <Pencil size={16} />
                    <span>Editar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleDelete(bank)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm text-white"
                  >
                    <Trash2 size={16} />
                    <span>Eliminar</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  )
}
