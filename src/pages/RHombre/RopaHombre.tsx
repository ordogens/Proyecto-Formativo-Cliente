import { productos } from "../../data/Productos";
import { ProductCard } from "../../components/cards/ProductCard";
import { ProductsLayout } from "../../layouts/ProductsLayout";

export const RopaHombre = () => {
  const productosHombre = productos.filter(
    (p) => p.categoria === "hombre"
  );

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