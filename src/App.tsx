import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import type { ReactElement } from "react";
import { Home } from "./pages/Home";
import { Catalogo } from "./pages/Catalogo";
import { Personalizacion } from "./pages/Personalizacion";
import { RopaHombre } from "./pages/RHombre/RopaHombre";
import { RopaMujer } from "./pages/RMujer/RopaMujer";
import { Gorros } from "./pages/Gorros/Gorros";
import { VistaDinamica } from "./pages/vistaDinamica/VistaDinamica";
import { CarritoDeCompras } from "./pages/carrito/CarritoDeCompras";
import { PrincipalLayout } from "./layouts/PrincipalLayout";
import { AdminView } from "./pages/adminView/AdminView";
import { useAuth } from "./context/AuthContext";

const RequireAdmin = ({ children }: { children: ReactElement }) => {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

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
        <Route
          path="/admin-view"
          element={
            <RequireAdmin>
              <AdminView />
            </RequireAdmin>
          }
        />
      </Routes>
    </PrincipalLayout>
  );
};
