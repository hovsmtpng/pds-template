import React from "react";
import ReactDOM from "react-dom/client";
// import "./custom.css";

import "@puninar-logistics/pds-sdk/custom.css";

import App from "./App";

import "./i18n"; // penting: inisialisasi sebelum render

import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
// import "primereact/resources/themes/lara-light-blue/theme.css";
// import "primereact/resources/themes/lara-light-cyan/theme.css";
// import "primereact/resources/primereact.min.css";
// import { PrimeReactProvider, PrimeReactContext } from "primereact/api";
import { ActivePathProvider } from "./ActivePathContext"; // Import the context

import { AlertDialogProvider } from "@/providers/AlertDialogProvider";

import { Toaster } from "sonner";
import { ToastProvider } from "@/providers/ToastProvider";

const isReverseProxy = import.meta.env.VITE_REVERSE_PROXY === "true";
const basePath = isReverseProxy ? "/26" : "";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter basename={basePath}>
    {/* <React.StrictMode> */}
      <ToastProvider>
        <AlertDialogProvider>
          {/* <PrimeReactProvider context={PrimeReactContext}> */}
          <AuthProvider>
            <ActivePathProvider>
              <App />
            </ActivePathProvider>
          </AuthProvider>
        </AlertDialogProvider>
        <Toaster swipeDirections="right" richColors position="top-right" />
      </ToastProvider>
      {/* </PrimeReactProvider> */}
    {/* </React.StrictMode> */}
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
