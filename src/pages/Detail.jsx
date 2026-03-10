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
  const scrollRef = useRef(null); // Ref untuk div yang bisa scroll

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

  // ... (getDetail & fetchDataPendukung tetap sama seperti kode Anda)
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
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [nomor]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && ayat.length > 0) {
      setTimeout(() => {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 700);
    }
  }, [ayat]);

  const handleBookmark = (nomorAyat) => {
    confirm({
      title: "Tambah Bookmark?",
      content: `Simpan surat ${namaLatin} ayat ${nomorAyat}?`,
      okText: "Ya",
      okButtonProps: { className: "bg-[#f7aa79]" },
      onOk() {
        const list = JSON.parse(localStorage.getItem("bookmark") || "[]");
        list.push({ nomor, surat: namaLatin, ayat: nomorAyat });
        localStorage.setItem("bookmark", JSON.stringify(list));
        message.success("Bookmark disimpan");
      },
    });
  };

  const tandaiSelesaiBaca = (nomorAyat) => {
    confirm({
      title: "Tandai Selesai Baca?",
      content: `Jadikan ayat ${nomorAyat} sebagai titik terakhir baca?`,
      okText: "Ya",
      okButtonProps: { className: "bg-[#f7aa79]" },
      onOk() {
        localStorage.setItem("tanda", nomor + "--" + nomorAyat);
        message.success("Berhasil ditandai");
      },
    });
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[#FDFCFB]">
      {loading && <Loading />}

      {/* SIDEBAR - Tetap diam */}
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
              <div className="flex-1 overflow-hidden">
                <p className="font-bold text-sm truncate">{s.namaLatin}</p>
              </div>
              <span className="font-arab text-lg">{s.nama}</span>
            </Link>
          ))}
        </div>
      </aside>

      {/* AREA UTAMA */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* HEADER SURAT - Bagian yang diam (Tidak ikut scroll) */}
        <div className="p-4 md:p-6 bg-white border-b border-gray-100 shadow-sm">
          <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-3xl p-5 md:p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="font-arab text-4xl md:text-5xl">{nama}</h1>
                <div className="border-l border-white/30 pl-4">
                  <h2 className="text-xl font-bold leading-tight">
                    {namaLatin}
                  </h2>
                  <p className="text-orange-50 text-sm italic">"{arti}"</p>
                </div>
              </div>
              <div className="w-full md:w-64 bg-white/20 backdrop-blur-md p-1.5 rounded-xl border border-white/30">
                <audio
                  src={audioFull}
                  controls
                  preload="none"
                  className="w-full h-7 opacity-90 hover:opacity-100 transition-opacity"
                >
                  Browser Anda tidak mendukung elemen audio.
                </audio>
              </div>
            </div>
          </div>
        </div>

        {/* LIST AYAT - Hanya bagian ini yang bisa di-scroll */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-[#FDFCFB]"
        >
          <div className="max-w-4xl mx-auto space-y-6">
            {ayat.map((e) => (
              <div
                key={e.nomorAyat}
                id={`${nomor}--${e.nomorAyat}`}
                className="bg-white rounded-[2rem] p-6 md:p-10 border border-gray-100 shadow-sm hover:shadow-md transition-shadow scroll-mt-3"
              >
                {/* Header Ayat (Hanya Nomor) */}
                <div className="flex justify-start mb-6">
                  <div className="w-10 h-10 bg-orange-50 text-orange-400 rounded-xl flex items-center justify-center font-bold border border-orange-100">
                    {e.nomorAyat}
                  </div>
                </div>

                {/* Teks Arab */}
                <p
                  className="font-arab text-right text-2xl md:text-4xl leading-[2.5] md:leading-[3] text-gray-800 mb-8 tracking-normal"
                  dir="rtl"
                  style={{ wordSpacing: "5px" }} // Memberi jarak antar kata agar lebih jelas
                >
                  {e.teksArab}
                </p>

                {/* Terjemahan */}
                <div className="bg-gray-50 p-5 rounded-2xl border-l-4 border-orange-300 mb-6">
                  <p className="text-gray-700 text-md leading-relaxed italic">
                    {e.teksIndonesia}
                  </p>
                </div>

                {/* Tombol Aksi - Sekarang di Bawah Terjemahan */}
                <div className="flex flex-wrap justify-end gap-2 pt-4 border-t border-gray-50">
                  <Tooltip title="Tandai Selesai">
                    <button
                      onClick={() => tandaiSelesaiBaca(e.nomorAyat)}
                      className="p-2.5 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-600 hover:text-white transition-all flex items-center gap-2 font-medium text-sm"
                    >
                      <FaCheck size={16} />{" "}
                      <span className="md:hidden lg:inline">Selesai</span>
                    </button>
                  </Tooltip>

                  <Tooltip title="Bookmark">
                    <button
                      onClick={() => handleBookmark(e.nomorAyat)}
                      className="p-2.5 bg-teal-50 text-teal-600 rounded-xl hover:bg-teal-600 hover:text-white transition-all flex items-center gap-2 font-medium text-sm"
                    >
                      <FiBookmark size={16} />{" "}
                      <span className="md:hidden lg:inline">Simpan</span>
                    </button>
                  </Tooltip>

                  <button
                    onClick={() => {
                      setViewTafsirByAyat(e.nomorAyat);
                      setOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-sky-50 text-sky-600 rounded-xl hover:bg-sky-600 hover:text-white transition-all font-bold text-sm shadow-sm"
                  >
                    <MdContentPasteSearch size={20} /> Tafsir
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* Padding bawah agar ayat terakhir tidak terlalu nempel */}
          <div className="h-20"></div>
        </div>
      </main>

      <Modal
        title={
          <div className="font-bold text-orange-600">
            Tafsir Ayat {viewTafsirByAyat}
          </div>
        }
        centered
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={700}
      >
        <div className="py-4 text-gray-700 leading-loose text-lg whitespace-pre-line">
          {tafsir.find((v) => v.ayat === viewTafsirByAyat)?.teks}
        </div>
      </Modal>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #fbd38d;
          border-radius: 10px;
        }
        .font-arab {
          font-family: "Amiri", serif;
        }
      `}</style>
    </div>
  );
}
