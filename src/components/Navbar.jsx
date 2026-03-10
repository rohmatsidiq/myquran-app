import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MdOutlineBookmarkBorder } from "react-icons/md";

export default function Navbar() {
  const { pathname } = useLocation();

  const checkActive = (path) => {
    if (path === "/") return pathname === "/";
    if (path === "/surah") {
      // Menyala jika di daftar surat ATAU sedang baca detail ayat
      return pathname.startsWith("/surah") || pathname.includes("/detail");
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md z-[100] border-b border-gray-100 flex items-center">
      <div className="max-w-7xl mx-auto w-full px-6 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-black text-orange-500 tracking-tighter flex items-center gap-2"
        >
          <div className="w-8 h-8 bg-orange-500 text-white flex items-center justify-center rounded-lg shadow-md shadow-orange-200">
            Q
          </div>
          MyQur'an
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`font-bold text-sm transition-all ${
              checkActive("/")
                ? "text-orange-600 scale-105"
                : "text-gray-500 hover:text-orange-400"
            }`}
          >
            Home
          </Link>
          <Link
            to="/surah"
            className={`font-bold text-sm transition-all ${
              checkActive("/surah")
                ? "text-orange-600 scale-105"
                : "text-gray-500 hover:text-orange-400"
            }`}
          >
            Surat
          </Link>
          <Link
            to="/doa"
            className={`font-bold text-sm transition-all ${
              checkActive("/doa")
                ? "text-orange-600 scale-105"
                : "text-gray-500 hover:text-orange-400"
            }`}
          >
            Doa
          </Link>
          <Link
            to="/jadwal"
            className={`font-bold text-sm transition-all ${
              checkActive("/jadwal")
                ? "text-orange-600 scale-105"
                : "text-gray-500 hover:text-orange-400"
            }`}
          >
            Jadwal Sholat
          </Link>
          <Link
            to="/bookmark"
            className={`p-2 rounded-xl transition-all shadow-sm ${
              checkActive("/bookmark")
                ? "bg-orange-500 text-white shadow-orange-200"
                : "bg-orange-50 text-orange-500 hover:bg-orange-100"
            }`}
          >
            <MdOutlineBookmarkBorder size={22} />
          </Link>
        </div>

        {/* Indikator Mobile */}
        <div className="md:hidden w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
      </div>
    </nav>
  );
}
