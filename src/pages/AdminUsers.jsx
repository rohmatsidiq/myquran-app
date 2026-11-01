import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { FaUsers, FaShieldAlt, FaClock, FaCalendarAlt } from "react-icons/fa";
import { Image } from "antd"; // Menggunakan komponen Image dari Ant Design

export default function AdminUsers() {
  const { user } = useUser();

  // Ambil data user yang sedang login untuk validasi keamanan di frontend
  const dbUser = useQuery(
    api.users.getCurrentUser,
    user ? { clerkId: user.id } : "skip",
  );

  // Ambil seluruh daftar user dari Convex
  const allUsers = useQuery(api.users.getAllUsers);

  // Format tanggal agar mudah dibaca
  const formatDate = (timestamp) => {
    if (!timestamp) return "-";
    const date = new Date(timestamp);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!dbUser || allUsers === undefined) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Validasi pengaman: Jika bukan admin, tampilkan pesan akses ditolak
  if (dbUser.role !== "admin") {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl shadow-xl text-center border border-red-100">
        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-xl">
          ⚠️
        </div>
        <h2 className="text-lg font-black text-gray-800 mb-1">Akses Ditolak</h2>
        <p className="text-xs text-gray-500">
          Halaman ini khusus untuk Administrator aplikasi MyQur'an.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 p-6 md:p-8 rounded-[2.5rem] text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute right-[-20px] bottom-[-20px] w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest">
              Panel Admin Eksklusif
            </span>
            <h1 className="text-2xl md:text-3xl font-black mt-2">
              Daftar Pengguna MyQur'an
            </h1>
            <p className="text-xs text-orange-100 mt-1">
              Total pengguna terdaftar:{" "}
              <strong className="text-white">{allUsers.length} Orang</strong>
            </p>
          </div>
          <div className="hidden sm:flex w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl items-center justify-center text-white">
            <FaUsers size={28} />
          </div>
        </div>
      </div>

      {/* 1. TAMPILAN DESKTOP: Menggunakan Tabel */}
      <div className="hidden md:block bg-white border border-gray-100 rounded-[2.5rem] shadow-xl shadow-gray-200/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-orange-50/50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-6">No</th>
                <th className="py-4 px-6">Nama Pengguna</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Bergabung Sejak</th>
                <th className="py-4 px-6">Terakhir Aktif</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-700">
              {allUsers.map((u, index) => (
                <tr
                  key={u._id}
                  className="hover:bg-orange-50/20 transition-colors"
                >
                  <td className="py-4 px-6 font-bold text-gray-400">
                    {index + 1}
                  </td>
                  <td className="py-4 px-6 font-bold text-gray-800 flex items-center gap-3">
                    {u.imageUrl ? (
                      <div className="w-9 h-9 rounded-xl overflow-hidden shadow-sm border border-gray-200 shrink-0">
                        <Image
                          src={u.imageUrl}
                          alt={u.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-9 h-9 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center font-bold text-xs shrink-0">
                        {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                    {u.name || "Tanpa Nama"}
                  </td>
                  <td className="py-4 px-6 text-gray-500">{u.email}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider inline-flex items-center gap-1 ${
                        u.role === "admin"
                          ? "bg-purple-100 text-purple-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      <FaShieldAlt size={10} /> {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-500 flex items-center gap-1.5 pt-5">
                    <FaCalendarAlt className="text-gray-300" size={12} />
                    {formatDate(u.createdAt)}
                  </td>
                  <td className="py-4 px-6 text-orange-600 font-bold">
                    <span className="flex items-center gap-1.5 bg-orange-50 px-3 py-1 rounded-xl w-fit border border-orange-100">
                      <FaClock size={12} /> {formatDate(u.lastActive)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. TAMPILAN MOBILE: Menggunakan Card */}
      <div className="block md:hidden space-y-4">
        {allUsers.map((u) => (
          <div
            key={u._id}
            className="bg-white border border-gray-100 rounded-3xl p-5 shadow-lg shadow-gray-200/20 relative"
          >
            {/* Header Card: Foto, Nama, & Role */}
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-50">
              <div className="flex items-center gap-3">
                {u.imageUrl ? (
                  <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-sm border border-gray-200 shrink-0">
                    <Image
                      src={u.imageUrl}
                      alt={u.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0">
                    {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
                <div>
                  <h4 className="font-black text-gray-800 text-sm">
                    {u.name || "Tanpa Nama"}
                  </h4>
                  <p className="text-[11px] text-gray-400 font-medium truncate max-w-[180px]">
                    {u.email}
                  </p>
                </div>
              </div>

              <span
                className={`px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider inline-flex items-center gap-1 ${
                  u.role === "admin"
                    ? "bg-purple-100 text-purple-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                <FaShieldAlt size={9} /> {u.role}
              </span>
            </div>

            {/* Detail Info Card: Bergabung & Terakhir Aktif */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-gray-50/70 p-2.5 rounded-2xl border border-gray-100">
                <p className="text-gray-400 font-bold text-[9px] uppercase tracking-wider mb-0.5">
                  Bergabung
                </p>
                <p className="text-gray-700 font-semibold flex items-center gap-1">
                  <FaCalendarAlt className="text-gray-400" size={10} />
                  {formatDate(u.createdAt)}
                </p>
              </div>

              <div className="bg-orange-50/50 p-2.5 rounded-2xl border border-orange-100">
                <p className="text-orange-400 font-bold text-[9px] uppercase tracking-wider mb-0.5">
                  Terakhir Aktif
                </p>
                <p className="text-orange-700 font-bold flex items-center gap-1">
                  <FaClock className="text-orange-400" size={10} />
                  {formatDate(u.lastActive)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
