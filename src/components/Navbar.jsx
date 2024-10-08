import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TiThMenu } from "react-icons/ti";

export default function Navbar() {
  const [menu, setMenu] = useState(false);

  return (
    <div className="w-full z-50 bg-[#f7aa79] drop-shadow-lg fixed top-0 right-0 left-0 py-4">
      <div className="text-white px-4">
        <div className="flex justify-between items-center gap-3">
          <Link to={"/"} className="text-2xl">
            MyQur'an
          </Link>
          <button className="flex md:hidden" onClick={() => setMenu(!menu)}>
            <TiThMenu className="text-3xl" />
          </button>
          <div className="hidden md:flex gap-4">
            <Link
              className="hover:text-[#ffe3d3] hover:border-b-[#ffe3d3] border-b-2 border-b-[#f7aa79]"
              to={"/"}
            >
              Home
            </Link>
            <Link
              className="hover:text-[#ffe3d3] hover:border-b-[#ffe3d3] border-b-2 border-b-[#f7aa79]"
              to={"/bookmark"}
            >
              Bookmark
            </Link>
          </div>
        </div>
      </div>
      {menu && (
        <div className="bg-[#f7aa79] w-screen min-h-screen fixed top-0 bottom-0 left-0 right-0 text-white flex flex-col justify-center items-center gap-4">
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
            className="hover:text-[#ffe3d3] hover:border-b-[#ffe3d3] border-b-2 border-b-[#f7aa79]"
            to={"/"}
          >
            Home
          </Link>
          <Link
            onClick={() => {
              setMenu(false);
            }}
            className="hover:text-[#ffe3d3] hover:border-b-[#ffe3d3] border-b-2 border-b-[#f7aa79]"
            to={"/bookmark"}
          >
            Bookmark
          </Link>
        </div>
      )}
    </div>
  );
}
