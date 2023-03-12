import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Home() {
  const [surat, setSurat] = useState([]);

  const getSurat = async () => {
    const response = await axios("https://equran.id/api/v2/surat");
    setSurat(response.data.data);
  };

  useEffect(() => {
    getSurat();
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-[1080px] mx-auto px-3 py-4 mt-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {surat.map((e) => (
            <Link
              key={e.nomor}
              to={`/detail/${e.nomor}`}
              className="bg-white rounded-lg px-4 py-3 shadow-sm"
            >
              <div className="flex justify-between">
                <h1 className="text-xl font-bold text-teal-500">{e.nomor}. {e.namaLatin}</h1>
                <h1 className="font-arab text-3xl text-teal-500">
                  {e.nama}
                </h1>
              </div>
                <hr />
              <p className="">Artinya: {e.arti}</p>
              <p>Jumlah Ayat: {e.jumlahAyat}</p>
              <p>Tempat Turunnya di {e.tempatTurun}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
