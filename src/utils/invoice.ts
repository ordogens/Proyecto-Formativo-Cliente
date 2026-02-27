import type { Product } from "../types/invoice";

export const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const getInvoiceTotals = (products: Product[]) => {
  const totalProducts = products.length;
  const totalValor = products.reduce((acc, p) => acc + p.price, 0);

  return { totalProducts, totalValor };
};