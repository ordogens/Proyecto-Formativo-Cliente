import { Stars } from "../icons/Stars.tsx";
import { Palette, Shield, Truck } from "lucide-react";

export const HomeP3 = () => {
  return (
    <section className="bg-[#efebe4] py-24 px-8 md:px-20">
      {/* Encabezado */}
      <div className="text-center mb-20">
        <p className="text-red-500 font-bold tracking-widest uppercase text-sm">
          Por qué elegirnos
        </p>
        <h2 className="text-4xl text-black font-serif md:text-5xl font-semibold mt-4">
          Moda inteligente, hecha para tí
        </h2>
      </div>

      {/* Grid de beneficios */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Card 1 */}
        <div className="bg-white rounded-3xl p-10 text-center shadow-sm hover:shadow-lg transition">
          <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-zinc-100 flex items-center justify-center text-xl">
            <Stars className="size-10 text-red-500" />
          </div>
          <h3 className="text-red-500 font-bold mb-4">Diseño con IA</h3>
          <p className="text-gray-500">
            Genera diseños únicos usando inteligencia artificial avanzada para
            cada prenda.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-3xl p-10 text-center shadow-sm hover:shadow-lg transition">
          <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center text-xl">
            <Palette className="text-red-400 size-8" />
          </div>
          <h3 className="text-red-500 font-bold mb-4">
            Personalización Total
          </h3>
          <p className="text-gray-500">
            Controla cada detalle de tu prenda: colores, patrones y estilos a
            tu gusto.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-3xl p-10 text-center shadow-sm hover:shadow-lg transition">
          <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center text-xl">
            <Shield className="text-red-500 size-8" />
          </div>
          <h3 className="text-red-500 font-bold mb-4">Calidad Premium</h3>
          <p className="text-gray-500">
            Materiales de primera calidad con procesos de producción
            sostenibles.
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-3xl p-10 text-center shadow-sm hover:shadow-lg transition">
          <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center text-xl">
            <Truck className="text-red-500 size-8" />
          </div>
          <h3 className="text-red-500 font-bold mb-4">Envío Rápido</h3>
          <p className="text-gray-500">
            Recibe tus prendas personalizadas en la puerta de tu casa en días.
          </p>
        </div>
      </div>
    </section>
  )
}


