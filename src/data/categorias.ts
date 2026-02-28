import hombre from "../assets/photo.png";
import mujer from "../assets/mujer.jpg";
import gorros from "../assets/gorros.jpg";
import type { Categoria } from "../types/categoria.types";

export const categorias: Categoria[] = [
  {
    title: "Hombre",
    description: "Estilo masculino moderno",
    image: hombre,
    path: "/ropa-hombre",
  },
  {
    title: "Mujer",
    description: "Elegancia contemporánea",
    image: mujer,
    path: "/ropa-mujer",
  },
  {
    title: "Gorros",
    description: "Accesorios con actitud",
    image: gorros,
    path: "/gorros",
  },
];