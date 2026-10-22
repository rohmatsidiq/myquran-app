import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { HiOutlineHome, HiOutlineBookOpen } from "react-icons/hi";
import {
  MdOutlineAccessTime,
  MdOutlineMenuBook,
  MdOutlineSettings,
} from "react-icons/md";
import { FaPlay } from "react-icons/fa"; // Menggunakan ikon play/lanjut

export default function NavMobile() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const tanda = localStorage.getItem("tanda");

  const checkActive = (path) => {
    if (path === "/") return pathname === "/";
    if (path === "/surah") {
      return pathname.startsWith("/surah") || pathname.includes("/detail");
    }
    return pathname.startsWith(path);
  };

  // Logika hitung ayat selanjutnya (sama seperti di Surah.jsx)
  const handleLanjutBaca = async () => {
    if (!tanda) {
      navigate("/detail/1#1--1");
      return;
    }

    const [nomorSuratTerakhir, ayatTerakhir] = tanda.split("--").map(Number);

    try {
      const res = await axios(
        `https://equran.id/api/v2/surat/${nomorSuratTerakhir}`,
      );
      const jumlahAyat = res.data.data.jumlahAyat;

      let targetSurat = nomorSuratTerakhir;
      let targetAyat = ayatTerakhir;

      if (ayatTerakhir < jumlahAyat) {
        targetAyat = ayatTerakhir + 1;
      } else if (nomorSuratTerakhir < 114) {
        targetSurat = nomorSuratTerakhir + 1;
        targetAyat = 1;
      }

      navigate(`/detail/${targetSurat}#${targetSurat}--${targetAyat}`);
    } catch (error) {
      navigate(
        `/detail/${nomorSuratTerakhir}#${nomorSuratTerakhir}--${ayatTerakhir + 1}`,
      );
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] md:hidden">
      <div className="bg-white/95 backdrop-blur-lg border-t border-gray-100 flex justify-around items-center  shadow-[0_-8px_30px_rgba(0,0,0,0.08)] rounded-t-[2rem] relative">
        {/* Menu Kiri 1: Home */}
        <Link
          to="/"
          className={`flex flex-col items-center gap-1 transition-all duration-300 relative ${
            checkActive("/")
              ? "text-orange-500 font-black scale-105"
              : "text-gray-400 hover:text-orange-300"
          }`}
        >
          <HiOutlineHome size={22} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">
            Home
          </span>
        </Link>

        {/* Menu Kiri 2: Surat */}
        <Link
          to="/surah"
          className={`flex flex-col items-center gap-1 transition-all duration-300 relative ${
            checkActive("/surah")
              ? "text-orange-500 font-black scale-105"
              : "text-gray-400 hover:text-orange-300"
          }`}
        >
          <HiOutlineBookOpen size={22} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">
            Surat
          </span>
        </Link>

        {/* TOMBOL TENGAH MENONJOL (Gaya QRIS / Action Button) */}
        <div className="flex flex-col items-center relative -top-4">
          <button
            onClick={handleLanjutBaca}
            className="w-14 h-14 bg-gradient-to-tr from-orange-500 to-orange-400 text-white rounded-full shadow-[0_8px_20px_rgba(249,115,22,0.4)] flex items-center justify-center transform active:scale-95 transition-all border-4 border-white"
          >
            <FaPlay size={20} className="translate-x-0.5" />
          </button>
          <span className="text-[10px] font-extrabold uppercase tracking-tighter text-orange-600 mt-1">
            Lanjut
          </span>
        </div>

        {/* Menu Kanan 1: Doa */}
        <Link
          to="/doa"
          className={`flex flex-col items-center gap-1 transition-all duration-300 relative ${
            checkActive("/doa")
              ? "text-orange-500 font-black scale-105"
              : "text-gray-400 hover:text-orange-300"
          }`}
        >
          <MdOutlineMenuBook size={22} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">
            Doa
          </span>
        </Link>

        {/* Menu Kanan 2: Jadwal */}
        <Link
          to="/jadwal"
          className={`flex flex-col items-center gap-1 transition-all duration-300 relative ${
            checkActive("/jadwal")
              ? "text-orange-500 font-black scale-105"
              : "text-gray-400 hover:text-orange-300"
          }`}
        >
          <MdOutlineAccessTime size={22} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">
            Jadwal
          </span>
        </Link>
      </div>
    </div>
  );
}
