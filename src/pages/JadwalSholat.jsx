import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  MdOutlineAccessTime,
  MdLocationOn,
  MdOutlineSettings,
} from "react-icons/md";
import { Spin } from "antd";

export default function JadwalSholat() {
  const [jadwalFull, setJadwalFull] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const prov = localStorage.getItem("userProvinsi");
  const kota = localStorage.getItem("userKabKota");

  // Update waktu setiap menit untuk presisi highlight
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!prov || !kota) {
      setLoading(false);
      return;
    }

    const fetchJadwal = async () => {
      try {
        setLoading(true);
        const res = await axios.post(`https://equran.id/api/v2/shalat`, {
          provinsi: prov,
          kabkota: kota,
        });
        setJadwalFull(res.data.data);
      } catch (err) {
        console.error("Gagal mengambil jadwal:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJadwal();
  }, [prov, kota]);

  if (!prov || !kota) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-orange-100 text-orange-500 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-lg shadow-orange-100">
          <MdLocationOn size={45} />
        </div>
        <h2 className="text-2xl font-black text-gray-800 mb-2">
          Lokasi Belum Diatur
        </h2>
        <Link
          to="/settings"
          className="mt-8 flex items-center gap-2 px-8 py-4 bg-orange-500 text-white font-bold rounded-2xl shadow-xl shadow-orange-200 hover:bg-orange-600 transition-all active:scale-95"
        >
          <MdOutlineSettings size={20} /> Buka Pengaturan
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Spin size="large" />
      </div>
    );
  }

  const tanggalHariIni = new Date().getDate();
  const jadwalHariIni = jadwalFull?.jadwal.find(
    (j) => j.tanggal === tanggalHariIni,
  );

  const listWaktu = [
    { nama: "Imsak", waktu: jadwalHariIni?.imsak },
    { nama: "Subuh", waktu: jadwalHariIni?.subuh },
    { nama: "Dzuhur", waktu: jadwalHariIni?.dzuhur },
    { nama: "Ashar", waktu: jadwalHariIni?.ashar },
    { nama: "Maghrib", waktu: jadwalHariIni?.maghrib },
    { nama: "Isya", waktu: jadwalHariIni?.isya },
  ];

  // Logika mencari sholat berikutnya
  const getNextSholat = () => {
    const now = currentTime.getHours() * 60 + currentTime.getMinutes();

    const next = listWaktu.find((item) => {
      if (!item.waktu) return false;
      const [jam, menit] = item.waktu.split(":").map(Number);
      const waktuSholat = jam * 60 + menit;
      return waktuSholat > now;
    });

    // Jika sudah lewat Isya, maka yang berikutnya adalah Imsak besok (tapi kita highlight Imsak saja dulu)
    return next ? next.nama : "Imsak";
  };

  const nextSholatName = getNextSholat();

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto pb-24 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col items-center text-center mb-10">
        <div className="p-5 bg-orange-500 text-white rounded-[2rem] shadow-2xl shadow-orange-200 mb-6 animate-pulse">
          <MdOutlineAccessTime size={45} />
        </div>
        <h1 className="text-3xl font-black text-gray-800 tracking-tighter">
          Jadwal Sholat
        </h1>
        <p className="text-orange-500 font-bold flex items-center gap-1 mt-2 bg-orange-50 px-4 py-1 rounded-full text-sm">
          <MdLocationOn size={16} /> {kota}
        </p>
      </div>

      <div className="mt-12 p-6 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200 text-center">
        <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em]">
          {jadwalHariIni?.hari}, {jadwalHariIni?.tanggal_lengkap}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {listWaktu.map((w, idx) => {
          const isNext = w.nama === nextSholatName;
          return (
            <div
              key={idx}
              className={`p-6 rounded-[2.5rem] border transition-all duration-500 flex flex-col items-center justify-center relative overflow-hidden ${
                isNext
                  ? "bg-orange-500 border-orange-400 shadow-xl shadow-orange-200 scale-105 z-10"
                  : "bg-white border-gray-50 shadow-sm opacity-80"
              }`}
            >
              {isNext && (
                <div className="absolute top-2 right-4">
                  <span className="text-[8px] font-black bg-white text-orange-500 px-2 py-0.5 rounded-full animate-bounce">
                    NEXT
                  </span>
                </div>
              )}
              <span
                className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isNext ? "text-orange-100" : "text-gray-400"}`}
              >
                {w.nama}
              </span>
              <span
                className={`text-3xl font-black ${isNext ? "text-white" : "text-gray-800"}`}
              >
                {w.waktu}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
