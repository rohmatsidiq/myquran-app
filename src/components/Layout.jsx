import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div>
      <Navbar />
      <div className="mt-16 max-w-[1080px] mx-auto p-4">
        <Outlet />
      </div>
    </div>
  );
}
