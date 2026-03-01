import { useState } from "react"
import { Plus } from "lucide-react"
import { ProductsTable } from "../../../components/admin/table/ProductsTable"
import type { Product } from "../../../components/admin/table/ProductsTable"
import { ModalProducts } from "../../../components/admin/ModalProducts"

const emptyForm: Omit<Product, "id"> = {
  name: "",
  category: "men_clothing",
  price: 0,
  stock: 0,
  image: ""
}

export const ProductosView = () => {
  const [showProductDialog, setShowProductDialog] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [form, setForm] = useState<Omit<Product, "id">>(emptyForm)

  const openAddProduct = () => {
    setEditingProduct(null)
    setForm(emptyForm)
    setShowProductDialog(true)
  }

  const openEditProduct = (product: Product) => {
    setEditingProduct(product)
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      image: product.image
    })
    setShowProductDialog(true)
  }

  const handleSaveProduct = () => {
    console.log("Guardar producto:", { editingProduct, form })
    setShowProductDialog(false)
  }

  return (
    <div className="bg-[#f3f0eb] w-full h-full md:p-4 dark:bg-gray-900">
      <header className="mb-4 flex flex-col md:flex-row w-full items-start md:items-center justify-between">
        <h2 className="font-serif text-2xl md:text-xl dark:text-gray-300">Gestión de productos</h2>
        <button
          onClick={openAddProduct}
          className="flex items-center gap-2 rounded-lg border border-red-300 px-2 py-1 text-red-400 transition hover:bg-red-500 hover:text-white cursor-pointer "
        >
          <Plus size={20} />
          <span>Agregar producto</span>
        </button>
      </header>

      <ProductsTable onEditProduct={openEditProduct} />

      <ModalProducts
        isOpen={showProductDialog}
        onClose={() => setShowProductDialog(false)}
        editingProduct={editingProduct}
        form={form}
        setForm={setForm}
        onSave={handleSaveProduct}
      />
    </div>
  )
}