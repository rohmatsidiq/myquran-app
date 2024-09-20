import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function Detail() {
  const { nomor } = useParams();
  const [ayat, setAyat] = useState([]);
  const [nama, setNama] = useState("");
  const [namaLatin, setNamaLatin] = useState("");
  const [arti, setArti] = useState("");
  const [audioFull, setAudioFull] = useState("");
  const [nomorSurat, setNomorSurat] = useState(0);
  const [allSurat, setAllSurat] = useState([]);
  const getDetail = async () => {
    const response = await axios(`https://equran.id/api/v2/surat/${nomor}`);
    setNama(response.data.data.nama);
    setArti(response.data.data.arti);
    setNamaLatin(response.data.data.namaLatin);
    setAyat(response.data.data.ayat);
    setNomorSurat(response.data.data.nomor);
    setAudioFull(response.data.data.audioFull["05"]);
  };

  const getAllSurat = async () => {
    const response = await axios("https://equran.id/api/v2/surat");
    setAllSurat(response.data.data);
  };

  useEffect(() => {
    getDetail();
    getAllSurat();
  }, [nomor]);

  return (
    <div className="grid md:grid-cols-4 gap-3 h-full">
      <div
        style={{ height: `calc(100vh - 92px)` }}
        className="bg-white rounded-3xl p-4 hidden md:flex overflow-y-scroll flex-col gap-3"
      >
        {allSurat.map((e, i) => (
          <Link
            to={"/detail/" + e.nomor}
            id={`list--${nomor}`}
            className={`border flex gap-4 p-4 rounded-xl hover:bg-[#ffe3d1] ${
              nomor == e.nomor && "bg-[#ffe3d1]"
            }`}
            key={i}
          >
            <div className="w-10 h-10 border-2 border-[#f7aa79]">
              <div className="w-10 h-10 border-2 border-[#f7aa79] rotate-45 flex justify-center items-center">
                <p className="-rotate-45 font-bold">{e.nomor}</p>
              </div>
            </div>
            <div>
              <h3>{e.namaLatin}</h3>
              <small>{e.arti}</small>
            </div>
          </Link>
        ))}
      </div>
      <div
        style={{ height: `calc(100vh - 92px)` }}
        className="col-span-1 md:col-span-3 overflow-y-scroll"
      >
        <div className="bg-[#f7aa79] text-white py-3 mb-3 p-5 rounded-3xl">
          <div className="flex justify-between">
            <div className="flex-row md:flex-col gap-3 items-center">
              <h1 className="text-xl font-arab my-3">{nama}</h1>
              <div className="flex gap-2">
                <p className="text-lg text-center">{namaLatin}</p>
                <p className="text-lg text-center">({arti})</p>
              </div>
            </div>
            <div className="w-10 h-10 border-2 border-white mr-4 mt-4">
              <div className="w-10 h-10 border-2 border-white rotate-45 flex justify-center items-center">
                <p className="-rotate-45 font-bold">{nomor}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center w-full mt-5 mb-3">
            <audio
              controls
              src={audioFull}
              preload="none"
              className="h-7 w-full"
            ></audio>
          </div>
        </div>
        <div>
          {ayat.map((e) => (
            <div
              id={`${nomorSurat}--${e.nomorAyat}`}
              key={e.nomorAyat}
              className="bg-white mb-3 py-4 px-5 rounded-3xl"
            >
              <p className="font-arab text-end my-5 text-2xl leading-[60px]">
                {e.teksArab}
              </p>
              <p>
                <i>
                  {e.nomorAyat}. {e.teksIndonesia}
                </i>
              </p>
              <button>test</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
