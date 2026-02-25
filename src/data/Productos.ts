import camisa from "../assets/photo.png";
import mujer from "../assets/mujer.jpg";
import gorro from "../assets/gorros.jpg";


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

export const productoM: Producto[] = [

  {
    id: 1,
    nombre: "Nombre producto",
    precio: 10000,
    imagen: mujer,
  },
  {
    id: 2,
    nombre: "Nombre producto",
    precio: 10000,
    imagen: mujer,
  },
  {
    id: 3,
    nombre: "Nombre producto",
    precio: 10000,
    imagen: mujer,
  },
  {
    id: 4,
    nombre: "Nombre producto",
    precio: 10000,
    imagen: mujer,
  },
   {
    id: 5,
    nombre: "Nombre producto",
    precio: 10000,
    imagen: mujer,
   },
   
];

export const gorros: Producto[] = [

  {
    id: 1,
    nombre: "Nombre producto",
    precio: 10000,
    imagen: gorro,
  },
  {
    id: 2,
    nombre: "Nombre producto",
    precio: 10000,
    imagen: gorro,
  },
  {
    id: 3,
    nombre: "Nombre producto",
    precio: 10000,
    imagen: gorro,
  },
  {
    id: 4,
    nombre: "Nombre producto",
    precio: 10000,
    imagen: gorro,
  },
   {
    id: 5,
    nombre: "Nombre producto",
    precio: 10000,
    imagen: gorro,
   },

];