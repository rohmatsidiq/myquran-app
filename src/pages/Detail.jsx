import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function Detail() {
  const { nomor } = useParams();
  const [ayat, setAyat] = useState([]);
  const [nama, setNama] = useState("");
  const [namaLatin, setNamaLatin] = useState("");
  const [arti, setArti] = useState("");
  const [audioFull, setAudioFull] = useState("");
  const getDetail = async () => {
    const response = await axios(`https://equran.id/api/v2/surat/${nomor}`);
    setNama(response.data.data.nama);
    setArti(response.data.data.arti);
    setNamaLatin(response.data.data.namaLatin);
    setAyat(response.data.data.ayat);
    setAudioFull(response.data.data.audioFull["05"]);
  };
  useEffect(() => {
    getDetail();
  }, []);
  return (
    <>
      <div className="bg-teal-500 text-white py-3 w-screen drop-shadow-lg">
        <h1 className="text-5xl text-center font-arab my-3">{nama}</h1>
        <p className="text-lg text-center">
          {namaLatin} - {arti}
        </p>
        <div className="flex justify-center w-full mt-2">
          <audio controls src={audioFull} preload="none"></audio>
        </div>
      </div>
      <div className="max-w-[1080px] mx-auto px-3 py-4">
        {ayat.map((e) => (
          <div
            key={e.nomorAyat}
            className="mt-5 bg-white py-4 px-5 rounded-lg shadow-sm"
          >
            <p className="font-arab text-end my-5 text-2xl leading-[60px]">
              {e.teksArab}
            </p>
            <p>
              <i>
                {e.nomorAyat}. {e.teksIndonesia}
              </i>
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
