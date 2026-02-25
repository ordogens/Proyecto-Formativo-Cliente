import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Catalogo } from "./pages/Catalogo";
import { Personalizacion } from "./pages/Personalizacion";
import { RopaHombre } from "./pages/RHombre/RopaHombre";
import { RopaMujer } from "./pages/RMujer/RopaMujer";
import { Gorros } from "./pages/Gorros/Gorros";
import { VistaDinamica } from "./pages/vistaDinamica/VistaDinamica";
import { CarritoDeCompras } from "./pages/carrito/CarritoDeCompras";

import { PrincipalLayout } from "./layouts/PrincipalLayout";

export const App = () => {
  return (
    <PrincipalLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/personalizacion" element={<Personalizacion />} />
        <Route path="/ropa-hombre" element={<RopaHombre />} />
        <Route path="/ropa-mujer" element={<RopaMujer />} />
        <Route path="/gorros" element={<Gorros />} />
        <Route path="/vista-dinamica/:id" element={<VistaDinamica />} />
        <Route path="/carrito" element={<CarritoDeCompras />} />
      </Routes>
    </PrincipalLayout>
  );
};
