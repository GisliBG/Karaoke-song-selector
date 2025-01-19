import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";

import App from "./App.tsx";
import { Live } from "./pages/Live.tsx";
import Providers from "./providers";
import Catalog from "./pages/Catalog.tsx";
import { Band } from "./pages/Band.tsx";
import Playlist from "./pages/Playlist.tsx";
import Controls from "./pages/Controls.tsx";
import { Login } from "./components/Login.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Providers>
        <Routes>
          <Route index element={<App />} />
          <Route path='/live' element={<Live />} />
          <Route
            path='/band'
            element={
              <ProtectedRoute>
                <Band />
              </ProtectedRoute>
            }
          >
            <Route index path='controls' element={<Controls />} />
            <Route path='catalog' element={<Catalog />} />
            <Route index path='playlist' element={<Playlist />} />
          </Route>
          <Route path='/login' element={<Login />} />
        </Routes>
      </Providers>
    </BrowserRouter>
  </StrictMode>
);
