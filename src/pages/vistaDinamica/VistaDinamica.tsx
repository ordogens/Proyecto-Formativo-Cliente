import camisas from "../../assets/photo.png"

export const VistaDinamica = () => {
  return (
    <section className="h-full bg-[#f5f3ef] flex items-center justify-center px-4 py-10">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Imagen */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-md md:max-w-lg rounded-2xl overflow-hidden shadow-sm">
            <img
              src={camisas}
              alt="Camisa gris"
              className="w-full h-96 md:h-120  object-cover"
            />
          </div>
        </div>

        {/* Información */}
        <div className="space-y-6">
          <span className="text-sm text-red-400">Hombre</span>

          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
            Nombre producto
          </h1>

          <p className="text-xl font-bold text-gray-900">$10.000</p>

          <p className="text-gray-500 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
            varius eget nunc a aliquam. Vivamus quis justo nec nunc condimentum
            aliquet.
          </p>

          {/* Botones */}
          <div className="space-y-3">
            <button className="w-full bg-black text-white py-3 rounded-lg font-medium hover:opacity-90 transition">
              Agregar al carrito
            </button>

            <button className="w-full border border-red-300 text-red-400 py-3 rounded-lg font-medium hover:bg-red-50 transition">
              Personalizar con IA
            </button>
          </div>

          {/* Información extra */}
          <div className="bg-[#ece8e3] p-4 rounded-xl space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <p>En stock - Envío inmediato</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-400 rounded-full"></span>
              <p>Personalizable con IA</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
