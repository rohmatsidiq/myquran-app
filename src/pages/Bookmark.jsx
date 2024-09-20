import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";
import { message } from "antd";

export default function Bookmark() {
  const [allBookmark, setAllBookmark] = useState([]);

  // Mengambil data bookmark dari localStorage ketika komponen pertama kali dimuat
  useEffect(() => {
    const bookmarks = localStorage.getItem("bookmark")
      ? JSON.parse(localStorage.getItem("bookmark"))
      : [];
    setAllBookmark(bookmarks);
  }, []);

  const handleDelete = (nomor, ayat) => {
    const newBookmark = allBookmark.filter(
      (e) => !(e.nomor === nomor && e.ayat === ayat)
    );
    // Update localStorage
    localStorage.setItem("bookmark", JSON.stringify(newBookmark));
    // Update state untuk memicu re-render
    setAllBookmark(newBookmark);

    message.success("Berhasil menghapus bookmark");
  };

  return (
    <div>
      {allBookmark.length === 0 ? (
        <p>Tidak ada bookmark.</p>
      ) : (
        allBookmark.map((e, i) => (
          <div
            className="bg-white p-4 rounded-3xl mb-3 flex justify-between items-center"
            key={i}
          >
            <div>
              <h3 className="font-bold">{e.surat}</h3>
              <p>Ayat {e.ayat}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  handleDelete(e.nomor, e.ayat);
                }}
                title="Hapus"
                className="bg-sky-400 px-3 py-2 rounded-full text-white"
              >
                <MdDeleteOutline className="text-lg" />
              </button>
              <Link
                to={`/detail/${e.nomor}#${e.nomor}--${e.ayat}`}
                className="bg-teal-400 px-3 py-2 rounded-full text-white"
              >
                Buka Ayat
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
