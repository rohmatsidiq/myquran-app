import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import NavMobile from "./NavMobile";

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col">
      {/* Navbar Desktop */}
      <Navbar />

      {/* Konten Utama: Beri pt-20 agar tidak tertutup Navbar Fixed */}
      <main className="flex-1 pt-20 pb-20 md:pb-10">
        <div className="max-w-7xl mx-auto px-4">
          <Outlet />
        </div>
      </main>

      {/* Navigasi Mobile Bawah */}
      <NavMobile />
    </div>
  );
}
