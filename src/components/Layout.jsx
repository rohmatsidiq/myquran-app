import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCFB]">
      {/* Navbar fixed di atas */}
      <Navbar />

      {/* Kontainer Utama */}
      <main className="flex-1 mt-16 overflow-x-hidden">
        {/* mt-16 harus sama dengan h-16 pada Navbar agar pas */}
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
