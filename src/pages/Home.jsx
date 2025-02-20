import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
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
    const response = await axios("https://equran.id/api/v2/surat");
    setSurat(response.data.data);
    setSuratFiltered(response.data.data);
    setLoading(false);
  };

  const getNext = () => {
    // return;
    const nomorSuratTerakhir = parseInt(tanda.split("--")[0]);
    const ayatTerakhir = parseInt(tanda.split("--")[1]); // misal 4

    const jumlahAyatDalamSurat = surat.find(
      (e) => e.nomor == nomorSuratTerakhir
    ).jumlahAyat; //misal 128 ayat

    if (ayatTerakhir < jumlahAyatDalamSurat) {
      return {
        nomorSuratSelanjutnya: nomorSuratTerakhir,
        ayatSelanjutnya: ayatTerakhir + 1,
      };
    } else if (
      ayatTerakhir >= jumlahAyatDalamSurat &&
      nomorSuratTerakhir < 114
    ) {
      return {
        nomorSuratSelanjutnya: nomorSuratTerakhir + 1,
        ayatSelanjutnya: 1,
      };
    } else {
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
    const next = getNext();
    const newUrl =
      "/detail/" +
      next.nomorSuratSelanjutnya +
      "#" +
      next.nomorSuratSelanjutnya +
      "--" +
      next.ayatSelanjutnya;
    navigate(newUrl);
  };

  useEffect(() => {
    setSuratFiltered(
      cari == ""
        ? surat
        : surat.filter(
            (f) =>
              f.namaLatin.toLowerCase().includes(cari) ||
              f.arti.toLowerCase().includes(cari)
          )
    );
  }, [cari]);

  useEffect(() => {
    getSurat();
  }, []);

  return (
    <div className="">
      {loading && <Loading />}
      <div>
        <Hero />
        <div className="mb-4 flex gap-3">
          <input
            onChange={(e) => setCari(e.target.value)}
            type="text"
            className="w-full px-4 py-2 rounded-full focus:outline-none focus:shadow focus:shadow-[#fff6f1] hidden md:block"
            placeholder="Cari"
          />
          <button
            onClick={handleLanjutBaca}
            className="bg-[#f7aa79] hover:bg-[#fdb88d] text-white md:w-72 w-full flex justify-center items-center px-4 py-2 rounded-full"
          >
            Lanjutkan Membaca
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {suratFiltered.map((e) => (
            <Link
              key={e.nomor}
              to={`/detail/${e.nomor}`}
              className="bg-white hover:shadow-xl hover:shadow-[#fff6f1] rounded-3xl p-4"
            >
              <div className="flex justify-between">
                <div>
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 border-2 border-[#f7aa79]">
                      <div className="w-10 h-10 border-2 border-[#f7aa79] rotate-45 flex justify-center items-center">
                        <p className="-rotate-45 font-bold">{e.nomor}</p>
                      </div>
                    </div>
                    <div>
                      <h1 className="font-bold">{e.namaLatin}</h1>
                      <p>({e.arti})</p>
                    </div>
                  </div>
                </div>
                <h1 className="font-arab text-3xl">{e.nama}</h1>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
