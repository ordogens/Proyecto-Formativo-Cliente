import camisa from "../assets/photo.png";


export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
}


export const productos: Producto[] = [
  {
    id: 1,
    nombre: "Nombre producto",
    precio: 10000,
    imagen: camisa,
  },
  {
    id: 2,
    nombre: "Nombre producto",
    precio: 10000,
    imagen: camisa,
  },
  {
    id: 3,
    nombre: "Nombre producto",
    precio: 10000,
    imagen: camisa,
  },
  {
    id: 4,
    nombre: "Nombre producto",
    precio: 10000,
    imagen: camisa,
  },
   {
    id: 5,
    nombre: "Nombre producto",
    precio: 10000,
    imagen: camisa,
  },

];