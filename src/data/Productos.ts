import camisa from "../assets/photo.png";
import mujer from "../assets/mujer.jpg";
import gorro from "../assets/gorros.jpg";

export type Categoria = "hombre" | "mujer" | "gorros";

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  categoria: Categoria;
  descripcion: string;
}

export const productos: Producto[] = [
  // HOMBRE
  {
    id: 1,
    nombre: "Camisa Gris Premium",
    precio: 10000,
    imagen: camisa,
    categoria: "hombre",
    descripcion: "Camisa elegante de algodón premium para ocasiones especiales."
  },
  {
    id: 2,
    nombre: "Camisa Negra Slim Fit",
    precio: 12000,
    imagen: camisa,
    categoria: "hombre",
    descripcion: "Diseño moderno ajustado al cuerpo."
  },
  {
    id: 1,
    nombre: "Camisa Gris Premium",
    precio: 10000,
    imagen: camisa,
    categoria: "hombre",
    descripcion: "Camisa elegante de algodón premium para ocasiones especiales."
  },
  {
    id: 2,
    nombre: "Camisa Negra Slim Fit",
    precio: 12000,
    imagen: camisa,
    categoria: "hombre",
    descripcion: "Diseño moderno ajustado al cuerpo."
  },
  {
    id: 1,
    nombre: "Camisa Gris Premium",
    precio: 10000,
    imagen: camisa,
    categoria: "hombre",
    descripcion: "Camisa elegante de algodón premium para ocasiones especiales."
  },
  {
    id: 2,
    nombre: "Camisa Negra Slim Fit",
    precio: 12000,
    imagen: camisa,
    categoria: "hombre",
    descripcion: "Diseño moderno ajustado al cuerpo."
  },
  {
    id: 1,
    nombre: "Camisa Gris Premium",
    precio: 10000,
    imagen: camisa,
    categoria: "hombre",
    descripcion: "Camisa elegante de algodón premium para ocasiones especiales."
  },
  {
    id: 2,
    nombre: "Camisa Negra Slim Fit",
    precio: 12000,
    imagen: camisa,
    categoria: "hombre",
    descripcion: "Diseño moderno ajustado al cuerpo."
  },
  {
    id: 1,
    nombre: "Camisa Gris Premium",
    precio: 10000,
    imagen: camisa,
    categoria: "hombre",
    descripcion: "Camisa elegante de algodón premium para ocasiones especiales."
  },
  {
    id: 2,
    nombre: "Camisa Negra Slim Fit",
    precio: 12000,
    imagen: camisa,
    categoria: "hombre",
    descripcion: "Diseño moderno ajustado al cuerpo."
  },
  {
    id: 1,
    nombre: "Camisa Gris Premium",
    precio: 10000,
    imagen: camisa,
    categoria: "hombre",
    descripcion: "Camisa elegante de algodón premium para ocasiones especiales."
  },
  {
    id: 2,
    nombre: "Camisa Negra Slim Fit",
    precio: 12000,
    imagen: camisa,
    categoria: "hombre",
    descripcion: "Diseño moderno ajustado al cuerpo."
  },
  {
    id: 1,
    nombre: "Camisa Gris Premium",
    precio: 10000,
    imagen: camisa,
    categoria: "hombre",
    descripcion: "Camisa elegante de algodón premium para ocasiones especiales."
  },
  {
    id: 2,
    nombre: "Camisa Negra Slim Fit",
    precio: 12000,
    imagen: camisa,
    categoria: "hombre",
    descripcion: "Diseño moderno ajustado al cuerpo."
  },
  {
    id: 1,
    nombre: "Camisa Gris Premium",
    precio: 10000,
    imagen: camisa,
    categoria: "hombre",
    descripcion: "Camisa elegante de algodón premium para ocasiones especiales."
  },
  {
    id: 2,
    nombre: "Camisa Negra Slim Fit",
    precio: 12000,
    imagen: camisa,
    categoria: "hombre",
    descripcion: "Diseño moderno ajustado al cuerpo."
  },
  // MUJER
  {
    id: 3,
    nombre: "Blusa Minimalista",
    precio: 15000,
    imagen: mujer,
    categoria: "mujer",
    descripcion: "Blusa ligera y cómoda para uso diario."
  },
  {
    id: 4,
    nombre: "Blusa Casual Urbana",
    precio: 17000,
    imagen: mujer,
    categoria: "mujer",
    descripcion: "Perfecta para estilo urbano moderno."
  },

  // GORROS
  {
    id: 5,
    nombre: "Gorro Urbano Negro",
    precio: 8000,
    imagen: gorro,
    categoria: "gorros",
    descripcion: "Gorro cómodo ideal para clima frío."
  },
  {
    id: 6,
    nombre: "Gorro Deportivo",
    precio: 9000,
    imagen: gorro,
    categoria: "gorros",
    descripcion: "Diseño deportivo ligero y transpirable."
  }
];