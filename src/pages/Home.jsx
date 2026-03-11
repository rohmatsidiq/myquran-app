import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { HiOutlineBookOpen } from "react-icons/hi";
import {
  MdOutlineAccessTime,
  MdOutlineBookmarkBorder,
  MdOutlineMenuBook,
  MdOutlineSettings,
  MdLocationOn,
  MdOutlineWavingHand,
  MdOutlineInstallMobile,
  MdClose,
} from "react-icons/md";

export default function Home() {
  const [nextSholat, setNextSholat] = useState({ n: "-", w: "--:--" });
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");

  const kota = localStorage.getItem("userKabKota");
  const provinsi = localStorage.getItem("userProvinsi");

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    // 1. Cek apakah sudah dalam mode aplikasi (standalone)
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)",
    ).matches;

    // 2. Tangkap event instalasi
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Hanya munculkan banner jika belum terinstal
      if (!isStandalone) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    }
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 11) setGreeting("Selamat Pagi");
    else if (hour < 15) setGreeting("Selamat Siang");
    else if (hour < 19) setGreeting("Selamat Sore");
    else setGreeting("Selamat Malam");
  }, []);

  useEffect(() => {
    const fetchJadwal = async () => {
      if (!kota || !provinsi) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await axios.post(`https://equran.id/api/v2/shalat`, {
          provinsi: provinsi,
          kabkota: kota,
        });
        const hariIni = new Date().getDate();
        const jadwal = res.data.data.jadwal.find((j) => j.tanggal === hariIni);

        if (jadwal) {
          const now = new Date();
          const currentMinutes = now.getHours() * 60 + now.getMinutes();
          const times = [
            { n: "Subuh", w: jadwal.subuh },
            { n: "Dzuhur", w: jadwal.dzuhur },
            { n: "Ashar", w: jadwal.ashar },
            { n: "Maghrib", w: jadwal.maghrib },
            { n: "Isya", w: jadwal.isya },
          ];

          const next = times.find((t) => {
            const [h, m] = t.w.split(":").map(Number);
            return h * 60 + m > currentMinutes;
          }) || { n: "Subuh", w: jadwal.subuh }; // Default ke Subuh jika sudah lewat Isya

          setNextSholat(next);
        }
      } catch (err) {
        console.error("Gagal ambil jadwal");
      } finally {
        setLoading(false);
      }
    };
    fetchJadwal();
  }, [kota, provinsi]);

  const features = [
    {
      title: "Baca Surat",
      icon: <HiOutlineBookOpen className="text-[26px] sm:text-[36px]" />,
      path: "/surah",
    },
    {
      title: "Doa Harian",
      icon: <MdOutlineMenuBook className="text-[26px] sm:text-[36px]" />,
      path: "/doa",
    },
    {
      title: "Jadwal",
      icon: <MdOutlineAccessTime className="text-[26px] sm:text-[36px]" />,
      path: "/jadwal",
    },
    {
      title: "Bookmark",
      icon: <MdOutlineBookmarkBorder className="text-[26px] sm:text-[36px]" />,
      path: "/bookmark",
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 px-4 pb-12">
      {/* BANNER INSTALASI PWA */}
      {showInstallBanner && (
        <div className="mt-4 animate-in slide-in-from-top-10 duration-500">
          <div className="bg-gray-900 text-white p-4 rounded-[2rem] shadow-xl flex items-center justify-between gap-4 border border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center font-black text-lg shadow-lg shadow-orange-500/20">
                Q
              </div>
              <div>
                <h4 className="font-bold">Install MyQur'an</h4>
                <p className="text-[9px] opacity-60 font-medium">
                  Akses lebih cepat & ringan
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleInstallClick}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-[10px] font-black transition-all active:scale-95 flex items-center gap-1"
              >
                <MdOutlineInstallMobile size={14} /> INSTALL
              </button>
              <button
                onClick={() => setShowInstallBanner(false)}
                className="p-2 text-gray-500 hover:text-white"
              >
                <MdClose size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Greeting */}
      <div className="mt-6 mb-6 flex justify-between items-center px-1">
        <div>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
            Assalamualaikum <MdOutlineWavingHand className="text-orange-400" />
          </p>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">
            {greeting}
          </h1>
        </div>
        <Link
          to="/settings"
          className="w-11 h-11 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-orange-500 shadow-sm transition-all active:scale-90"
        >
          <MdOutlineSettings size={22} />
        </Link>
      </div>

      {/* DASHBOARD SHOLAT NEXT SAJA */}
      {!kota || !provinsi ? (
        <div className="p-8 bg-gray-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
          <div className="absolute top-[-20px] left-[-20px] w-32 h-32 bg-orange-500/20 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <MdLocationOn
              className="text-orange-400 mx-auto mb-3 animate-bounce"
              size={32}
            />
            <h3 className="text-lg font-bold mb-1 tracking-tight">
              Lokasi Belum Diatur
            </h3>
            <p className="text-[10px] opacity-50 mb-6 uppercase font-bold tracking-widest">
              Pilih wilayah Anda
            </p>
            <Link
              to="/settings"
              className="bg-orange-500 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-900/40 active:scale-95 transition-all"
            >
              Atur Sekarang
            </Link>
          </div>
        </div>
      ) : loading ? (
        <div className="h-52 bg-gray-50 rounded-[2.5rem] animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="p-8 bg-orange-500 rounded-[2.5rem] text-white shadow-2xl shadow-orange-200 relative overflow-hidden flex flex-col items-center text-center">
          <div className="absolute top-[-20px] left-[-20px] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-[-40px] right-[-40px] w-48 h-48 bg-black/5 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-70 mb-2 flex items-center justify-center gap-1">
              {kota}
            </p>
            <p className="text-sm font-bold opacity-90 mb-8">
              Menjelang waktu{" "}
              <span className="underline decoration-white/40 underline-offset-8">
                {nextSholat.n}
              </span>
            </p>
            <h1 className="text-5xl font-black mb-1 tracking-tighter italic">
              {nextSholat.w ? nextSholat.w : "--:--"}
            </h1>
            <Link
              to="/jadwal"
              className="mt-8 inline-block bg-white/20 hover:bg-white/30 backdrop-blur-md px-8 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/20 active:scale-95"
            >
              Detail Jadwal
            </Link>
          </div>
        </div>
      )}

      {/* MENU GRID */}
      <div className="mt-10 px-1">
        <div className="grid grid-cols-4 gap-4">
          {features.map((f, i) => (
            <Link
              key={i}
              to={f.path}
              className="flex flex-col items-center gap-3 group"
            >
              <div className="bg-white w-full aspect-square rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500 group-active:scale-90 shadow-orange-100/10">
                {f.icon}
              </div>
              <span className="font-black text-gray-400 text-[9px] uppercase tracking-tighter group-hover:text-orange-500 transition-colors">
                {f.title}
              </span>
            </Link>
          ))}
        </div>

        {/* AYAT HARI INI */}
        <div className="mt-12 group">
          <div className="p-8 bg-white border border-gray-50 rounded-[3rem] shadow-xl shadow-gray-200/20 relative overflow-hidden">
            <div className="flex justify-between items-center mb-10">
              <span className="px-4 py-1.5 bg-orange-50 text-orange-500 rounded-xl text-[10px] font-black uppercase tracking-widest">
                Ayat Hari Ini
              </span>
              <MdOutlineBookmarkBorder size={20} className="text-orange-200" />
            </div>

            <div className="text-center md:text-left">
              <p
                className="font-arab text-4xl text-gray-800 leading-[2.2] mb-8 text-right"
                dir="rtl"
              >
                فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ
              </p>
              <p className="italic text-gray-500 text-lg leading-relaxed border-l-[3px] border-orange-400 pl-4 py-1">
                "Maka nikmat Tuhanmu yang manakah yang kamu dustakan?"
              </p>
              <p className="mt-8 text-[10px] font-black text-orange-300 uppercase tracking-[0.3em] text-center">
                Surat Ar-Rahman : 13
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-16 text-center">
          <p className="text-[9px] text-gray-300 font-black uppercase tracking-[0.8em]">
            MyQur'an App
          </p>
        </div>
      </div>
    </div>
  );
}
