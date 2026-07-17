import React from "react";
import { createRoot } from "react-dom/client";
import Experience from "./app/Experience";
import "./app/globals.css";

const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <Experience />
    </React.StrictMode>,
  );
}
