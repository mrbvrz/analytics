import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

/* Urutan impor penting: font → token → dasar → grafik → alat takar → floating index */
import "./styles/fonts.css";
import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/charts.css";
import "./styles/calculator.css";
import "./styles/floating-index.css";

import App from "./App";

const el = document.getElementById("root");
if (!el) throw new Error("#root tidak ditemukan di index.html");

createRoot(el).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
