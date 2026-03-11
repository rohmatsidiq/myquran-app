import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { FiBookmark, FiList } from "react-icons/fi";
import { MdContentPasteSearch } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { message, Modal, Tooltip } from "antd";
import Loading from "../components/Loading";

export default function Detail() {
  const { confirm } = Modal;
  const { nomor } = useParams();
  const scrollRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [ayat, setAyat] = useState([]);
  const [nama, setNama] = useState("");
  const [namaLatin, setNamaLatin] = useState("");
  const [arti, setArti] = useState("");
  const [audioFull, setAudioFull] = useState("");
  const [allSurat, setAllSurat] = useState([]);
  const [tafsir, setTafsir] = useState([]);
  const [viewTafsirByAyat, setViewTafsirByAyat] = useState(0);
  const [loading, setLoading] = useState(false);

  const currentFontSize = localStorage.getItem("fontSize") || 26;

  // 1. Ambil Detail Surat
  const getDetail = async () => {
    setLoading(true);
    try {
      const response = await axios(`https://equran.id/api/v2/surat/${nomor}`);
      const data = response.data.data;
      setNama(data.nama);
      setArti(data.arti);
      setNamaLatin(data.namaLatin);
      setAyat(data.ayat);
      setAudioFull(data.audioFull["05"]);
    } catch (err) {
      message.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  // 2. Ambil Data Pendukung (Daftar Surat & Tafsir)
  const fetchDataPendukung = async () => {
    try {
      const resSurat = await axios("https://equran.id/api/v2/surat");
      setAllSurat(resSurat.data.data);
      const resTafsir = await axios(`https://equran.id/api/v2/tafsir/${nomor}`);
      setTafsir(resTafsir.data.data.tafsir);
    } catch (e) {}
  };

  useEffect(() => {
    getDetail();
    fetchDataPendukung();
  }, [nomor]);

  // 3. Logika Auto Scroll dari Hash (#)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && ayat.length > 0) {
      setTimeout(() => {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 800);
    } else {
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    }
  }, [ayat, nomor]);

  // 4. Fitur Simpan Bookmark
  const handleBookmark = (nomorAyat) => {
    confirm({
      title: "Tambah Bookmark?",
      content: `Simpan surat ${namaLatin} ayat ${nomorAyat}?`,
      okText: "Ya",
      okButtonProps: { className: "bg-orange-500 border-none" },
      onOk() {
        const list = JSON.parse(localStorage.getItem("bookmark") || "[]");
        list.push({ nomor, surat: namaLatin, ayat: nomorAyat });
        localStorage.setItem("bookmark", JSON.stringify(list));
        message.success("Bookmark disimpan");
      },
    });
  };

  // 5. Fitur Tandai Terakhir Baca
  const tandaiSelesaiBaca = (nomorAyat) => {
    confirm({
      title: "Tandai Selesai Baca?",
      content: `Jadikan ayat ${nomorAyat} sebagai titik terakhir baca?`,
      okText: "Ya",
      okButtonProps: { className: "bg-orange-500 border-none" },
      onOk() {
        localStorage.setItem("tanda", nomor + "--" + nomorAyat);
        message.success("Berhasil ditandai");
      },
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#FDFCFB] fixed inset-0 top-16 md:top-0 md:relative">
      {loading && <Loading />}

      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-gray-100 h-full">
        <div className="p-4 bg-orange-50 font-bold text-orange-800 border-b border-orange-100 flex items-center gap-2">
          <FiList /> Daftar Surat
        </div>
        <div className="overflow-y-auto flex-1 p-2 custom-scrollbar">
          {allSurat.map((s) => (
            <Link
              key={s.nomor}
              to={`/detail/${s.nomor}`}
              className={`flex items-center gap-3 p-3 rounded-xl mb-1 transition-all ${
                nomor == s.nomor
                  ? "bg-orange-400 text-white shadow-md"
                  : "hover:bg-orange-50 text-gray-700"
              }`}
            >
              <span className="text-xs font-bold w-6 text-center">
                {s.nomor}
              </span>
              <div className="flex-1 overflow-hidden font-bold text-sm truncate">
                {s.namaLatin}
              </div>
              <span className="font-arab text-lg">{s.nama}</span>
            </Link>
          ))}
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="bg-white border-b border-gray-100 shadow-sm p-4 md:p-6 z-10">
          <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-[2rem] p-5 md:p-8 text-white shadow-lg relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-5">
                <h1 className="font-arab text-5xl md:text-6xl">{nama}</h1>
                <div className="border-l border-white/30 pl-5">
                  <h2 className="text-2xl font-black leading-tight">
                    {namaLatin}
                  </h2>
                  <p className="text-orange-50 text-sm italic opacity-90">
                    "{arti}"
                  </p>
                </div>
              </div>
              <div className="w-full md:w-72 bg-white/20 backdrop-blur-md p-2 rounded-2xl border border-white/30">
                <audio
                  src={audioFull}
                  controls
                  className="w-full h-8 opacity-90"
                />
              </div>
            </div>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-[#FDFCFB] pb-32"
        >
          <div className="max-w-4xl mx-auto space-y-8 pt-2">
            {ayat.map((e) => (
              <div
                key={e.nomorAyat}
                id={`${nomor}--${e.nomorAyat}`}
                className="bg-white rounded-[2.5rem] p-6 md:p-12 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex justify-start mb-8">
                  <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center font-black border border-orange-100 shadow-sm text-lg">
                    {e.nomorAyat}
                  </div>
                </div>

                <p
                  className="font-arab text-right leading-[2.5] text-gray-800 mb-10 tracking-wide"
                  dir="rtl"
                  style={{ fontSize: `${currentFontSize}px` }}
                >
                  {e.teksArab}
                </p>

                <div className="bg-gray-50/50 p-6 rounded-3xl border-l-4 border-orange-400 mb-8">
                  <p className="text-gray-600 text-base md:text-lg leading-relaxed font-medium">
                    {e.teksIndonesia}
                  </p>
                </div>

                <div className="flex flex-wrap justify-end gap-3 pt-6 border-t border-gray-50">
                  <Tooltip title="Tandai Selesai">
                    <button
                      onClick={() => tandaiSelesaiBaca(e.nomorAyat)}
                      className="p-3 bg-purple-50 text-purple-600 rounded-2xl hover:bg-purple-600 hover:text-white transition-all flex items-center gap-2 font-bold text-xs uppercase"
                    >
                      <FaCheck size={14} /> Selesai
                    </button>
                  </Tooltip>

                  <Tooltip title="Simpan Bookmark">
                    <button
                      onClick={() => handleBookmark(e.nomorAyat)}
                      className="p-3 bg-teal-50 text-teal-600 rounded-2xl hover:bg-teal-600 hover:text-white transition-all flex items-center gap-2 font-bold text-xs uppercase"
                    >
                      <FiBookmark size={14} /> Simpan
                    </button>
                  </Tooltip>

                  <button
                    onClick={() => {
                      setViewTafsirByAyat(e.nomorAyat);
                      setOpen(true);
                    }}
                    className="px-6 py-3 bg-orange-50 text-orange-600 rounded-2xl hover:bg-orange-500 hover:text-white transition-all font-black text-xs uppercase tracking-widest shadow-sm flex items-center gap-2"
                  >
                    <MdContentPasteSearch size={18} /> Tafsir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Modal
        title={
          <div className="font-black text-orange-600 uppercase tracking-widest text-sm py-2">
            Tafsir Ayat {viewTafsirByAyat}
          </div>
        }
        centered
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={800}
      >
        <div className="py-6 px-2 text-gray-700 leading-loose text-lg whitespace-pre-line font-medium">
          {tafsir.find((v) => v.ayat === viewTafsirByAyat)?.teks}
        </div>
      </Modal>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #fed7aa;
          border-radius: 10px;
        }
        .font-arab {
          font-family: "Amiri", serif;
        }
      `}</style>
    </div>
  );
}
