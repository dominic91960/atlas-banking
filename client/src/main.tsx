import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import App from "./App.tsx";
import Dashboard from "./components/dashboard/Dashboard.tsx";
import ForgotPwdForm from "./components/forgot-pwd/ForgotPwdForm.tsx";
import ResetPwdForm from "./components/reset-pwd/ResetPwdForm.tsx";
import SignUpFlow from "./components/sign-up/SignUpFlow.tsx";
import SignInForm from "./components/sign-in/SignInForm.tsx";
import ToastContainer from "./components/global/ui/ToastContainer.tsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        path: "sign-in",
        Component: SignInForm,
      },
      {
        path: "sign-up",
        Component: SignUpFlow,
      },
      {
        path: "forgot-password",
        Component: ForgotPwdForm,
      },
      {
        path: "reset-password",
        Component: ResetPwdForm,
      },
    ],
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
