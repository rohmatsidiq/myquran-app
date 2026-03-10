import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { TiThMenu } from "react-icons/ti";
import { IoClose } from "react-icons/io5";

export default function Navbar() {
  const [menu, setMenu] = useState(false);
  const location = useLocation();

  // Menutup menu mobile saat ganti halaman
  useEffect(() => {
    setMenu(false);
  }, [location]);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Navbar Utama */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-orange-400 shadow-md z-[100] flex flex-row items-center justify-between">
        <div className="max-w-6xl px-4 mx-auto flex justify-between items-center w-full">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl md:text-2xl font-bold text-white flex items-center gap-2"
          >
            <div className="bg-white text-orange-400 w-8 h-8 flex items-center justify-center rounded-lg font-black shadow-sm">
              Q
            </div>
            MyQur'an
          </Link>

          {/* Navigasi Desktop */}
          <div className="hidden md:flex gap-2">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                isActive("/")
                  ? "bg-white text-orange-500 shadow-md"
                  : "text-white hover:bg-orange-600"
              }`}
            >
              Home
            </Link>
            <Link
              to="/bookmark"
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                isActive("/bookmark")
                  ? "bg-white text-orange-500 shadow-md"
                  : "text-white hover:bg-orange-600"
              }`}
            >
              Bookmark
            </Link>
          </div>

          {/* Tombol Mobile */}
          <button
            onClick={() => setMenu(true)}
            className="md:hidden text-white text-3xl p-1"
          >
            <TiThMenu />
          </button>
        </div>
      </nav>

      {/* Menu Mobile Overlay - Dibuat Slide dari Kanan */}
      <div
        className={`fixed inset-0 z-[110] bg-orange-400 transition-transform duration-300 ease-in-out transform ${
          menu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-6 border-b border-orange-500">
          <span className="text-white font-bold text-xl tracking-tight text-center w-full ml-8">
            MENU
          </span>
          <button
            onClick={() => setMenu(false)}
            className="text-white text-4xl"
          >
            <IoClose />
          </button>
        </div>

        <div className="flex flex-col p-6 gap-4">
          <Link
            to="/"
            className={`text-2xl font-bold p-4 rounded-2xl ${isActive("/") ? "bg-white text-orange-600 shadow-lg" : "text-white"}`}
          >
            Home
          </Link>
          <Link
            to="/bookmark"
            className={`text-2xl font-bold p-4 rounded-2xl ${isActive("/bookmark") ? "bg-white text-orange-600 shadow-lg" : "text-white"}`}
          >
            Bookmark
          </Link>
        </div>
      </div>
    </>
  );
}
