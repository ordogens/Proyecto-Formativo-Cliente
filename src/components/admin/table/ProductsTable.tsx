import { useState, useEffect } from "react"
import { Minus, Plus, Pencil, Trash2 } from "lucide-react"
import { catalogService } from "../../../services/catalog.service"
import type { ApiProducto, ApiCategoria } from "../../../types/api.types"

/* =====================
   * Tipos admin UI
===================== */
export interface Product {
  id: number
  name: string
  category: string
  categoryId: number
  gender: string
  price: number
  stock: number
  image: string
}

/* =====================
   Convierte ApiProducto → Product (admin UI)
===================== */
const apiToAdminProduct = (
  api: ApiProducto,
  categorias: ApiCategoria[]
): Product => {
  const catId = api.categoria_id ?? api.category_id ?? 0
  const cat = categorias.find((c) => c.id === catId)
  const imageUrl = api.imagen_url ?? api.image_url
  return {
    id: api.id ?? 0,
    name: api.nombre,
    category: cat?.nombre ?? "Sin categoría",
    categoryId: catId,
    gender: api.genero ?? api.gender ?? "Unisex",
    price: api.price,
    stock: 0,
    image: imageUrl ?? "https://via.placeholder.com/80",
  }
}

const formatPrice = (price: number) =>
  price.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0
  })

export const ProductsTable = ({ onEditProduct, genderFilter, categoryFilterId }: {
  onEditProduct: (product: Product) => void
  genderFilter: "Todos" | "Hombre" | "Mujer" | "Unisex"
  categoryFilterId: number | "Todas"
}) => {
  const [productsList, setProductsList] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productos, categorias] = await Promise.all([
          catalogService.getProducts(),
          catalogService.getCategories(),
        ])
        setProductsList(productos.map((p) => apiToAdminProduct(p, categorias)))
      } catch (err) {
        console.error("Error cargando productos:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const openEditProduct = (product: Product) => {
    onEditProduct(product)
  }
  const handleStockChange = (id: number, delta: number) => {
    setProductsList(prev =>
      prev.map(product =>
        product.id === id
          ? {
            ...product,
            stock: Math.max(0, Math.min(999, product.stock + delta))
          }
          : product
      )
    )
  }

  const handleDeleteProduct = async (id: number) => {
    try {
      await catalogService.deleteProduct(id)
      setProductsList((prev) => prev.filter((product) => product.id !== id))
    } catch (err) {
      console.error("Error eliminando producto:", err)
    }
  }

  if (loading) {
    return <p className="p-4 text-gray-500">Cargando productos...</p>
  }

  const filteredProducts = productsList.filter((product) => {
    const matchesGender =
      genderFilter === "Todos" ||
      product.gender.toLowerCase() === genderFilter.toLowerCase()
    const matchesCategory =
      categoryFilterId === "Todas" || product.categoryId === categoryFilterId

    return matchesGender && matchesCategory
  })

  return (
    <table className="w-full block max-h-[65vh] overflow-x-auto overflow-y-auto max-w-[700px] md:max-w-full md:table md:max-h-none md:overflow-visible md:min-w-0">
      <thead>
        <tr className="border-b">
          <th className="w-16 px-3 py-2 text-left text-sm font-medium dark:text-gray-300">Imagen</th>
          <th className="px-3 py-2 text-left text-sm font-medium dark:text-gray-300">Nombre</th>
          <th className="hidden px-3 py-2 text-left text-sm font-medium dark:text-gray-300 md:table-cell">
            Categoría
          </th>
          <th className="px-3 py-2 text-left text-sm font-medium dark:text-gray-300">Precio</th>
          <th className="px-3 py-2 text-left text-sm font-medium dark:text-gray-300">Stock</th>
          <th className="px-3 py-2 text-right text-sm font-medium dark:text-gray-300">Acciones</th>
        </tr>
      </thead>

      <tbody className="dark:text-gray-300">
        {filteredProducts.map((product) => (
          <tr key={product.id} className="border-b last:border-b-0 hover:bg-[#ebe7e1] dark:hover:bg-gray-800">
            <td className="px-3 py-2">
              <div className="relative h-10 w-10 overflow-hidden rounded-md bg-secondary">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </td>

            <td className="px-3 py-2 font-medium">
              {product.name}
            </td>

            <td className="hidden px-3 py-2 md:table-cell">
              <span className="inline-flex rounded-md bg-secondary px-2 py-1 text-xs font-medium bg-[#ebe5dd] dark:bg-gray-800 dark:border-1 dark:border-gray-600">
                {product.category}
              </span>
            </td>

            <td className="px-3 py-2">
              {formatPrice(product.price)}
            </td>

            <td className="px-3 py-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleStockChange(product.id, -1)}
                  className="flex h-7 w-7 items-center justify-center rounded-md border-1 border-red-500 text-red-500 transition-colors hover:bg-red-500 hover:text-white cursor-pointer"
                  aria-label="Reducir stock"
                >
                  <Minus size={15} />
                </button>

                <span
                  className={`min-w-[2rem] text-center text-sm font-medium ${product.stock <= 5
                    ? "text-red-600"
                    : "text-foreground"
                    }`}
                >
                  {product.stock}
                </span>

                <button
                  onClick={() => handleStockChange(product.id, 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-md border-1 border-red-500 text-red-500 transition-colors hover:bg-red-500 hover:text-white cursor-pointer"
                  aria-label="Aumentar stock"
                >
                  <Plus size={15} />
                </button>
              </div>
            </td>

            <td className="px-3 py-2 text-right">
              <div className="flex items-center justify-end gap-1">
                <button
                  onClick={() => openEditProduct(product)}
                  aria-label="Editar producto"
                  className="rounded-md p-2 transition-colors hover:bg-secondary cursor-pointer hover:text-red-500"
                >
                  <Pencil className="h-4 w-4" />
                </button>

                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  aria-label="Eliminar producto"
                  className="rounded-md p-2 text-destructive-foreground transition-colors hover:bg-secondary cursor-pointer hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>

    </table>
  )
}
