import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import App from "./App.tsx";
import Dashboard from "./components/client-side/dashboard/Dashboard.tsx";
import ToastContainer from "./components/global/ui/ToastContainer.tsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <ToastContainer />
  </StrictMode>,
);
