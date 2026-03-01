import React, { useState, useCallback } from "react";
import { Globe, Play } from "lucide-react";

export const ProcrastinationDesktop: React.FC = () => {
  const [pos, setPos] = useState({ x: 96, y: 40 });

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX - pos.x;
      const startY = e.clientY - pos.y;

      const onMove = (ev: MouseEvent) => {
        setPos({ x: ev.clientX - startX, y: ev.clientY - startY });
      };
      const onUp = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [pos],
  );

  return (
    <div
      className="fixed z-20"
      style={{ left: pos.x, top: pos.y }}
    >
      <div
        className="bg-[#ECE9D8] border-2 border-[#003c74] shadow-2xl flex flex-col"
        style={{ width: "700px", fontFamily: "Tahoma, sans-serif", maxHeight: "500px" }}
      >
        {/* Title Bar — drag handle */}
        <div
          className="bg-gradient-to-r from-[#0a246a] to-[#3a6ea5] text-white px-3 py-1 flex justify-between items-center"
          style={{ cursor: "grab" }}
          onMouseDown={onMouseDown}
        >
          <div className="flex items-center gap-2">
            <Globe size={14} />
            <span className="text-xs font-bold">
              Google Chrome - CricketLiveScore.tv
            </span>
          </div>
          <div className="flex gap-1">
            <div className="w-5 h-5 bg-[#d4d0c8] text-black text-[10px] flex items-center justify-center border border-black">_</div>
            <div className="w-5 h-5 bg-[#d4d0c8] text-black text-[10px] flex items-center justify-center border border-black">□</div>
            <div className="w-5 h-5 bg-[#d4d0c8] text-black text-[10px] flex items-center justify-center border border-black">✕</div>
          </div>
        </div>

        {/* Browser Toolbar */}
        <div className="bg-[#d4d0c8] px-2 py-1 flex items-center gap-2 border-t border-white border-b border-[#808080]">
          <span className="text-xs">←</span>
          <span className="text-xs">→</span>
          <span className="text-xs">⟳</span>
          <div className="flex-1 bg-white border border-[#808080] px-2 py-0.5 text-[11px]">
            https://www.cricketlive.tv/match/ind-vs-aus-2026
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-[#d4d0c8] px-1 pt-1 flex gap-1 border-b border-[#808080]">
          <div className="bg-[#ECE9D8] px-3 py-1 text-[11px] border-t border-l border-r border-white border-b-0 font-bold flex items-center gap-1">
            <Globe size={10} /> Cricket Live 🏏
          </div>
          <div className="bg-[#c0c0c0] px-3 py-1 text-[11px] border border-[#808080] flex items-center gap-1">
            <Globe size={10} /> Cat Videos 🐱
          </div>
          <div className="bg-[#c0c0c0] px-3 py-1 text-[11px] border border-[#808080] flex items-center gap-1">
            <Play size={10} /> YouTube
          </div>
        </div>

        {/* Content */}
        <div className="bg-white p-6 overflow-y-auto flex-1">
          <h2 className="text-lg font-bold text-center mb-6">
            🏏 IND vs AUS - LIVE
          </h2>
          <div className="mx-auto max-w-md bg-[#ECE9D8] p-4 border-2 border-[#808080] shadow-inner">
            <div className="flex justify-between items-center mb-4">
              <div className="text-center">
                <p className="text-sm font-bold">INDIA</p>
                <p className="text-2xl font-bold text-blue-700">287/4</p>
                <p className="text-xs text-gray-600">(42.3 ov)</p>
              </div>
              <div className="text-sm font-bold text-gray-600">vs</div>
              <div className="text-center">
                <p className="text-sm font-bold">AUSTRALIA</p>
                <p className="text-2xl font-bold text-red-600">265/10</p>
                <p className="text-xs text-gray-600">(48.2 ov)</p>
              </div>
            </div>
            <div className="text-center mt-3">
              <p className="text-sm font-bold text-green-700">
                ● LIVE - India need 22 runs from 45 balls
              </p>
            </div>
          </div>
          <div className="flex justify-center gap-6 text-xs mt-6">
            <span className="underline cursor-pointer">Live Chat (2.4k)</span>
            <span className="underline cursor-pointer">Scorecard</span>
            <span className="underline cursor-pointer">Commentary</span>
          </div>
        </div>
      </div>
    </div>
  );
};
