import { createRoot } from "react-dom/client";
import { ShopProvider } from "./context/shopProvide";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { App } from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <ShopProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ShopProvider>
);
