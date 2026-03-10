import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import Loading from "../components/Loading";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [surat, setSurat] = useState([]);
  const [cari, setCari] = useState("");
  const [suratFiltered, setSuratFiltered] = useState([]);
  const navigate = useNavigate();
  const tanda = localStorage.getItem("tanda");

  const getSurat = async () => {
    setLoading(true);
    try {
      const response = await axios("https://equran.id/api/v2/surat");
      setSurat(response.data.data);
      setSuratFiltered(response.data.data);
    } catch (error) {
      console.error("Error fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getNext = () => {
    if (!tanda) return null;

    const [nomorSuratTerakhir, ayatTerakhir] = tanda.split("--").map(Number);

    // Cari data surat tersebut untuk tahu jumlah ayatnya
    const dataSurat = surat.find((e) => e.nomor === nomorSuratTerakhir);
    if (!dataSurat) return { nomorSuratSelanjutnya: 1, ayatSelanjutnya: 1 };

    const jumlahAyatDalamSurat = dataSurat.jumlahAyat;

    if (ayatTerakhir < jumlahAyatDalamSurat) {
      // Jika belum ayat terakhir di surat itu, lanjut ke ayat berikutnya
      return {
        nomorSuratSelanjutnya: nomorSuratTerakhir,
        ayatSelanjutnya: ayatTerakhir + 1,
      };
    } else if (nomorSuratTerakhir < 114) {
      // Jika sudah ayat terakhir, lanjut ke Surat berikutnya ayat 1
      return {
        nomorSuratSelanjutnya: nomorSuratTerakhir + 1,
        ayatSelanjutnya: 1,
      };
    } else {
      // Jika sudah surat terakhir ayat terakhir
      return {
        nomorSuratSelanjutnya: 114,
        ayatSelanjutnya: ayatTerakhir,
      };
    }
  };

  const handleLanjutBaca = () => {
    if (!tanda) {
      navigate("/detail/1");
      return;
    }

    const next = getNext(); // Memanggil logika perhitungan ayat selanjutnya

    if (next) {
      const newUrl =
        "/detail/" +
        next.nomorSuratSelanjutnya +
        "#" +
        next.nomorSuratSelanjutnya +
        "--" +
        next.ayatSelanjutnya;
      navigate(newUrl);
    }
  };

  useEffect(() => {
    const hasil = surat.filter(
      (f) =>
        f.namaLatin.toLowerCase().includes(cari.toLowerCase()) ||
        f.arti.toLowerCase().includes(cari.toLowerCase()),
    );
    setSuratFiltered(hasil);
  }, [cari, surat]);

  useEffect(() => {
    getSurat();
  }, []);

  return (
    <div className="min-h-screen">
      {loading && <Loading />}

      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Main Content Wrapper */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* 3. Search & Action Bar - Disederhanakan agar tidak berantakan */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-10">
          <div className="relative flex-1 w-full">
            <input
              onChange={(e) => setCari(e.target.value)}
              type="text"
              placeholder="Cari surat (contoh: Al-Fatihah)"
              className="w-full pl-12 pr-4 py-4 bg-white shadow-sm border border-orange-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <button
            onClick={handleLanjutBaca}
            className="w-full md:w-auto bg-orange-400 text-white font-bold px-8 py-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9 4.804A7.993 7.993 0 002 12a7.998 7.998 0 003 6.318V19a1 1 0 001 1h8a1 1 0 001-1v-0.682A7.998 7.998 0 0018 12a7.993 7.993 0 00-7-7.196V10a1 1 0 01-2 0V4.804z" />
            </svg>
            Lanjut Baca
          </button>
        </div>

        {/* 4. Grid Surat */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {suratFiltered.map((e) => (
            <Link
              key={e.nomor}
              to={`/detail/${e.nomor}`}
              className="group bg-white p-5 rounded-2xl border border-transparent hover:border-orange-200 hover:shadow-xl transition-all duration-300 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                {/* Nomor dengan style kotak modern */}
                <div className="w-12 h-12 flex-shrink-0 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center font-bold group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  {e.nomor}
                </div>

                <div>
                  <h3 className="font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                    {e.namaLatin}
                  </h3>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                    {e.arti} • {e.jumlahAyat} Ayat
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-arab text-2xl text-orange-600">
                  {e.nama}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* 5. Empty State */}
        {suratFiltered.length === 0 && !loading && (
          <div className="text-center py-20 bg-white rounded-3xl mt-10 shadow-inner">
            <p className="text-gray-400">Pencarian "{cari}" tidak ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
}
