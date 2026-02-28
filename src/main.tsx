import { createRoot } from "react-dom/client";
import { ShopProvider } from "./context/ShopProvide";
import { BrowserRouter } from "react-router-dom";
import { ThemeContextProvider } from "./context/ThemeProvider";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import { App } from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <ThemeContextProvider>
    <AuthProvider>
      <ShopProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ShopProvider>
    </AuthProvider>
  </ThemeContextProvider>,
);
