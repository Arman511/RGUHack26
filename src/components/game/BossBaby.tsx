import React, { useEffect, useState } from "react";
import { Baby } from "lucide-react";

interface BossBabyProps {
  message: string;
  onDismiss: () => void;
}

export const BossBaby: React.FC<BossBabyProps> = ({
  message,
  onDismiss,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  // Typewriter Effect
  useEffect(() => {
    if (index < message.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + message[index]);
        setIndex(index + 1);
      }, 25); // typing speed
      return () => clearTimeout(timeout);
    }
  }, [index, message]);

  return (
    <div
      className="fixed z-50 flex items-center justify-center"
      style={{
        inset: 0,
        animation: "bossEnter 0.4s ease-out",
      }}
    >
      <div className="xp-window w-[520px]">
        {/* XP Title Bar */}
        <div className="xp-title-bar">
          <div className="flex items-center gap-1.5">
            <Baby size={14} />
            <span className="text-xs font-bold">
              LIAR... CHEATER... <span className="text-red-400">FIRED.</span>
            </span>
          </div>
        </div>

        {/* Dialogue Body */}
        <div className="xp-window-body p-4">
          <div className="flex items-start justify-between gap-4">

            {/* Left: Dialogue Text */}
            <div className="flex-1 bg-[#ECE9D8] border-2 border-[#808080] p-3 text-sm font-bold leading-relaxed min-h-[120px]">
              <p className="whitespace-pre-wrap">
                {displayedText}
                <span className="animate-pulse">▌</span>
              </p>

              {/* Continue Button */}
              {displayedText === message && (
                <div className="mt-4 text-right">
                  <button
                    className="xp-button-primary"
                    onClick={onDismiss}
                  >
                    AGH, fine...
                  </button>
                </div>
              )}
            </div>

            {/* Right: Character */}
            <div className="flex flex-col items-center w-[130px]">
              <div className="w-24 h-24 bg-[#FFD966] border-4 border-black flex items-center justify-center shadow-inner">
                <Baby size={48} className="text-black" />
              </div>

              {/* Name Tag */}
              <div className="mt-2 px-3 py-1 bg-[#245edb] text-white text-xs font-bold border border-black shadow">
                Manager
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};