import type { ApiCategoria, ApiProducto } from "../types/api.types";
import type { Categoria, Producto } from "../data/Productos";

const normalize = (value?: string) => (value ?? "").trim().toLowerCase();

const getCategoryName = (producto: ApiProducto, categorias: ApiCategoria[]) => {
  const categoryId = producto.categoria_id ?? producto.category_id;
  if (!categoryId) return "";
  const categoria = categorias.find((c) => c.id === categoryId);
  return normalize(categoria?.nombre);
};

const isHatCategory = (categoryName: string) =>
  categoryName.includes("gorro") || categoryName.includes("gorra");

export const resolveDisplayCategoria = (
  producto: ApiProducto,
  categorias: ApiCategoria[]
): Categoria => {
  const categoryName = getCategoryName(producto, categorias);
  if (isHatCategory(categoryName)) return "gorros";

  const genero = normalize(producto.genero ?? producto.gender);
  if (genero === "hombre") return "hombre";
  if (genero === "mujer") return "mujer";

  return "hombre";
};

export const matchesAudience = (
  producto: ApiProducto,
  categorias: ApiCategoria[],
  audience: Categoria
) => {
  const categoryName = getCategoryName(producto, categorias);
  const genero = normalize(producto.genero ?? producto.gender);

  if (audience === "gorros") return isHatCategory(categoryName);
  if (audience === "hombre") return genero === "hombre";
  return genero === "mujer";
};

export const toUiProducto = (
  producto: ApiProducto,
  categorias: ApiCategoria[],
  forcedCategoria?: Categoria
): Producto => ({
  id: producto.id ?? 0,
  nombre: producto.nombre,
  precio: Number(producto.price ?? 0),
  imagen: producto.imagen_url ?? producto.image_url ?? "",
  categoria: forcedCategoria ?? resolveDisplayCategoria(producto, categorias),
  descripcion: producto.descripcion ?? "",
});
