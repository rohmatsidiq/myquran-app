import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MdOutlineSettings,
  MdLocationOn,
  MdOutlineWavingHand,
  MdOutlineInstallMobile,
  MdClose,
  MdOutlineBookmarkBorder,
} from "react-icons/md";
import { FaBookmark, FaPlay, FaArrowRight } from "react-icons/fa";
import NavMobile from "../components/NavMobile";

export default function Home() {
  const navigate = useNavigate();
  const [nextSholat, setNextSholat] = useState({ n: "-", w: "--:--" });
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");

  // State untuk menyimpan daftar bookmark dari localStorage
  const [bookmarks, setBookmarks] = useState([]);

  const kota = localStorage.getItem("userKabKota");
  const provinsi = localStorage.getItem("userProvinsi");
  const tanda = localStorage.getItem("tanda");

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)",
    ).matches;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
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

  // Ambil data Bookmark dari localStorage saat komponen dimuat
  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmark") || "[]");
    setBookmarks(savedBookmarks);
  }, []);

  // Fetch Jadwal Sholat
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
          }) || { n: "Subuh", w: jadwal.subuh };

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

  // Handler Lanjut Baca
  const handleLanjutBaca = () => {
    if (!tanda) {
      navigate("/detail/1");
      return;
    }
    const [nomorSuratTerakhir, ayatTerakhir] = tanda.split("--").map(Number);
    navigate(
      `/detail/${nomorSuratTerakhir}#${nomorSuratTerakhir}--${ayatTerakhir}`,
    );
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 px-4 pb-10 max-w-4xl mx-auto">
      {/* BANNER INSTALASI PWA */}
      {showInstallBanner && (
        <div className="mt-4 animate-in slide-in-from-top-10 duration-500">
          <div className="bg-gray-900 text-white p-4 rounded-[2rem] shadow-xl flex items-center justify-between gap-4 border border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center font-black text-lg shadow-lg shadow-orange-500/20">
                Q
              </div>
              <div>
                <h4 className="font-bold text-sm">Install MyQur'an</h4>
                <p className="text-[10px] opacity-60 font-medium">
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

      {/* GRID UTAMA: Jadwal Sholat & Quick Last Read Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* DASHBOARD SHOLAT NEXT SAJA (Memakan 2 Kolom) */}
        <div className="md:col-span-2">
          {!kota || !provinsi ? (
            <div className="p-8 bg-gray-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden flex flex-col items-center text-center h-full justify-center">
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
            <div className="p-8 bg-orange-500 rounded-[2.5rem] text-white shadow-xl shadow-orange-200 relative overflow-hidden flex flex-col items-center text-center justify-between h-full">
              <div className="absolute top-[-20px] left-[-20px] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-[-40px] right-[-40px] w-48 h-48 bg-black/5 rounded-full blur-3xl"></div>

              <div className="relative z-10 w-full">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-70 mb-2">
                  {kota}
                </p>
                <p className="text-sm font-bold opacity-90 mb-4">
                  Menjelang waktu{" "}
                  <span className="underline decoration-white/40 underline-offset-8">
                    {nextSholat.n}
                  </span>
                </p>
                <h1 className="text-5xl font-black mb-4 tracking-tighter italic">
                  {nextSholat.w ? nextSholat.w : "--:--"}
                </h1>
                <div>
                  <Link
                    to="/jadwal"
                    className="inline-block bg-white/20 hover:bg-white/30 backdrop-blur-md px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/20 active:scale-95"
                  >
                    Lihat Jadwal Lengkap
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* KARTU LANJUT BACA / QUICK ACTION */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-[2.5rem] text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl"></div>
          <div>
            <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-orange-400 mb-4">
              <FaPlay size={14} />
            </div>
            <h3 className="font-bold text-base mb-1">Lanjutkan Membaca</h3>
            <p className="text-xs text-gray-400">
              {tanda
                ? "Lanjutkan dari ayat terakhir yang ditandai."
                : "Mulai baca dari awal surat."}
            </p>
          </div>
          <button
            onClick={handleLanjutBaca}
            className="mt-6 w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-orange-500/20"
          >
            {tanda ? "Lanjut Baca" : "Mulai Baca"}
          </button>
        </div>
      </div>

      {/* CARD BOOKMARK TERBARU (WIDGET TAMBAHAN DI HOME) */}
      <div className="mt-6">
        <div className="p-6 md:p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-xl shadow-gray-200/20 relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center font-bold">
                <MdOutlineBookmarkBorder size={18} />
              </div>
              <h3 className="font-black text-gray-800 text-base">
                Bookmark Terakhir
              </h3>
            </div>
            <Link
              to="/bookmark"
              className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1 transition-all"
            >
              Lihat Semua <FaArrowRight size={10} />
            </Link>
          </div>

          {bookmarks.length === 0 ? (
            <div className="text-center py-8 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-xs text-gray-400 font-medium">
                Belum ada ayat yang disimpan ke bookmark.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {bookmarks
                .slice(-4)
                .reverse()
                .map((item, index) => (
                  <Link
                    key={index}
                    to={`/detail/${item.nomor}#${item.nomor}--${item.ayat}`}
                    className="p-4 bg-orange-50/40 hover:bg-orange-50 border border-orange-100/60 rounded-2xl transition-all flex items-center justify-between group"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-gray-800 group-hover:text-orange-600 transition-colors">
                        {item.surat}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Ayat {item.ayat}
                      </p>
                    </div>
                    <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-orange-400 shadow-sm">
                      <FaBookmark size={12} />
                    </div>
                  </Link>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* AYAT TENTANG PENURUNAN AL-QUR'AN (AL-BAQARAH: 185) */}
      <div className="mt-6">
        <div className="p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-xl shadow-gray-200/20 relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <span className="px-4 py-1.5 bg-orange-50 text-orange-500 rounded-xl text-[10px] font-black uppercase tracking-widest">
              Pilihan Ayat
            </span>
            <FaBookmark className="text-orange-200" size={18} />
          </div>

          <div className="text-center md:text-left">
            <p
              className="font-arab text-3xl sm:text-4xl text-gray-800 leading-[2.5] mb-6 text-right"
              dir="rtl"
            >
              شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ هُدًى لِلنَّاسِ
              وَبَيِّنَاتٍ مِّنَ الْهُدَىٰ وَالْفُرْقَانِ
            </p>
            <p className="italic text-gray-600 text-base sm:text-lg leading-relaxed py-1">
              "Bulan Ramadan adalah (bulan) yang di dalamnya diturunkan
              Al-Qur'an, sebagai petunjuk bagi manusia dan penjelasan-penjelasan
              mengenai petunjuk itu serta pembeda (antara yang hak dan yang
              batil)..."
            </p>
            <p className="mt-6 text-[10px] font-black text-orange-400 uppercase tracking-[0.3em] text-center md:text-left">
              Surat Al-Baqarah : 185
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-12 text-center">
        <p className="text-[9px] text-gray-300 font-black uppercase tracking-[0.8em]">
          MyQur'an App
        </p>
      </div>

      <NavMobile />
    </div>
  );
}
