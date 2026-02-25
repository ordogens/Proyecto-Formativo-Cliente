import { productos } from "../../data/Productos";
import { ProductCard } from "../../components/cards/ProductCard";
import { ProductsLayout } from "../../layouts/ProductsLayout";

export const Gorros = () => {
  const productosGorros = productos.filter((p) => p.categoria === "hombre");

  return (
    <ProductsLayout
      categoriaLabel="Categorías"
      titulo="Gorros"
      totalProductos={productosGorros.length}
      filtros={["Hombre", "Mujer"]}
    >
      {productosGorros.map((producto) => (
        <ProductCard key={producto.id} producto={producto} />
      ))}
    </ProductsLayout>
  );
};