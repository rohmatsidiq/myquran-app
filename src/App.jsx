import React, { useEffect } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Detail from "./pages/Detail";

function App() {
    useEffect(() => {
        const handleBackButton = (event) => {
            if (event.currentTarget.performance.navigation.type === 1) {
                // Close the PWA app when user navigates back from another page
                window.close();
            }
        };

        // Add event listener to window.history for detecting back navigation
        window.history.pushState(null, null, window.location.pathname);
        window.addEventListener('popstate', handleBackButton);

        return () => {
            window.removeEventListener('popstate', handleBackButton);
        };
    }, []);
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/detail/:nomor" element={<Detail />} />
        </Routes>
    );
}

export default App;
