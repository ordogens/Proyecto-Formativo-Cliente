import { useEffect, useState } from "react";
import type { Producto } from "../../data/Productos";
import { ProductCard } from "../../components/ui/cards/ProductCard";
import { ProductsLayout } from "../../layouts/ProductsLayout";
import { catalogService } from "../../services/catalog.service";
import { matchesAudience, toUiProducto } from "../../utils/catalogProducts";

export const RopaHombre = () => {
  const [productosHombre, setProductosHombre] = useState<Producto[]>([]);

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

  return (
    <ProductsLayout
      categoriaLabel="Categorías"
      titulo="Ropa de hombre"
      totalProductos={productosHombre.length}
      filtros={["Camisas", "Pantalones"]}
    >
      {productosHombre.map((producto) => (
        <ProductCard key={producto.id} producto={producto} />
      ))}
    </ProductsLayout>
  );
};
