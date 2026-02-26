import { productos } from "../../data/Productos";
import { ProductCard } from "../../components/ui/cards/ProductCard";
import { ProductsLayout } from "../../layouts/ProductsLayout";

export const RopaMujer = () => {
  const productosMujer = productos.filter((p) => p.categoria === "mujer");

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
