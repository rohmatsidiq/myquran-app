import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";

export default function Home() {
  const [surat, setSurat] = useState([]);
  const [cari, setCari] = useState("");
  const [suratFiltered, setSuratFiltered] = useState([]);

  const getSurat = async () => {
    const response = await axios("https://equran.id/api/v2/surat");
    setSurat(response.data.data);
    setSuratFiltered(response.data.data);
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
    <>
      <div>
        <Hero />
        <input
          onChange={(e) => setCari(e.target.value)}
          type="text"
          className="w-full mb-4 px-4 py-2 rounded-full focus:outline-none focus:shadow focus:shadow-[#fff6f1] hidden md:block"
          placeholder="Cari"
        />
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
                    <div className="w-10 h-10 border-2 border-[#b3856b]">
                      <div className="w-10 h-10 border-2 border-[#b3856b] rotate-45 flex justify-center items-center">
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
    </>
  );
}
