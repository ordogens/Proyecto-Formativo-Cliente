import { useEffect, useState } from "react";
import type { Producto } from "../../data/Productos";
import { ProductCard } from "../../components/ui/cards/ProductCard";
import { ProductsLayout } from "../../layouts/ProductsLayout";
import { catalogService } from "../../services/catalog.service";
import { matchesAudience, toUiProducto } from "../../utils/catalogProducts";

export const RopaMujer = () => {
  const [productosMujer, setProductosMujer] = useState<Producto[]>([]);

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
          .filter((p) => matchesAudience(p, categorias, "mujer"))
          .map((p) => toUiProducto(p, categorias, "mujer"));

        setProductosMujer(productosFiltrados);
      } catch (error) {
        console.error("Error cargando ropa de mujer:", error);
        if (mounted) setProductosMujer([]);
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
      titulo="Ropa de Mujer"
      totalProductos={productosMujer.length}
      filtros={["Blusas", "Pantalones"]}
    >
      {productosMujer.map((producto) => (
        <ProductCard key={producto.id} producto={producto} />
      ))}
    </ProductsLayout>
  );
};
