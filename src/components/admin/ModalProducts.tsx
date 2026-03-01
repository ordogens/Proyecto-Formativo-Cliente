import type { Product } from "./table/ProductsTable"
import { Modal } from "../../components/modals/Modal"

interface ModalProductsProps {
  isOpen: boolean
  onClose: () => void
  editingProduct: Product | null
  form: Omit<Product, "id">
  setForm: React.Dispatch<React.SetStateAction<Omit<Product, "id">>>
  onSave: () => void
}

export const ModalProducts = ({
  isOpen,
  onClose,
  editingProduct,
  form,
  setForm,
  onSave
}: ModalProductsProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="font-serif text-lg font-bold flex flex-col">
        {editingProduct ? "Editar producto" : "Agregar producto"}
        <span className="mb-4 text-[10px] font-light tracking-wide text-gray-500">
          {editingProduct
            ? "Modifica los datos del producto."
            : "Completa la información del nuevo producto."}
        </span>
      </h3>

      <div className="flex flex-col gap-3">
        <input
          className="rounded border px-3 py-2"
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="number"
          min={0}
          className="rounded border px-3 py-2"
          placeholder="Precio"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: Number(e.target.value) })
          }
        />

        <input
          type="number"
          min={0}
          className="rounded border px-3 py-2"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) =>
            setForm({ ...form, stock: Number(e.target.value) })
          }
        />

        <select
          className="rounded border px-3 py-2"
          value={form.category}
          onChange={(e) =>
            setForm({
              ...form,
              category: e.target.value as Product["category"]
            })
          }
        >
          <option value="men_clothing">Ropa hombre</option>
          <option value="women_clothing">Ropa mujer</option>
          <option value="hats">Gorros</option>
        </select>

        <input
          className="rounded border px-3 py-2"
          placeholder="URL de imagen"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
        />
      </div>

      <div className="mt-6 flex justify-between gap-2 w-full">
        <button
          onClick={onClose}
          className="rounded border px-4 py-2 w-full hover:text-white hover:bg-black cursor-pointer"
        >
          Cancelar
        </button>
        <button
          onClick={onSave}
          className="rounded px-4 py-2 text-red-500 w-full border-1 border-red-500 hover:bg-red-600 hover:text-white cursor-pointer"
        >
          {editingProduct ? "Guardar cambios" : "Agregar"}
        </button>
      </div>
    </Modal>
  )
}