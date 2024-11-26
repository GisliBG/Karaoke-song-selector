import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";

import App from "./App.tsx";
import { Live } from "./pages/Live.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<App />} />
        <Route path="/live" element={<Live />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
