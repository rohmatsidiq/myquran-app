import React, { useState, useEffect } from "react";
import { useUser, SignInButton } from "@clerk/clerk-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  FaChartLine,
  FaLock,
  FaCheckCircle,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

export default function Progress() {
  const { isSignedIn, user } = useUser();
  const storeUser = useMutation(api.users.storeUser);

  // Otomatis simpan/sinkronkan data user ke database Convex saat login
  useEffect(() => {
    if (isSignedIn && user) {
      storeUser({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress || "",
        name: user.fullName || user.firstName || "",
      });
    }
  }, [isSignedIn, user, storeUser]);

  // Ambil data tracking dari Convex jika user sudah login
  const readingLogs = useQuery(
    api.reading.getReadingLogs,
    isSignedIn && user ? { clerkId: user.id } : "skip",
  );

  const logReadingMutation = useMutation(api.reading.logReading);
  const [loadingTest, setLoadingTest] = useState(false);

  // State untuk navigasi bulan pada kalender (Default: Bulan & Tahun saat ini)
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  // Fungsi simulasi menandai bacaan hari ini
  //   const handleMarkToday = async () => {
  //     if (!user) return;
  //     setLoadingTest(true);
  //     const today = new Date().toISOString().split("T")[0]; // Format "YYYY-MM-DD"
  //     try {
  //       await logReadingMutation({
  //         clerkId: user.id,
  //         date: today,
  //         surah: "Al-Qur'an Daily Check",
  //       });
  //     } catch (err) {
  //       console.error("Gagal menyimpan progress:", err);
  //     } finally {
  //       setLoadingTest(false);
  //     }
  //   };

  // Generate Hari dalam Kalender Bulanan
  const generateMonthCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Hari pertama di bulan ini (0 = Minggu, 1 = Senin, dst)
    const firstDayIndex = new Date(year, month, 1).getDay();
    // Total jumlah hari di bulan ini
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];

    // 1. Kotak kosong untuk menggeser hari pertama agar tepat di kolom harinya
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ empty: true });
    }

    // 2. Daftar tanggal di bulan tersebut
    for (let day = 1; day <= totalDays; day++) {
      const formattedMonth = String(month + 1).padStart(2, "0");
      const formattedDay = String(day).padStart(2, "0");
      const dateString = `${year}-${formattedMonth}-${formattedDay}`;

      // Cek apakah tanggal ini ada di database Convex
      const isRead = readingLogs?.some((log) => log.date === dateString);
      days.push({ empty: false, date: dateString, dayNum: day, isRead });
    }

    return days;
  };

  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const weekDays = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  return (
    <div className="mt-6">
      <div className="p-6 md:p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-xl shadow-gray-200/20 relative overflow-hidden">
        {/* Header Bagian Progres */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center font-bold shadow-sm">
              <FaChartLine size={18} />
            </div>
            <div>
              <h3 className="font-black text-gray-800 text-base">
                Tracking Progress Bacaan
              </h3>
              <p className="text-[11px] text-gray-400 font-medium">
                Pantau konsistensi membaca Al-Qur'an setiap hari
              </p>
            </div>
          </div>

          {/* Badge "Fitur Baru ✨" hanya muncul jika BELUM login */}
          {!isSignedIn && (
            <span className="px-3 py-1 bg-orange-100/60 text-orange-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
              Fitur Baru ✨
            </span>
          )}
        </div>

        {/* KONDISI 1: BELUM LOGIN */}
        {!isSignedIn ? (
          <div className="text-center py-8 px-4 bg-gradient-to-b from-orange-50/50 to-orange-50/20 rounded-3xl border border-dashed border-orange-200">
            <div className="w-12 h-12 bg-white text-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
              <FaLock size={20} />
            </div>
            <h4 className="font-bold text-gray-800 text-sm mb-1">
              Login Diperlukan untuk Menggunakan Tracking
            </h4>
            <p className="text-xs text-gray-500 max-w-md mx-auto mb-5">
              Simpan riwayat bacaan Anda secara otomatis ke database cloud dan
              lihat kalender bulanan harian Anda dengan masuk ke akun Anda.
            </p>

            <SignInButton mode="modal">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-orange-500/20">
                Login / Register Sekarang
              </button>
            </SignInButton>
          </div>
        ) : (
          /* KONDISI 2: SUDAH LOGIN */
          <div>
            {/* <div className="flex justify-between items-center mb-4">
              <button
                onClick={handleMarkToday}
                disabled={loadingTest}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 shadow-sm"
              >
                {loadingTest ? "Menyimpan..." : "Tandai Baca Hari Ini ✓"}
              </button>
            </div> */}

            {/* Navigasi Kalender Bulanan */}
            <div className="bg-orange-50/50 border border-orange-100 p-4 rounded-3xl">
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 bg-white rounded-xl text-gray-600 hover:text-orange-500 shadow-sm transition-all"
                  title="Bulan Sebelumnya"
                >
                  <FaChevronLeft size={14} />
                </button>
                <div className="flex items-center gap-2 font-black text-gray-800 text-sm">
                  <FaCalendarAlt className="text-orange-500" size={14} />
                  <span>
                    {monthNames[currentDate.getMonth()]}{" "}
                    {currentDate.getFullYear()}
                  </span>
                </div>
                <button
                  onClick={handleNextMonth}
                  className="p-2 bg-white rounded-xl text-gray-600 hover:text-orange-500 shadow-sm transition-all"
                  title="Bulan Berikutnya"
                >
                  <FaChevronRight size={14} />
                </button>
              </div>

              {/* Header Hari (Min - Sab) */}
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {weekDays.map((day, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-extrabold text-gray-400 uppercase"
                  >
                    {day}
                  </span>
                ))}
              </div>

              {/* Grid Kotak Tanggal */}
              {readingLogs === undefined ? (
                <div className="py-8 text-center text-xs text-gray-400">
                  Memuat data kalender dari database...
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-1.5">
                  {generateMonthCalendar().map((item, idx) =>
                    item.empty ? (
                      <div key={idx} className="h-10"></div>
                    ) : (
                      <div
                        key={idx}
                        title={`${item.date}: ${item.isRead ? "Sudah Membaca" : "Belum Membaca"}`}
                        className={`h-10 rounded-2xl flex flex-col items-center justify-center text-xs font-bold transition-all border ${
                          item.isRead
                            ? "bg-orange-500 text-white border-orange-600 shadow-sm shadow-orange-200"
                            : "bg-white text-gray-700 border-gray-100 shadow-2xs"
                        }`}
                      >
                        <span>{item.dayNum}</span>
                        <span className="text-[8px] opacity-80 leading-none">
                          {item.isRead ? "✓" : ""}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
