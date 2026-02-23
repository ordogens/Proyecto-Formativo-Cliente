import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Catalogo } from "./pages/Catalogo";
import { Personalizacion } from "./pages/Personalizacion";
import { RopaHombre } from "./pages/RHombre/RopaHombre";
import { PSuperior } from "./pages/RHombre/PSuperior";
import { PInferior } from "./pages/RHombre/PInferior";
import { RopaMujer } from "./pages/RMujer/RopaMujer";
import { PSuperiorM } from "./pages/RMujer/PSuperiorM";
import { PInferiorM } from "./pages/RMujer/PInferiorM";
import { Gorros } from "./pages/Gorros/Gorros";
import { Mujer } from "./pages/Gorros/Mujer";
import { Hombre } from "./pages/Gorros/Hombre";
import { PrincipalLayout } from "./layouts/PrincipalLayout";

export const App = () => {
  return (
    <PrincipalLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/personalizacion" element={<Personalizacion />} />
        <Route path="/ropa-hombre" element={<RopaHombre />} />
        <Route path="/ropa-hombre/prenda-superior" element={<PSuperior />} />
        <Route path="/ropa-hombre/prenda-inferior" element={<PInferior />} />
        <Route path="/ropa-mujer" element={<RopaMujer />} />
        <Route path="/ropa-mujer/prenda-superior" element={<PSuperiorM />} />
        <Route path="/ropa-mujer/prenda-inferior" element={<PInferiorM />} />
        <Route path="/gorros" element={<Gorros />} />
        <Route path="/gorros/mujer" element={<Mujer />} />
        <Route path="/gorros/hombre" element={<Hombre />} />
      </Routes>
    </PrincipalLayout>
  );
};
