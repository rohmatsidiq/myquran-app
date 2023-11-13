import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Detail from "./pages/Detail";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/detail/:nomor" element={<Detail />} />
        </Routes>
    );
}

export default App;
