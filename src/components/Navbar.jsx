import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TiThMenu } from "react-icons/ti";

export default function Navbar() {
  const [menu, setMenu] = useState(false);

  return (
    <div className="w-full z-50 bg-[#b3856b] drop-shadow-lg fixed top-0 right-0 left-0 py-4">
      <div className="max-w-[1080px] mx-auto text-white px-4">
        <div className="flex justify-between items-center gap-3">
          <Link to={"/"} className="text-2xl">
            MyQur'an
          </Link>
          <button className="flex md:hidden" onClick={() => setMenu(!menu)}>
            <TiThMenu className="text-3xl" />
          </button>
          <div className="hidden md:flex gap-4">
            <Link
              className="hover:text-[#ffe3d3] hover:border-b-[#ffe3d3] border-b-2 border-b-[#b3856b]"
              to={"/"}
            >
              Home
            </Link>
            <Link
              className="hover:text-[#ffe3d3] hover:border-b-[#ffe3d3] border-b-2 border-b-[#b3856b]"
              to={"/bookmark"}
            >
              Bookmark
            </Link>
          </div>
        </div>
      </div>
      {menu && (
        <div className="bg-[#b3856b] w-screen min-h-screen fixed top-0 bottom-0 left-0 right-0 text-white flex flex-col justify-center items-center gap-4">
          <Link
            onClick={() => {
              setMenu(false);
            }}
            to={"/"}
            className="text-2xl"
          >
            MyQur'an
          </Link>
          <hr className="w-36" />
          <Link
            onClick={() => {
              setMenu(false);
            }}
            className="hover:text-[#ffe3d3] hover:border-b-[#ffe3d3] border-b-2 border-b-[#b3856b]"
            to={"/"}
          >
            Home
          </Link>
          <Link
            onClick={() => {
              setMenu(false);
            }}
            className="hover:text-[#ffe3d3] hover:border-b-[#ffe3d3] border-b-2 border-b-[#b3856b]"
            to={"/bookmark"}
          >
            Bookmark
          </Link>
        </div>
      )}
    </div>
  );
}
