import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import {
  FiBookmark,
  FiList,
  FiChevronLeft,
  FiChevronRight,
  FiBook,
  FiFileText,
} from "react-icons/fi";
import { MdContentPasteSearch } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { message, Modal, Tooltip } from "antd";
import Loading from "../components/Loading";

export default function Detail() {
  const { confirm } = Modal;
  const { nomor } = useParams();
  const scrollRef = useRef(null);
  const location = useLocation();

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

  // State untuk mode tampilan teks (ambil dari localStorage, default "all")
  const [displayMode, setDisplayMode] = useState(() => {
    return localStorage.getItem("quranDisplayMode") || "all";
  });

  // State untuk status buka/tutup sidebar (default terbuka/true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const currentFontSize = localStorage.getItem("fontSize") || 26;

  const handleDisplayModeChange = (value) => {
    setDisplayMode(value);
    localStorage.setItem("quranDisplayMode", value);
    message.success("Preferensi tampilan disimpan");
  };

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    localStorage.setItem("sidebarOpen", JSON.stringify(newState));
  };

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
    const hash = location.hash;
    if (hash && ayat.length > 0) {
      setTimeout(() => {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);

        if (element && scrollRef.current) {
          const containerTop = scrollRef.current.getBoundingClientRect().top;
          const elementTop = element.getBoundingClientRect().top;
          const offsetPosition =
            elementTop - containerTop + scrollRef.current.scrollTop;

          scrollRef.current.scrollTo({
            top: offsetPosition - 16,
            behavior: "smooth",
          });

          element.classList.add(
            // "ring-4",
            // "ring-orange-400",
            "transition-all",
            "duration-500",
          );
          setTimeout(() => {
            element.classList.remove("ring-4", "ring-orange-400");
          }, 2000);
        }
      }, 500);
    } else if (!hash && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [ayat, location.hash, nomor]);

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
    <div className="flex h-screen overflow-hidden bg-[#FDFCFB] fixed pt-16 md:pt-0 inset-0 md:top-0 md:relative">
      {loading && <Loading />}

      {/* ASIDE / SIDEBAR DAFTAR SURAT */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-gray-100 h-full transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-72" : "w-0 overflow-hidden border-none"
        }`}
      >
        <div className="p-4 bg-orange-50 font-bold text-orange-800 border-b border-orange-100 flex items-center justify-between whitespace-nowrap">
          <div className="flex items-center gap-2">
            <FiList /> Daftar Surat
          </div>
        </div>
        <div className="overflow-y-auto flex-1 p-2 custom-scrollbar whitespace-nowrap">
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
        <div className="bg-white border-b border-gray-100 shadow-sm p-4 md:p-6 z-10 flex flex-col gap-4">
          <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-[2rem] p-5 md:p-8 text-white shadow-lg relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-4">
              {/* Bagian Kiri: Tombol Sidebar & Identitas Surat */}
              <div className="flex items-center gap-5 w-full md:w-auto">
                <Tooltip
                  title={
                    isSidebarOpen
                      ? "Sembunyikan Daftar Surat"
                      : "Tampilkan Daftar Surat"
                  }
                >
                  <button
                    onClick={toggleSidebar}
                    className="hidden md:flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 text-white rounded-xl backdrop-blur-md border border-white/30 transition-all shrink-0"
                  >
                    {isSidebarOpen ? (
                      <FiChevronLeft size={20} />
                    ) : (
                      <FiChevronRight size={20} />
                    )}
                  </button>
                </Tooltip>

                <h1 className="font-arab text-3xl md:text-4xl">{nama}</h1>
                <div className="border-l border-white/30 pl-5">
                  <h2 className="text-xl font-black leading-tight">
                    {namaLatin}
                  </h2>
                  <p className="text-orange-50 text-sm italic opacity-90">
                    "{arti}"
                  </p>
                </div>
              </div>

              {/* Bagian Kanan: Audio & Tombol Mode Tampilan Ikon */}
              <div className="flex flex-row items-center gap-3 w-full md:w-auto bg-white/20 backdrop-blur-md p-1 rounded-2xl border border-white/30">
                <div className="w-full md:w-60">
                  <audio
                    src={audioFull}
                    controls
                    preload="none"
                    controlsList="nodownload"
                    className="w-full h-8 opacity-90"
                  />
                </div>

                {/* Grup Tombol Mode Tampilan Ikon */}
                <div className="flex bg-white/40 rounded-xl gap-1 shrink-0">
                  <Tooltip title="Arab & Terjemahan">
                    <button
                      onClick={() => handleDisplayModeChange("all")}
                      className={`p-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center ${
                        displayMode === "all"
                          ? "bg-white text-orange-600 shadow-sm"
                          : "text-white hover:bg-white/20"
                      }`}
                    >
                      <FiBook size={18} />
                    </button>
                  </Tooltip>

                  <Tooltip title="Arab Saja">
                    <button
                      onClick={() => handleDisplayModeChange("arab")}
                      className={`p-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center font-arab ${
                        displayMode === "arab"
                          ? "bg-white text-orange-600 shadow-sm"
                          : "text-white hover:bg-white/20"
                      }`}
                    >
                      <span className="text-base font-bold leading-none">
                        ع
                      </span>
                    </button>
                  </Tooltip>

                  <Tooltip title="Terjemahan Saja">
                    <button
                      onClick={() => handleDisplayModeChange("translation")}
                      className={`p-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center ${
                        displayMode === "translation"
                          ? "bg-white text-orange-600 shadow-sm"
                          : "text-white hover:bg-white/20"
                      }`}
                    >
                      <FiFileText size={18} />
                    </button>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-[#FDFCFB]"
        >
          <div className="max-w-4xl mx-auto space-y-8 pt-2">
            {ayat.map((e) => (
              <div
                key={e.nomorAyat}
                id={`${nomor}--${e.nomorAyat}`}
                className="md:bg-white md:rounded-[2.5rem] md:p-12 md:border md:border-gray-100 md:shadow-sm md:hover:shadow-md transition-all duration-300 border-b md:border-b-0 md:mb-4 last:border-b-0 pb-8 md:pb-0"
              >
                <div className="flex justify-start mb-8">
                  <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center font-black border border-orange-100 shadow-sm text-lg">
                    {e.nomorAyat}
                  </div>
                </div>

                {/* Kondisi Tampilkan Teks Arab */}
                {(displayMode === "all" || displayMode === "arab") && (
                  <p
                    className="font-arab text-right leading-[2.5] text-gray-800 mb-8 tracking-wide"
                    dir="rtl"
                    style={{ fontSize: `${currentFontSize}px` }}
                  >
                    {e.teksArab}
                  </p>
                )}

                {/* Kondisi Tampilkan Teks Terjemahan */}
                {(displayMode === "all" || displayMode === "translation") && (
                  <div className="mb-8">
                    <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                      {e.teksIndonesia}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap justify-end gap-1 border-gray-50">
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
                    className="p-3 bg-orange-50 text-orange-600 rounded-2xl hover:bg-orange-500 hover:text-white transition-all font-black text-xs uppercase tracking-widest shadow-sm flex items-center gap-2"
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
