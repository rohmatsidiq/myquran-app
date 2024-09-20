import React, { useEffect } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Layout from "./components/Layout";
import Bookmark from "./pages/Bookmark";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/detail/:nomor" element={<Detail />} />
        <Route path="/bookmark" element={<Bookmark />} />
      </Route>
    </Routes>
  );
}

export default App;
