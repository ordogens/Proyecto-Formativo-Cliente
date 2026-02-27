import { createRoot } from "react-dom/client";
import { ShopProvider } from "./context/ShopProvide";
import { BrowserRouter } from "react-router-dom";
import { ThemeContextProvider } from "./context/ThemeProvider";
import "./index.css";
import { App } from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <ThemeContextProvider>
    <ShopProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ShopProvider>
  </ThemeContextProvider>,
);
