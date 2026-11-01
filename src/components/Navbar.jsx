import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { MdOutlineBookmarkBorder, MdMenu, MdClose } from "react-icons/md";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
  useAuth,
} from "@clerk/clerk-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

// Komponen helper untuk otomatis menyimpan user ke Convex
function UserSync() {
  const { user } = useUser();
  const storeUser = useMutation(api.users.storeUser);

  useEffect(() => {
    if (user) {
      storeUser({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress || "",
        name: user.fullName || user.firstName || "",
        imageUrl: user.imageUrl || "", // Kirim URL foto profil
      });
    }
  }, [user, storeUser]);

  return null;
}

export default function Navbar() {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const { isSignedIn, isLoaded } = useAuth(); // Tambahkan useAuth untuk melacak status muat clerk

  // Ambil data detail user (termasuk role) dari Convex berdasarkan clerkId
  const dbUser = useQuery(
    api.users.getCurrentUser,
    user ? { clerkId: user.id } : "skip",
  );

  const checkActive = (path) => {
    if (path === "/") return pathname === "/";
    if (path === "/surah") {
      return pathname.startsWith("/surah") || pathname.includes("/detail");
    }
    return pathname.startsWith(path);
  };

  const closeMenu = () => setIsOpen(false);
  const userName = user?.fullName || user?.firstName || "User";
  const userRole = dbUser?.role || "user"; // Ambil role dari database Convex

  return (
    <>
      <SignedIn>
        <UserSync />
      </SignedIn>

      <nav className="fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md z-[100] border-b border-gray-100 flex items-center shadow-sm">
        <div className="max-w-7xl mx-auto w-full px-6 flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
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
              className={`font-bold text-sm transition-all ${
                checkActive("/bookmark")
                  ? "text-orange-600 scale-105"
                  : "text-gray-500 hover:text-orange-400"
              }`}
            >
              Bookmark
            </Link>

            {userRole === "admin" && (
              <Link
                to="/users"
                className={`font-bold text-sm transition-all ${
                  checkActive("/users")
                    ? "text-orange-600 scale-105"
                    : "text-purple-600 hover:text-purple-400"
                }`}
              >
                Data Users ✨
              </Link>
            )}
          </div>

          {/* Auth Section (Desktop) - Menggunakan pengecekan isLoaded & isSignedIn agar tombol aman terpanggil */}
          <div className="hidden md:flex items-center gap-3">
            {isLoaded && !isSignedIn && (
              <SignInButton mode="modal">
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-md shadow-orange-500/20">
                  Login / Register
                </button>
              </SignInButton>
            )}

            {isLoaded && isSignedIn && (
              <div className="flex items-center gap-3 bg-orange-50/60 border border-orange-100 px-3 py-1.5 rounded-2xl max-w-[220px]">
                <div className="flex flex-col text-right w-full overflow-hidden">
                  <span
                    className="text-xs font-bold text-gray-700 truncate"
                    title={userName}
                  >
                    {userName}
                  </span>
                  <span className="text-[10px] font-extrabold text-orange-500 uppercase tracking-wider">
                    {userRole}
                  </span>
                </div>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-8 h-8 rounded-xl",
                    },
                  }}
                />
              </div>
            )}
          </div>

          {/* Mobile Toggle & Auth Button Preview */}
          <div className="flex md:hidden items-center gap-3">
            {isLoaded && isSignedIn && <UserButton />}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600 hover:text-orange-500 transition-colors focus:outline-none"
              aria-label="Menu"
            >
              {isOpen ? <MdClose size={26} /> : <MdMenu size={26} />}
            </button>
          </div>
        </div>

        {/* Dropdown Menu Mobile */}
        {isOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-100 shadow-xl p-6 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-300 md:hidden">
            <Link
              to="/"
              onClick={closeMenu}
              className={`font-bold text-sm py-2 px-4 rounded-xl transition-all ${
                checkActive("/")
                  ? "bg-orange-50 text-orange-600"
                  : "text-gray-600"
              }`}
            >
              Home
            </Link>
            <Link
              to="/surah"
              onClick={closeMenu}
              className={`font-bold text-sm py-2 px-4 rounded-xl transition-all ${
                checkActive("/surah")
                  ? "bg-orange-50 text-orange-600"
                  : "text-gray-600"
              }`}
            >
              Surat
            </Link>
            <Link
              to="/doa"
              onClick={closeMenu}
              className={`font-bold text-sm py-2 px-4 rounded-xl transition-all ${
                checkActive("/doa")
                  ? "bg-orange-50 text-orange-600"
                  : "text-gray-600"
              }`}
            >
              Doa
            </Link>
            <Link
              to="/jadwal"
              onClick={closeMenu}
              className={`font-bold text-sm py-2 px-4 rounded-xl transition-all ${
                checkActive("/jadwal")
                  ? "bg-orange-50 text-orange-600"
                  : "text-gray-600"
              }`}
            >
              Jadwal Sholat
            </Link>
            <Link
              to="/bookmark"
              onClick={closeMenu}
              className={`font-bold text-sm py-2 px-4 rounded-xl transition-all ${
                checkActive("/bookmark")
                  ? "bg-orange-50 text-orange-600"
                  : "text-gray-600"
              }`}
            >
              Bookmark
            </Link>
            {userRole === "admin" && (
              <Link
                to="/users"
                onClick={closeMenu}
                className={`font-bold text-sm py-2 px-4 rounded-xl transition-all ${
                  checkActive("/users")
                    ? "bg-orange-50 text-orange-600"
                    : "text-gray-600"
                }`}
              >
                Data Users ✨
              </Link>
            )}

            <hr className="border-gray-100 my-1" />

            {/* Auth Section (Mobile) */}
            <div className="pt-2">
              {isLoaded && !isSignedIn && (
                <SignInButton mode="modal">
                  <button
                    onClick={closeMenu}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-orange-500/20 text-center"
                  >
                    Login / Register
                  </button>
                </SignInButton>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
