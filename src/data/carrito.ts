import modelo from "../assets/Sleeveless shirt.png";

export interface CartItem {
  cartId: string;        // único para cada item en el carrito
  productId: number;     // referencia al producto base
  name: string;
  price: number;
  quantity: number;
  image: string;
  personalized?: boolean;
}

export const cartMock: CartItem[] = [
  {
    cartId: "c1a9f1e2-001",
    productId: 1,
    name: "Camisa Negra Oversize",
    price: 50000,
    quantity: 1,
    image: modelo,
    personalized: false,
  },
  {
    cartId: "c1a9f1e2-002",
    productId: 1,
    name: "Camisa Negra Oversize - Diseño Dragón Rojo",
    price: 65000,
    quantity: 1,
    image: modelo,
    personalized: true,
  },
  {
    cartId: "c1a9f1e2-003",
    productId: 2,
    name: "Buso Blanco Minimal",
    price: 80000,
    quantity: 2,
    image: modelo,
    personalized: false,
  },
  {
    cartId: "c1a9f1e2-004",
    productId: 3,
    name: "Camisa Blanca - Frase Motivacional",
    price: 70000,
    quantity: 1,
    image: modelo,
    personalized: true,
  },
];