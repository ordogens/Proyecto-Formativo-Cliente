import { useEffect, useState } from "react";
import type { Producto } from "../../data/Productos";
import { ProductCard } from "../../components/ui/cards/ProductCard";
import { ProductsLayout } from "../../layouts/ProductsLayout";
import { catalogService } from "../../services/catalog.service";
import { matchesAudience, toUiProducto } from "../../utils/catalogProducts";

const normalize = (value: string) => value.trim().toLowerCase();
const toFilterKey = (value: string) => {
  const normalized = normalize(value);

  if (normalized.startsWith("camis")) return "camis";
  if (normalized.startsWith("pant")) return "pantalon";

  return normalized;
};

export const RopaHombre = () => {
  const [productosHombre, setProductosHombre] = useState<Producto[]>([]);
  const filtros = ["Todos", "Camisetas", "Pantalones"] as const;
  const [filtroActivo, setFiltroActivo] = useState<string>(filtros[0]);

  useEffect(() => {
    let mounted = true;

    const fetchProductos = async () => {
      try {
        const [productosApi, categorias] = await Promise.all([
          catalogService.getProducts(),
          catalogService.getCategories(),
        ]);

        if (!mounted) return;

        const productosFiltrados = productosApi
          .filter((p) => matchesAudience(p, categorias, "hombre"))
          .map((p) => toUiProducto(p, categorias, "hombre"));

        setProductosHombre(productosFiltrados);
      } catch (error) {
        console.error("Error cargando ropa de hombre:", error);
        if (mounted) setProductosHombre([]);
      }
    };

    fetchProductos();

    return () => {
      mounted = false;
    };
  }, []);

  const filtroKey = toFilterKey(filtroActivo);
  const productosVisibles = productosHombre.filter((producto) => {
    if (filtroKey === "todos") return true;
    return toFilterKey(producto.categoriaNombre ?? "") === filtroKey;
  });

  return (
    <ProductsLayout
      categoriaLabel="Categorías"
      titulo="Ropa de hombre"
      totalProductos={productosVisibles.length}
      filtros={filtros}
      filtroActivo={filtroActivo}
      onFiltroChange={setFiltroActivo}
    >
      {productosVisibles.map((producto) => (
        <ProductCard key={producto.id} producto={producto} />
      ))}
    </ProductsLayout>
  );
};
