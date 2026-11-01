import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexReactClient, ConvexProvider } from "convex/react";
import "./index.css";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      {/* Menggunakan ConvexProvider biasa dan mengambil token dari useAuth Clerk */}
      <ConvexProvider client={convex} useAuth={useAuth}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConvexProvider>
    </ClerkProvider>
  </React.StrictMode>,
);
