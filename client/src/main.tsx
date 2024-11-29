import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";

import App from "./App.tsx";
import { Live } from "./pages/Live.tsx";
import Providers from "./providers";
import Catalog from "./pages/Catalog.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Providers>
        <Routes>
          <Route index element={<App />} />
          <Route path="/live" element={<Live />} />
          <Route path="/catalog" element={<Catalog />} />
        </Routes>
      </Providers>
    </BrowserRouter>
  </StrictMode>
);
