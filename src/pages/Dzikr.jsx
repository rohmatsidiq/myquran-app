import React, { useState, useEffect, useRef } from "react";
import dzikrData from "../../data/dzikr.json";
import {
  MdCheckCircle,
  MdRefresh,
  MdWbSunny,
  MdNightsStay,
  MdVisibility,
} from "react-icons/md";

export default function Dzikir() {
  // Set default tab otomatis berdasarkan jam perangkat (Jam 04:00 - 15:00 = Pagi, Sisanya = Petang)
  const [activeTab, setActiveTab] = useState(() => {
    const currentHour = new Date().getHours();
    return currentHour >= 4 && currentHour < 15 ? "pagi" : "petang";
  });

  const [counters, setCounters] = useState({});

  // State untuk mode tampilan (tersimpan di localStorage)
  // Opsi: "all" (Arab & Arti), "arab" (Arab Saja), "arti" (Arti Saja)
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("dzikr_view_mode") || "all";
  });

  // Simpan preferensi viewMode ke localStorage setiap kali berubah
  useEffect(() => {
    localStorage.setItem("dzikr_view_mode", viewMode);
  }, [viewMode]);

  // Ref untuk menampung referensi setiap kartu dzikir
  const cardRefs = useRef({});

  // Reset atau inisialisasi counter saat tab berubah
  useEffect(() => {
    const initialCounters = {};
    const items = dzikrData[activeTab] || [];
    items.forEach((item) => {
      initialCounters[item.id] = 0;
    });
    setCounters(initialCounters);
  }, [activeTab]);

  const handleIncrement = (id, maxUlang, currentIndex) => {
    setCounters((prev) => {
      const current = prev[id] || 0;
      if (current < maxUlang) {
        const nextCount = current + 1;

        // Jika hitungan pas mencapai target (selesai), otomatis scroll ke kartu berikutnya secara presisi di atas
        if (nextCount >= maxUlang) {
          const nextIndex = currentIndex + 1;
          const nextCardElement = cardRefs.current[nextIndex];
          if (nextCardElement) {
            setTimeout(() => {
              nextCardElement.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }, 150);
          }
        }

        return { ...prev, [id]: nextCount };
      }
      return prev;
    });
  };

  const handleResetItem = (id) => {
    setCounters((prev) => ({ ...prev, [id]: 0 }));
  };

  const currentList = dzikrData[activeTab] || [];

  // Hitung total progres dzikir selesai
  const totalItems = currentList.length;
  const completedItems = currentList.filter(
    (item) => (counters[item.id] || 0) >= (item.ulang || 1),
  ).length;
  const progressPercent =
    totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header Banner */}
      <div className="p-4 sm:p-0">
        <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-orange-500/10 mb-6 relative overflow-hidden">
          <div className="absolute right-4 -bottom-6 opacity-10 text-9xl font-black">
            {activeTab === "pagi" ? "☀️" : "🌙"}
          </div>
          <div className="relative z-10">
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-block mb-3">
              Amalan Harian
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
              Dzikir Pagi & Petang
            </h1>
            <p className="text-orange-100 text-xs sm:text-sm max-w-xl leading-relaxed">
              Benteng perlindungan diri dan penenang jiwa dengan dzikir yang
              diajarkan Rasulullah ﷺ.
            </p>

            {/* Progress Bar Keseluruhan */}
            <div className="mt-6 bg-black/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-xs font-bold mb-1.5 text-orange-100">
                  <span>Progres Membaca</span>
                  <span>
                    {completedItems} dari {totalItems} selesai
                  </span>
                </div>
                <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-white h-full transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-right pl-2 border-l border-white/10">
                <span className="text-lg font-black">{progressPercent}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher (Pagi / Petang) & Toggle View Mode */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8 justify-between items-center">
          <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("pagi")}
              className={`flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-sm ${
                activeTab === "pagi"
                  ? "bg-orange-500 text-white shadow-orange-500/30 scale-[1.02]"
                  : "bg-white text-gray-500 border border-gray-100 hover:bg-gray-50"
              }`}
            >
              <MdWbSunny size={18} /> Dzikir Pagi
            </button>
            <button
              onClick={() => setActiveTab("petang")}
              className={`flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-sm ${
                activeTab === "petang"
                  ? "bg-orange-500 text-white shadow-orange-500/30 scale-[1.02]"
                  : "bg-white text-gray-500 border border-gray-100 hover:bg-gray-50"
              }`}
            >
              <MdNightsStay size={18} /> Dzikir Petang
            </button>
          </div>

          {/* Tombol Pengatur Mode Tampilan */}
          <div className="flex items-center bg-white border border-gray-100 p-1.5 rounded-2xl shadow-sm w-full sm:w-auto justify-center">
            <button
              onClick={() => setViewMode("all")}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === "all"
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
              title="Tampilkan Arab dan Arti"
            >
              Arab & Arti
            </button>
            <button
              onClick={() => setViewMode("arab")}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === "arab"
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
              title="Tampilkan Arab Saja"
            >
              Arab Saja
            </button>
            <button
              onClick={() => setViewMode("arti")}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === "arti"
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
              title="Tampilkan Arti Saja"
            >
              Arti Saja
            </button>
          </div>
        </div>
      </div>

      {/* List Kartu Dzikir */}
      <div className="space-y-4">
        {currentList.map((item, index) => {
          const currentCount = counters[item.id] || 0;
          const targetCount = item.ulang || 1;
          const isCompleted = currentCount >= targetCount;

          return (
            <div
              key={item.id}
              ref={(el) => (cardRefs.current[index] = el)}
              className={`scroll-mt-20 bg-white border sm:rounded-3xl p-5 sm:p-6 shadow-sm transition-all relative overflow-hidden ${
                isCompleted
                  ? "border-emerald-200 bg-emerald-50/10 shadow-emerald-500/5"
                  : "border-gray-100 hover:border-orange-200"
              }`}
            >
              {/* Header Card (Nomor, Judul, dan Dalil) */}
              <div className="flex items-start gap-3 mb-4 pb-3 border-b border-gray-50">
                <span
                  className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
                    isCompleted
                      ? "bg-emerald-500 text-white"
                      : "bg-orange-50 text-orange-600"
                  }`}
                >
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm sm:text-base">
                    {item.judul}
                  </h3>
                  {item.dalil && (
                    <span className="text-[10px] font-extrabold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-md inline-block mt-1">
                      {item.dalil}
                    </span>
                  )}
                </div>
              </div>

              {/* Arabic Text (Muncul jika viewMode "all" atau "arab") */}
              {(viewMode === "all" || viewMode === "arab") && (
                <div className="text-right my-5">
                  <p
                    dir="rtl"
                    className="text-2xl font-arab sm:text-3xl font-arabic text-gray-900 leading-[3.2] tracking-wide"
                  >
                    {item.arab}
                  </p>
                </div>
              )}

              {/* Translation / Arti (Muncul jika viewMode "all" atau "arti") */}
              {(viewMode === "all" || viewMode === "arti") && (
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-5">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
                    Artinya:
                  </p>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    {item.arti}
                  </p>
                </div>
              )}

              {/* Counter Actions (Bagian Bawah Kartu) */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleResetItem(item.id)}
                  className="flex items-center gap-1.5 px-3 py-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors text-xs font-bold"
                  title="Reset Hitungan"
                >
                  <MdRefresh size={16} /> Reset
                </button>

                <button
                  onClick={() => handleIncrement(item.id, targetCount, index)}
                  className={`flex-1 max-w-xs py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md ${
                    isCompleted
                      ? "bg-emerald-500 text-white shadow-emerald-500/20"
                      : "bg-orange-500 text-white shadow-orange-500/20 hover:bg-orange-600"
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <MdCheckCircle size={18} /> Selesai
                    </>
                  ) : (
                    <>
                      Tap ({currentCount} / {targetCount}x)
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
