import type { ApiProducto, ApiCategoria } from "../types/api.types";
import type { Producto } from "../data/Productos";
import type { Categoria } from "../types/categoria.types";

/* =============================================
   Mapeo de categoría: nombre back → slug front
============================================= */
const categoriaNombreToSlug: Record<string, Producto["categoria"]> = {
  hombre: "hombre",
  mujer: "mujer",
  gorros: "gorros",
};

const categoriaSlugToNombre: Record<string, string> = {
  hombre: "Hombre",
  mujer: "Mujer",
  gorros: "Gorros",
};

const categoriaPathMap: Record<string, string> = {
  hombre: "/ropa-hombre",
  mujer: "/ropa-mujer",
  gorros: "/gorros",
};

const categoriaDescMap: Record<string, string> = {
  hombre: "Estilo masculino moderno",
  mujer: "Elegancia contemporánea",
  gorros: "Accesorios con actitud",
};

/* =============================================
   Producto: API → UI
============================================= */

/** Cache de categorías para resolver categoria_id → nombre */
let categoriaCache: ApiCategoria[] = [];

export const setCategoriaCache = (categorias: ApiCategoria[]) => {
  categoriaCache = categorias;
};

const resolveCategoria = (categoriaId: number): Producto["categoria"] => {
  const cat = categoriaCache.find((c) => c.id === categoriaId);
  if (!cat) return "hombre"; // fallback
  const slug = categoriaNombreToSlug[cat.nombre.toLowerCase()];
  return slug ?? "hombre";
};

export const apiProductoToUI = (api: ApiProducto): Producto => ({
  id: api.id ?? 0,
  nombre: api.nombre,
  precio: api.price,
  imagen: api.imagen_url ?? api.image_url ?? "",
  categoria: resolveCategoria(api.categoria_id ?? api.category_id ?? 0),
  descripcion: api.descripcion ?? "",
});

/* =============================================
   Producto: UI → API (para crear/editar desde admin)
============================================= */
export const uiProductoToApi = (
  ui: Partial<Producto> & { categoria_id?: number; talla?: string }
): Partial<ApiProducto> => ({
  nombre: ui.nombre,
  imagen_url: ui.imagen,
  descripcion: ui.descripcion,
  categoria_id: ui.categoria_id ?? 0,
  price: ui.precio ?? 0,
  talla: ui.talla ?? "",
});

/* =============================================
   Categoría: API → UI
============================================= */
export const apiCategoriaToUI = (api: ApiCategoria): Categoria => {
  const key = api.nombre.toLowerCase();
  return {
    id: api.id,
    title: categoriaSlugToNombre[key] ?? api.nombre,
    description: categoriaDescMap[key] ?? "",
    image: "", // se asigna desde assets locales o desde una URL del back
    path: categoriaPathMap[key] ?? `/categoria/${api.id}`,
  };
};
