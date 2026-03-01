import { useState } from "react"
import { Minus, Plus, Pencil, Trash2 } from "lucide-react"

/* =====================
   * Tipos (idealmente van en types.ts)
===================== */
export type Category = "men_clothing" | "women_clothing" | "hats"

export interface Product {
  id: number
  name: string
  category: Category
  price: number
  stock: number
  image: string
}
/* =====================
   ! Datos quemados de prueba
===================== */
const initialProducts: Product[] = [
  {
    id: 1,
    name: "Camiseta 1",
    category: "men_clothing",
    price: 49999,
    stock: 12,
    image: "https://via.placeholder.com/80"
  },
  {
    id: 2,
    name: "Pantalón 1",
    category: "women_clothing",
    price: 19900,
    stock: 4,
    image: "https://via.placeholder.com/80"
  },
  {
    id: 3,
    name: "Gorro 1",
    category: "hats",
    price: 9500,
    stock: 20,
    image: "https://via.placeholder.com/80"
  }
]

/* =====================
   ! Esto va en helpers
===================== */
const categoryLabels: Record<Category, string> = {
  men_clothing: "Ropa hombre",
  women_clothing: "Ropa mujer",
  hats: "Gorros"
}

const formatPrice = (price: number) =>
  price.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0
  })

export const ProductsTable = ({ onEditProduct }: {
  onEditProduct: (product: Product) => void
}) => {
  const [productsList, setProductsList] = useState<Product[]>(initialProducts)
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

  const handleDeleteProduct = (id: number) => {
    setProductsList((prev) => prev.filter((product) => product.id !== id))
  }

  /**
   *TODO: Modularizar componente.
   *TODO: Importar funciones desde sus archivos correspondientes, helpers, utils, etc  
   **/

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
        {productsList.map((product) => (
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
                {categoryLabels[product.category] || product.category}
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