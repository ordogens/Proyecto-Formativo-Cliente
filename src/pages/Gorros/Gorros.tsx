import { useEffect, useState } from "react";
import type { Producto } from "../../data/Productos";
import { ProductCard } from "../../components/ui/cards/ProductCard";
import { ProductsLayout } from "../../layouts/ProductsLayout";
import { catalogService } from "../../services/catalog.service";
import { matchesAudience, toUiProducto } from "../../utils/catalogProducts";

export const Gorros = () => {
  const [productosGorros, setProductosGorros] = useState<Producto[]>([]);

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
          .filter((p) => matchesAudience(p, categorias, "gorros"))
          .map((p) => toUiProducto(p, categorias, "gorros"));

        setProductosGorros(productosFiltrados);
      } catch (error) {
        console.error("Error cargando gorros:", error);
        if (mounted) setProductosGorros([]);
      }
    };

    fetchProductos();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <ProductsLayout
      categoriaLabel="Categorías"
      titulo="Gorros"
      totalProductos={productosGorros.length}
      filtros={["Gorros"]}
    >
      {productosGorros.map((producto) => (
        <ProductCard key={producto.id} producto={producto} />
      ))}
    </ProductsLayout>
  );
};
