import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div>
      <Navbar />
      <div className="p-4 h-screen">
        <div className="mt-16">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
