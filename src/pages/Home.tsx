import { Footer } from "../components/homeComponets/Footer";
import { HomeP1 } from "../components/homeComponets/HomeP1";
import { HomeP2 } from "../components/homeComponets/HomeP2";
import { HomeP3 } from "../components/homeComponets/HomeP3";

export const Home = () => {
  return (
    <div className="bg-[#130e0a] text-white overflow-x-hidden min-h-screen">

      {/* HERO */}
      <HomeP1 />
      
      {/* CATEGORÍAS */}
      <HomeP2 />

      {/* POR QUÉ ELEGIRNOS */}
      <HomeP3 />

      {/* FOOTER */}
      <Footer />
      
    </div>
  );
};
