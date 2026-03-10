import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MdOutlineSettings,
  MdFormatSize,
  MdOutlineMyLocation,
  MdSave,
} from "react-icons/md";
import { message, Slider, Select, Button } from "antd";

const API_BASE = "https://equran.id/api/v2/shalat"; // Sesuaikan dengan base URL API Anda

export default function Settings() {
  // Ambil data awal dari localStorage
  const [fontSize, setFontSize] = useState(
    parseInt(localStorage.getItem("fontSize")) || 26,
  );
  const [savedProv, setSavedProv] = useState(
    localStorage.getItem("userProvinsi") || "",
  );
  const [savedKota, setSavedKota] = useState(
    localStorage.getItem("userKabKota") || "",
  );

  const [listProv, setListProv] = useState([]);
  const [listKota, setListKota] = useState([]);
  const [loadingProv, setLoadingProv] = useState(false);
  const [loadingKota, setLoadingKota] = useState(false);

  // Load Daftar Provinsi saat pertama kali buka
  useEffect(() => {
    const fetchProv = async () => {
      setLoadingProv(true);
      try {
        const res = await axios.get(`${API_BASE}/provinsi`);
        setListProv(res.data.data);
        if (savedProv) fetchKota(savedProv);
      } catch (err) {
        message.error("Gagal memuat daftar provinsi");
      } finally {
        setLoadingProv(false);
      }
    };
    fetchProv();
  }, []);

  // Fungsi ambil daftar kota berdasarkan provinsi
  const fetchKota = async (provName) => {
    setLoadingKota(true);
    try {
      const res = await axios.post(`${API_BASE}/kabkota`, {
        provinsi: provName,
      });
      setListKota(res.data.data);
    } catch (err) {
      message.error("Gagal memuat daftar kabupaten/kota");
    } finally {
      setLoadingKota(false);
    }
  };

  const handleProvChange = (val) => {
    setSavedProv(val);
    setSavedKota(""); // Reset kota jika provinsi ganti
    fetchKota(val);
  };

  const saveAllSettings = () => {
    if (!savedProv || !savedKota) {
      return message.warning("Silakan pilih provinsi dan kota terlebih dahulu");
    }
    localStorage.setItem("fontSize", fontSize);
    localStorage.setItem("userProvinsi", savedProv);
    localStorage.setItem("userKabKota", savedKota);
    message.success("Pengaturan berhasil disimpan!");
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] p-6 font-sans">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-orange-100 text-orange-500 rounded-2xl">
            <MdOutlineSettings size={24} />
          </div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">
            Pengaturan
          </h1>
        </div>

        <div className="space-y-6">
          {/* UKURAN FONT */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-50 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-orange-600 font-bold">
              <MdFormatSize size={22} />
              <span>Ukuran Font Arab</span>
            </div>
            <Slider
              min={20}
              max={60}
              value={fontSize}
              onChange={setFontSize}
              trackStyle={{ backgroundColor: "#f97316" }}
              handleStyle={{ borderColor: "#f97316" }}
            />
            <div className="mt-6 p-6 bg-orange-50/50 rounded-3xl text-right">
              <p
                className="font-arab leading-[2]"
                style={{ fontSize: `${fontSize}px` }}
              >
                بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
              </p>
              <span className="text-[10px] text-orange-300 font-bold uppercase tracking-widest mt-2 block">
                Contoh Tampilan
              </span>
            </div>
          </div>

          {/* LOKASI SHOLAT */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-50 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-orange-600 font-bold">
              <MdOutlineMyLocation size={22} />
              <span>Lokasi Jadwal Sholat</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 ml-1 mb-1 block uppercase">
                  Provinsi
                </label>
                <Select
                  className="w-full"
                  size="large"
                  placeholder="Pilih Provinsi"
                  loading={loadingProv}
                  value={savedProv || undefined}
                  onChange={handleProvChange}
                  options={listProv.map((p) => ({ label: p, value: p }))}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 ml-1 mb-1 block uppercase">
                  Kabupaten / Kota
                </label>
                <Select
                  className="w-full"
                  size="large"
                  placeholder="Pilih Kota"
                  loading={loadingKota}
                  disabled={!savedProv}
                  value={savedKota || undefined}
                  onChange={setSavedKota}
                  options={listKota.map((k) => ({ label: k, value: k }))}
                />
              </div>
            </div>
          </div>

          <button
            onClick={saveAllSettings}
            className="w-full bg-orange-500 text-white py-5 rounded-[2rem] font-bold shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <MdSave size={22} />
            Simpan Pengaturan
          </button>
        </div>
      </div>
    </div>
  );
}
