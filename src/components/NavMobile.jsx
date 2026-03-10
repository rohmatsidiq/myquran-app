import React from "react";
import { Link, useLocation } from "react-router-dom";
import { HiOutlineHome, HiOutlineBookOpen } from "react-icons/hi";
import {
  MdOutlineAccessTime,
  MdOutlineMenuBook,
  MdOutlineSettings,
} from "react-icons/md";

export default function NavMobile() {
  const { pathname } = useLocation();

  const checkActive = (path) => {
    if (path === "/") return pathname === "/";
    if (path === "/surah") {
      return pathname.startsWith("/surah") || pathname.includes("/detail");
    }
    return pathname.startsWith(path);
  };

  const menus = [
    { name: "Home", path: "/", icon: <HiOutlineHome size={24} /> },
    { name: "Surat", path: "/surah", icon: <HiOutlineBookOpen size={24} /> },
    { name: "Doa", path: "/doa", icon: <MdOutlineMenuBook size={24} /> },
    {
      name: "Jadwal",
      path: "/jadwal",
      icon: <MdOutlineAccessTime size={24} />,
    },
    { name: "Set", path: "/settings", icon: <MdOutlineSettings size={24} /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] md:hidden">
      <div className="bg-white/95 backdrop-blur-lg border-t border-gray-100 flex justify-around items-center py-3 px-2 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] rounded-t-[2rem]">
        {menus.map((item) => {
          const active = checkActive(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center gap-1 transition-all duration-300 relative ${
                active
                  ? "text-orange-500 font-black scale-110 -translate-y-1"
                  : "text-gray-400 hover:text-orange-300"
              }`}
            >
              {active && (
                <span className="absolute -top-1 w-1 h-1 bg-orange-500 rounded-full animate-pulse"></span>
              )}

              <div
                className={`${active ? "drop-shadow-[0_0_8px_rgba(249,115,22,0.3)]" : ""}`}
              >
                {item.icon}
              </div>

              <span className="text-[10px] font-bold uppercase tracking-tighter">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
