import { Footer } from "../components/homeComponents/Footer";
import { HomeP1 } from "../components/homeComponents/HomeP1";
import { HomeP2 } from "../components/homeComponents/HomeP2";
import { HomeP3 } from "../components/homeComponents/HomeP3";

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
