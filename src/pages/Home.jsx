import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";

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
      <div className="max-w-[1080px] mx-auto px-3 py-4 mt-24">
        <Hero />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {surat.map((e) => (
            <Link
              key={e.nomor}
              to={`/detail/${e.nomor}`}
              className="bg-white rounded-lg px-4 py-3 shadow-sm"
            >
              <div className="flex justify-between">
                <div>
                  <h1 className="text-xl font-bold textblack">
                    {e.nomor}. {e.namaLatin}
                  </h1>
                  <p>({e.arti})</p>
                </div>
                <h1 className="font-arab text-3xl textblack">{e.nama}</h1>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
