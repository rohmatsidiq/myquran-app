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
import AdminUsers from "./pages/AdminUsers";
import PushNotificationManager from "./components/PushNotificationManager";

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
      <PushNotificationManager />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/surah" element={<Surah />} />
          <Route path="/doa" element={<Doa />} />
          <Route path="/jadwal" element={<JadwalSholat />} />
          <Route path="/detail/:nomor" element={<Detail />} />
          <Route path="/bookmark" element={<Bookmark />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/users" element={<AdminUsers />} />
        </Route>
      </Routes>
    </ConfigProvider>
  );
}

export default App;
