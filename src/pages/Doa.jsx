import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MdSearch,
  MdOutlineMenuBook,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";
import { Spin, Empty } from "antd";

export default function Doa() {
  const [allDoa, setAllDoa] = useState([]);
  const [filteredDoa, setFilteredDoa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeId, setActiveId] = useState(null);

  // Ambil ukuran font dari localStorage agar konsisten dengan bacaan Qur'an
  const fontSize = localStorage.getItem("fontSize") || 30;

  useEffect(() => {
    const fetchDoa = async () => {
      try {
        // Menggunakan API doa yang stabil
        const res = await axios.get(
          "https://islamic-api-zhirrr.vercel.app/api/doaharian",
        );
        setAllDoa(res.data.data);
        setFilteredDoa(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Gagal memuat doa", err);
        setLoading(false);
      }
    };
    fetchDoa();
  }, []);

  // Fitur Pencarian Otomatis
  useEffect(() => {
    const results = allDoa.filter((doa) =>
      doa.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredDoa(results);
  }, [searchTerm, allDoa]);

  const toggleDoa = (id) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Header - Menggunakan Brand Orange */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-orange-100 text-orange-500 rounded-[1.5rem] shadow-sm">
            <MdOutlineMenuBook size={32} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Doa Harian
            </h1>
            <p className="text-sm text-gray-500 font-medium tracking-wide">
              Kumpulan doa aktivitas harian
            </p>
          </div>
        </div>

        {/* Bar Pencarian - Fokus Orange */}
        <div className="relative mb-8">
          <MdSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400"
            size={24}
          />
          <input
            type="text"
            placeholder="Cari doa (misal: Makan, Tidur...)"
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 shadow-sm rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all text-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spin size="large" strokeColor="#f97316" />
          </div>
        ) : filteredDoa.length === 0 ? (
          <div className="bg-white p-12 rounded-[2.5rem] text-center border border-gray-100 shadow-sm">
            <Empty
              description={
                <span className="text-gray-400 font-medium">
                  Doa tidak ditemukan
                </span>
              }
            />
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredDoa.map((item, index) => (
              <div
                key={index}
                className={`bg-white rounded-[2rem] border transition-all duration-300 ${
                  activeId === index
                    ? "border-orange-200 shadow-lg shadow-orange-50"
                    : "border-gray-50 shadow-sm hover:border-orange-100"
                }`}
              >
                <button
                  onClick={() => toggleDoa(index)}
                  className="w-full p-6 flex justify-between items-center text-left"
                >
                  <span
                    className={`font-bold text-lg ${activeId === index ? "text-orange-600" : "text-gray-700"}`}
                  >
                    {item.title}
                  </span>
                  <div
                    className={`transition-transform duration-300 ${activeId === index ? "rotate-180 text-orange-500" : "text-gray-400"}`}
                  >
                    <MdKeyboardArrowDown size={28} />
                  </div>
                </button>

                {activeId === index && (
                  <div className="px-6 pb-8 pt-2 animate-in slide-in-from-top-2 duration-300">
                    <div className="h-[1px] w-full bg-orange-50 mb-6"></div>

                    {/* Teks Arab dengan Font Size Custom */}
                    <p
                      className="font-arab text-right leading-[2] text-gray-800 mb-8"
                      style={{ fontSize: `${fontSize}px` }}
                      dir="rtl"
                    >
                      {item.arabic}
                    </p>

                    <p className="text-orange-600 italic font-medium text-base mb-6 leading-relaxed bg-orange-50/50 p-4 rounded-2xl border-l-4 border-orange-400">
                      "{item.latin}"
                    </p>

                    <div className="bg-gray-50/80 p-5 rounded-2xl border border-gray-100">
                      <p className="text-[10px] text-orange-400 uppercase font-black tracking-widest mb-2">
                        Artinya:
                      </p>
                      <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                        {item.translation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
