import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  FiBookmark,
  FiChevronLeft,
  FiChevronRight,
  FiBook,
  FiFileText,
  FiLayers,
} from "react-icons/fi";
import { MdContentPasteSearch } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { message, Modal, Tooltip, Pagination } from "antd";
import Loading from "../components/Loading";

// Integrasi Clerk & Convex (opsional mengikuti struktur Anda)
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function PageView() {
  const { nomor, halaman } = useParams(); // Parameter surat & halaman aktif
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const { isSignedIn, user } = useUser();
  const logReadingMutation = useMutation(api.reading.logReading);

  const [open, setOpen] = useState(false);
  const [ayat, setAyat] = useState([]);
  const [nama, setNama] = useState("");
  const [namaLatin, setNamaLatin] = useState("");
  const [audioFull, setAudioFull] = useState("");
  const [tafsir, setTafsir] = useState([]);
  const [viewTafsirByAyat, setViewTafsirByAyat] = useState(0);
  const [loading, setLoading] = useState(false);

  // Konfigurasi Paginasi Halaman (Simulasi 1 surat dibagi menjadi beberapa halaman, misal 10 ayat per halaman)
  const [currentPage, setCurrentPage] = useState(parseInt(halaman) || 1);
  const pageSize = 10; // Jumlah ayat per halaman ala mushaf digital

  // State tampilan & font
  const [displayMode, setDisplayMode] = useState(() => {
    return localStorage.getItem("quranDisplayMode") || "all";
  });
  const currentFontSize = localStorage.getItem("fontSize") || 28;

  // Helper Angka Arab
  const toArabicNumber = (num) => {
    const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return num
      .toString()
      .split("")
      .map((digit) => arabicNumbers[digit] || digit)
      .join("");
  };

  const handleDisplayModeChange = (value) => {
    setDisplayMode(value);
    localStorage.setItem("quranDisplayMode", value);
    message.success("Preferensi tampilan disimpan");
  };

  // Ambil Data Surat dari API
  const getDetail = async () => {
    setLoading(true);
    try {
      const response = await axios(
        `https://equran.id/api/v2/surat/${nomor || 1}`,
      );
      const data = response.data.data;
      setNama(data.nama);
      setNamaLatin(data.namaLatin);
      setAyat(data.ayat);
      setAudioFull(data.audioFull["05"] || "");

      const resTafsir = await axios(
        `https://equran.id/api/v2/tafsir/${nomor || 1}`,
      );
      setTafsir(resTafsir.data.data.tafsir);
    } catch (err) {
      message.error("Gagal memuat data Al-Qur'an");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDetail();
    if (halaman) {
      setCurrentPage(parseInt(halaman));
    }
  }, [nomor, halaman]);

  // Hitung Data Ayat untuk Halaman Aktif (Pagination)
  const startIndex = (currentPage - 1) * pageSize;
  const currentAyatList = ayat.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(ayat.length / pageSize) || 1;

  // Handler pindah halaman
  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
    navigate(`/surat/${nomor}/page/${page}`);
  };

  // Fitur Bookmark
  const handleBookmark = (nomorAyat) => {
    Modal.confirm({
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

  // Fitur Tandai Terakhir Baca
  const tandaiSelesaiBaca = (nomorAyat) => {
    Modal.confirm({
      title: "Tandai Selesai Baca?",
      content: `Jadikan surat ${namaLatin} ayat ${nomorAyat} sebagai posisi terakhir baca?`,
      okText: "Ya",
      okButtonProps: { className: "bg-orange-500 border-none" },
      onOk: async () => {
        localStorage.setItem("tanda", nomor + "--" + nomorAyat);
        if (isSignedIn && user) {
          try {
            const today = new Date().toISOString().split("T")[0];
            await logReadingMutation({
              clerkId: user.id,
              date: today,
              surah: `${namaLatin} : ${nomorAyat}`,
            });
            message.success("Berhasil ditandai & tersimpan ke Cloud!");
          } catch (err) {
            message.success("Berhasil ditandai secara lokal.");
          }
        } else {
          message.success("Berhasil ditandai");
        }
      },
    });
  };

  return (
    <div className="flex flex-col h-screen bg-[#FDFCFB] overflow-hidden">
      {loading && <Loading />}

      {/* HEADER KONTROL & AUDIO */}
      <header className="bg-white border-b border-gray-100 shadow-sm p-4 z-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to={`/detail/${nomor || 1}`}
            className="p-2 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-100 transition-all font-bold text-sm flex items-center gap-1"
          >
            <FiChevronLeft size={18} /> Kembali ke Mode List
          </Link>
          <div className="border-l pl-3">
            <h1 className="font-bold text-gray-800 text-lg">
              {namaLatin} <span className="font-arab text-xl ml-1">{nama}</span>
            </h1>
            <p className="text-xs text-gray-500">
              Halaman {currentPage} dari {totalPages} (Format Mushaf)
            </p>
          </div>
        </div>

        {/* Kontrol Audio & Tampilan */}
        <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-2xl border border-gray-200">
          <audio
            src={audioFull}
            controls
            preload="none"
            className="h-8 w-48 md:w-60"
          />
          <div className="flex bg-white rounded-xl shadow-xs p-0.5 gap-1">
            <button
              onClick={() => handleDisplayModeChange("all")}
              className={`p-2 rounded-lg text-sm ${displayMode === "all" ? "bg-orange-500 text-white" : "text-gray-600"}`}
              title="Semua"
            >
              <FiBook size={16} />
            </button>
            <button
              onClick={() => handleDisplayModeChange("arab")}
              className={`p-2 rounded-lg text-sm font-arab font-bold ${displayMode === "arab" ? "bg-orange-500 text-white" : "text-gray-600"}`}
              title="Arab Saja"
            >
              ع
            </button>
            <button
              onClick={() => handleDisplayModeChange("translation")}
              className={`p-2 rounded-lg text-sm ${displayMode === "translation" ? "bg-orange-500 text-white" : "text-gray-600"}`}
              title="Terjemahan Saja"
            >
              <FiFileText size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* KONTEN UTAMA ALA MUSHAF (HALAMAN PER HALAMAN) */}
      <main
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center items-start bg-[#FAF8F5]"
      >
        <div className="w-full max-w-3xl bg-white border border-orange-100 rounded-3xl shadow-md p-6 md:p-12 relative min-h-[75vh] flex flex-col justify-between">
          {/* Bingkai Hiasan Atas Mushaf */}
          <div className="text-center pb-6 border-b border-orange-100 mb-6">
            <span className="text-xs tracking-widest uppercase font-bold text-orange-400 bg-orange-50 px-3 py-1 rounded-full">
              {namaLatin} — Halaman {currentPage}
            </span>
          </div>

          {/* Wrapper Ayat Bergaya Blok/Kitab Arab */}
          <div className="space-y-6 flex-1">
            {/* Jika mode menampilkan teks Arab */}
            {(displayMode === "all" || displayMode === "arab") && (
              <div
                className="font-arab text-right leading-[2.8] text-gray-900 tracking-wide bg-orange-50/30 p-6 rounded-2xl border border-orange-50"
                dir="rtl"
                style={{ fontSize: `${currentFontSize}px` }}
              >
                {currentAyatList.map((e) => (
                  <span
                    key={e.nomorAyat}
                    id={`ayat-${e.nomorAyat}`}
                    className="inline"
                  >
                    {e.teksArab}{" "}
                    <span className="inline-flex items-center justify-center text-orange-600 font-semibold px-1 text-lg">
                      ﴿{toArabicNumber(e.nomorAyat)}﴾
                    </span>{" "}
                  </span>
                ))}
              </div>
            )}

            {/* Jika mode menampilkan Terjemahan */}
            {(displayMode === "all" || displayMode === "translation") && (
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider">
                  Terjemahan & Aksi Per Ayat
                </h3>
                {currentAyatList.map((e) => (
                  <div
                    key={`trans-${e.nomorAyat}`}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
                  >
                    <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-700 rounded-md flex items-center justify-center font-bold text-xs mt-0.5">
                      {e.nomorAyat}
                    </span>
                    <div className="flex-1">
                      <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                        {e.teksIndonesia}
                      </p>
                    </div>

                    {/* Tombol Aksi Kecil Per Ayat */}
                    <div className="flex items-center gap-1 shrink-0">
                      <Tooltip title="Tandai Selesai">
                        <button
                          onClick={() => tandaiSelesaiBaca(e.nomorAyat)}
                          className="p-1.5 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition-all"
                        >
                          <FaCheck size={12} />
                        </button>
                      </Tooltip>
                      <Tooltip title="Bookmark">
                        <button
                          onClick={() => handleBookmark(e.nomorAyat)}
                          className="p-1.5 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-600 hover:text-white transition-all"
                        >
                          <FiBookmark size={12} />
                        </button>
                      </Tooltip>
                      <Tooltip title="Tafsir">
                        <button
                          onClick={() => {
                            setViewTafsirByAyat(e.nomorAyat);
                            setOpen(true);
                          }}
                          className="p-1.5 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-500 hover:text-white transition-all"
                        >
                          <MdContentPasteSearch size={14} />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* NAVIGASI HALAMAN BAWAH (PAGINATION) */}
          <div className="pt-8 mt-8 border-t border-orange-100 flex items-center justify-between">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1 transition-all ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-orange-500 text-white hover:bg-orange-600 shadow-sm"
              }`}
            >
              <FiChevronLeft /> Halaman Sebelumnya
            </button>

            <span className="text-xs font-bold text-gray-600">
              Hal {currentPage} dari {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1 transition-all ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-orange-500 text-white hover:bg-orange-600 shadow-sm"
              }`}
            >
              Halaman Berikutnya <FiChevronRight />
            </button>
          </div>
        </div>
      </main>

      {/* MODAL TAFSIR */}
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
          {tafsir.find((v) => v.ayat === viewTafsirByAyat)?.teks ||
            "Tafsir tidak ditemukan."}
        </div>
      </Modal>

      <style jsx>{`
        .font-arab {
          font-family: "Amiri", serif;
        }
      `}</style>
    </div>
  );
}
