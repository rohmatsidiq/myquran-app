import React, { useEffect } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";

import { ConfigProvider } from "antd";
import Home from "./pages/Home";
import Surah from "./pages/Surah";
import Detail from "./pages/Detail";
import Bookmark from "./pages/Bookmark";
import Settings from "./pages/Settings";
import Doa from "./pages/Doa";
import Layout from "./components/Layout";
import JadwalSholat from "./pages/JadwalSholat";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 16,
        },
      }}
      // getContainer={() => container}
    >
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/surah" element={<Surah />} />
          <Route path="/doa" element={<Doa />} />
          <Route path="/jadwal" element={<JadwalSholat />} />
          <Route path="/detail/:nomor" element={<Detail />} />
          <Route path="/bookmark" element={<Bookmark />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </ConfigProvider>
  );
}

export default App;
