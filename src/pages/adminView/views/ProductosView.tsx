import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { ProductsTable } from "../../../components/admin/table/ProductsTable"
import type { Product } from "../../../components/admin/table/ProductsTable"
import { ModalProducts, type ProductForm } from "../../../components/admin/ModalProducts"
import { catalogService } from "../../../services/catalog.service"
import type { ApiCategoria } from "../../../types/api.types"

/** Categorías por defecto si la API aún no tiene datos */
const DEFAULT_CATEGORIES: ApiCategoria[] = [
  { id: 1, nombre: "Camisas" },
  { id: 2, nombre: "Pantalones" },
  { id: 3, nombre: "Gorras" },
]

const emptyForm: ProductForm = {
  name: "",
  categoryId: "",
  price: "",
  stock: "",
  image: "",
  gender: "Unisex"
}

export const ProductosView = () => {
  const [showProductDialog, setShowProductDialog] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [form, setForm] = useState<ProductForm>(emptyForm)
  const [categories, setCategories] = useState<ApiCategoria[]>(DEFAULT_CATEGORIES)
  const [genderFilter, setGenderFilter] = useState<"Todos" | "Hombre" | "Mujer" | "Unisex">("Todos")
  const [categoryFilterId, setCategoryFilterId] = useState<number | "Todas">("Todas")

  useEffect(() => {
    catalogService.getCategories()
      .then((cats) => setCategories(cats.length > 0 ? cats : DEFAULT_CATEGORIES))
      .catch((err) => {
        console.error("Error cargando categorías:", err)
        setCategories(DEFAULT_CATEGORIES)
      })
  }, [])

  const openAddProduct = () => {
    setEditingProduct(null)
    setForm(emptyForm)
    setShowProductDialog(true)
  }

  const openEditProduct = (product: Product) => {
    setEditingProduct(product)
    setForm({
      name: product.name,
      categoryId: product.categoryId,
      price: product.price,
      stock: product.stock,
      image: product.image,
      gender: product.gender || "Unisex"
    })
    setShowProductDialog(true)
  }

  const handleSaveProduct = async () => {
    if (
      form.name.trim() === "" ||
      form.stock === "" ||
      form.categoryId === "" ||
      form.image.trim() === ""
    ) {
      return
    }

    const apiPayload = {
      nombre: form.name.trim(),
      imagen: form.image.trim(),
      descripcion: "",
      category_id: Number(form.categoryId),
      price: Number(form.price),
      talla: "UNICA",
      genero: form.gender,
    }

    try {
      if (editingProduct) {
        await catalogService.updateProduct(editingProduct.id, apiPayload)
      } else {
        await catalogService.createProduct(apiPayload)
      }
    } catch (err) {
      console.error("Error guardando producto:", err)
    }

    setShowProductDialog(false)
  }

  return (
    <div className="bg-[#f3f0eb] w-full h-full md:p-4 dark:bg-gray-900">
      <header className="mb-4 flex flex-col md:flex-row w-full items-start md:items-center justify-between">
        <h2 className="font-serif text-2xl md:text-xl dark:text-gray-300">Gestión de productos</h2>
        <div className="flex items-center gap-2">
          <select
            className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
            value={categoryFilterId}
            onChange={(e) => setCategoryFilterId(e.target.value === "Todas" ? "Todas" : Number(e.target.value))}
          >
            <option value="Todas">Todas las prendas</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
          <select
            className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value as "Todos" | "Hombre" | "Mujer" | "Unisex")}
          >
            <option value="Todos">Todos</option>
            <option value="Hombre">Hombre</option>
            <option value="Mujer">Mujer</option>
            <option value="Unisex">Unisex</option>
          </select>
          <button
            onClick={openAddProduct}
            className="flex items-center gap-2 rounded-lg border border-red-300 px-2 py-1 text-red-400 transition hover:bg-red-500 hover:text-white cursor-pointer "
          >
            <Plus size={20} />
            <span>Agregar producto</span>
          </button>
        </div>
      </header>

      <ProductsTable
        onEditProduct={openEditProduct}
        genderFilter={genderFilter}
        categoryFilterId={categoryFilterId}
      />

      <ModalProducts
        isOpen={showProductDialog}
        onClose={() => setShowProductDialog(false)}
        editingProduct={editingProduct}
        form={form}
        setForm={setForm}
        categories={categories}
        onSave={handleSaveProduct}
      />
    </div>
  )
}
