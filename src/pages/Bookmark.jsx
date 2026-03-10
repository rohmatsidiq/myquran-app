import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MdDeleteOutline,
  MdOutlineArrowForward,
  MdLabelImportant,
} from "react-icons/md";
import { message, Empty, Popconfirm } from "antd";

export default function Bookmark() {
  const [allBookmark, setAllBookmark] = useState([]);

  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem("bookmark") || "[]");
    setAllBookmark(bookmarks);
  }, []);

  const handleDelete = (index) => {
    const newBookmark = allBookmark.filter((_, i) => i !== index);
    localStorage.setItem("bookmark", JSON.stringify(newBookmark));
    setAllBookmark(newBookmark);
    message.success("Bookmark berhasil dihapus");
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-20">
      <div className="max-w-4xl mx-auto px-4 pt-8 md:pt-12">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
              <span className="text-orange-500">
                <MdLabelImportant />
              </span>
              Daftar Bookmark
            </h1>
            <p className="text-gray-500 mt-2 font-medium">
              Ayat-ayat pilihan yang Anda simpan.
            </p>
          </div>
          <div className="hidden md:block bg-orange-100 text-orange-600 px-4 py-2 rounded-2xl font-bold text-sm">
            {allBookmark.length} Tersimpan
          </div>
        </div>

        {allBookmark.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-16 text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="text-gray-400 text-lg font-medium">
                  Belum ada ayat yang ditandai
                </span>
              }
            />
            <Link
              to="/"
              className="mt-6 px-8 py-3 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-100"
            >
              Cari Surat Sekarang
            </Link>
          </div>
        ) : (
          <div className="grid gap-5">
            {allBookmark.map((e, i) => (
              <div
                key={i}
                className="group bg-white p-5 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all flex flex-col md:flex-row justify-between items-center"
              >
                <div className="flex items-center gap-6 mb-4 md:mb-0 w-full md:w-auto">
                  {/* Dekorasi Nomor Urut */}
                  <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center font-black text-xl border border-orange-100 group-hover:bg-orange-500 group-hover:text-white transition-all">
                    {i + 1}
                  </div>

                  <div className="text-left">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                      {e.surat}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-500 mt-1">
                      <span className="bg-gray-100 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                        Ayat {e.ayat}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                  {/* Tombol Konfirmasi Hapus */}
                  <Popconfirm
                    title="Hapus Bookmark?"
                    description="Yakin ingin menghapus ayat ini?"
                    onConfirm={() => handleDelete(i)}
                    okText="Ya, Hapus"
                    cancelText="Batal"
                    okButtonProps={{ className: "bg-red-500" }}
                  >
                    <button
                      className="flex-1 md:flex-none p-4 rounded-2xl text-red-500 bg-red-50 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center shadow-sm"
                      title="Hapus"
                    >
                      <MdDeleteOutline size={26} />
                    </button>
                  </Popconfirm>

                  <Link
                    to={`/detail/${e.nomor}#${e.nomor}--${e.ayat}`}
                    className="flex-[2] md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-orange-400 text-white font-bold rounded-2xl hover:bg-orange-300 shadow-lg shadow-orange-100 transition-all transform active:scale-95 whitespace-nowrap"
                  >
                    Lanjut Baca <MdOutlineArrowForward size={20} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
