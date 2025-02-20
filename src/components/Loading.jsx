import React from "react";
import "./../index.css";

export default function Loading() {
  return (
    <div className="fixed top-0 bottom-0 right-0 left-0 z-50 h-screen w-screen">
      <div
        aria-busy="true"
        aria-label="Loading"
        role="progressbar"
        className="container"
      >
        <div className="swing">
          <div className="swing-l"></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div className="swing-r"></div>
        </div>
      </div>
    </div>
  );
}
