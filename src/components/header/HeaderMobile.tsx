import { Menu } from "lucide-react";
import { useState } from "react";

export const HeaderMobile = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Barra superior */}
      <header className="w-full h-16 bg-gray-200 flex items-center justify-between px-4">

        {/* Logo circular */}
        <div className="w-10 h-10 bg-gray-500 rounded-full" />

        {/* Botón menú */}
        <button onClick={() => setOpen(!open)}>
          <Menu size={28} />
        </button>
      </header>

      {/* Menú desplegable */}
      {open && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col p-6 gap-4">
          <a href="#">Inicio</a>
          <a href="#">Catálogo</a>
          <a href="#">Personalización</a>
        </div>
      )}
    </>
  );
};