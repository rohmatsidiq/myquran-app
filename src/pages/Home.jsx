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
} from "react-icons/md";

export default function Home() {
  const [nextSholat, setNextSholat] = useState({ nama: "-", waktu: "--:--" });
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");

  // Ambil data dari localStorage
  const kota = localStorage.getItem("userKabKota");
  const provinsi = localStorage.getItem("userProvinsi");

  // 1. Logika Greeting (Ucapan Selamat)
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 11) setGreeting("Selamat Pagi");
    else if (hour < 15) setGreeting("Selamat Siang");
    else if (hour < 19) setGreeting("Selamat Sore");
    else setGreeting("Selamat Malam");
  }, []);

  // 2. Fetch jadwal sholat
  useEffect(() => {
    const fetchJadwal = async () => {
      // Jika lokasi belum di-set, jangan fetch
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

          const next =
            times.find((t) => {
              const [h, m] = t.w.split(":").map(Number);
              return h * 60 + m > currentMinutes;
            }) || times[0];

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
      icon: <HiOutlineBookOpen className="text-[24px] sm:text-[50px]" />,
      path: "/surah",
      color: "text-orange-500",
    },
    {
      title: "Doa Harian",
      icon: <MdOutlineMenuBook className="text-[24px] sm:text-[50px]" />,
      path: "/doa",
      color: "text-orange-500",
    },
    {
      title: "Jadwal",
      icon: <MdOutlineAccessTime className="text-[24px] sm:text-[50px]" />,
      path: "/jadwal",
      color: "text-orange-500",
    },
    {
      title: "Bookmark",
      icon: <MdOutlineBookmarkBorder className="text-[24px] sm:text-[50px]" />,
      path: "/bookmark",
      color: "text-orange-500",
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 px-4">
      {/* Header Greeting */}
      <div className="mt-6 mb-6 flex justify-between items-center px-1">
        <div>
          <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            Assalamualaikum <MdOutlineWavingHand className="text-orange-400" />
          </h2>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">
            {greeting}
          </h1>
        </div>
        <Link
          to="/settings"
          className="w-10 h-10 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-orange-500 shadow-sm transition-all"
        >
          <MdOutlineSettings size={22} />
        </Link>
      </div>

      {/* DASHBOARD CARD SHOLAT */}
      {!kota || !provinsi ? (
        /* State Jika Lokasi Belum Diatur */
        <div className="p-8 bg-gray-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
          <div className="absolute top-[-20px] left-[-20px] w-32 h-32 bg-orange-500/20 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <MdLocationOn
              className="text-orange-400 mx-auto mb-3 animate-bounce"
              size={32}
            />
            <h3 className="text-lg font-bold mb-1">Lokasi Belum Diatur</h3>
            <p className="text-xs opacity-60 mb-6">
              Atur lokasi untuk melihat jadwal sholat akurat
            </p>
            <Link
              to="/settings"
              className="bg-orange-500 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-orange-900/40"
            >
              Atur Sekarang
            </Link>
          </div>
        </div>
      ) : loading ? (
        /* Skeleton Loading */
        <div className="h-48 bg-gray-100 rounded-[2.5rem] animate-pulse flex items-center justify-center">
          <p className="text-gray-300 font-bold text-xs uppercase tracking-widest">
            Menyinkronkan...
          </p>
        </div>
      ) : (
        /* Real Dashboard Sholat */
        <div className="p-8 bg-orange-500 rounded-[2.5rem] text-white shadow-2xl shadow-orange-200 relative overflow-hidden flex flex-col items-center text-center transition-all">
          <div className="absolute top-[-20px] left-[-20px] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-[-40px] right-[-40px] w-48 h-48 bg-black/5 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2 flex items-center justify-center gap-1">
              <MdLocationOn /> {kota}
            </p>
            <h1 className="text-6xl font-black mb-1 tracking-tighter">
              {nextSholat.waktu}
            </h1>
            <p className="text-sm font-bold opacity-90">
              Menjelang waktu{" "}
              <span className="underline decoration-white/40 underline-offset-4">
                {nextSholat.n}
              </span>
            </p>
            <Link
              to="/jadwal"
              className="mt-6 inline-block bg-white/20 hover:bg-white/30 backdrop-blur-md px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/20"
            >
              Lihat Detail
            </Link>
          </div>
        </div>
      )}

      {/* MENU GRID */}
      <div className="mt-10">
        <div className="flex items-center gap-2 mb-6 px-1">
          <span className="w-1.5 h-6 bg-orange-400 rounded-full"></span>
          <h2 className="text-lg font-black text-gray-800 tracking-tight">
            Menu Utama
          </h2>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {features.map((f, i) => (
            <Link
              key={i}
              to={f.path}
              className="flex flex-col items-center gap-2.5 group"
            >
              <div className="bg-white w-full aspect-square rounded-[1.8rem] border border-gray-50 shadow-sm flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500 group-active:scale-90">
                {f.icon}
              </div>
              <span className="font-bold text-gray-500 text-[10px] uppercase tracking-tighter group-hover:text-orange-500 transition-colors">
                {f.title}
              </span>
            </Link>
          ))}
        </div>

        {/* AYAT HARI INI */}
        <div className="mt-10 group cursor-default">
          <div className="p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-xl shadow-gray-200/30 relative overflow-hidden transition-all duration-500 hover:shadow-orange-100/50">
            <div className="flex justify-between items-center mb-8">
              <span className="px-4 py-1.5 bg-orange-50 text-orange-500 rounded-xl text-[10px] font-black uppercase tracking-widest">
                Ayat Hari Ini
              </span>
              <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-200">
                <MdOutlineMenuBook size={18} />
              </div>
            </div>

            <div className="text-center md:text-left">
              <p
                className="font-arab text-4xl text-gray-800 leading-[2.2] mb-6 text-right"
                dir="rtl"
              >
                فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ
              </p>
              <div className="relative">
                <p className="italic text-gray-500 text-lg leading-relaxed border-l-4 border-orange-400 pl-4 py-1">
                  "Maka nikmat Tuhanmu yang manakah yang kamu dustakan?"
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-center md:justify-start gap-3">
                <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">
                  Surat Ar-Rahman : 13
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-10 mb-3 text-center space-y-2">
          <p className="text-[9px] text-gray-300 font-black uppercase tracking-[0.6em]">
            MyQur'an Digital v2.0
          </p>
          <div className="h-1 w-12 bg-gray-100 mx-auto rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
