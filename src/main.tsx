// src/main.tsx
import { scan } from "react-scan";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import "./index.css";
import { routes } from "./core/routes";

const router = createBrowserRouter(routes);

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

const root = createRoot(rootElement);

if (typeof window !== "undefined") {
  if (import.meta.env.DEV) {
    scan({
      enabled: true,
      log: false,
    });
  }
}

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
