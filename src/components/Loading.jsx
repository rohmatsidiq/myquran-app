import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white/60 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner Modern */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-orange-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
        </div>

        {/* Teks Loading */}
        <div className="flex flex-col items-center">
          <p className="text-orange-600 font-bold tracking-widest text-sm animate-pulse">
            MEMUAT DATA...
          </p>
          <div className="flex gap-1 mt-1">
            <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
