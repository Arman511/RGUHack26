import React from "react";

interface IntroScreenProps {
  onStart: () => void;
  skipTutorials: boolean;
  setSkipTutorials: (skip: boolean) => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({
  onStart,
  skipTutorials,
  setSkipTutorials,
}) => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background font-sans overflow-hidden">

      {/* XP Blue Gradient Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, hsl(var(--xp-title-start)) 0%, hsl(var(--background)) 40%, hsl(var(--xp-title-end)) 100%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">

        {/* Dramatic XP Header */}
        <div className="flex justify-center w-full">
          <div className="text-white select-none flex flex-col gap-2">

            <h1 className="text-4xl md:text-5xl font-bold tracking-wide drop-shadow-[2px_2px_0px_rgba(0,0,0,0.6)]">
              LIAR...
            </h1>

            <h1 className="text-4xl md:text-5xl font-bold tracking-wide drop-shadow-[2px_2px_0px_rgba(0,0,0,0.6)]">
              CHEATER...
            </h1>

            <h1
              className="text-4xl md:text-5xl font-extrabold tracking-widest text-destructive"
              style={{
                textShadow:
                  "3px 3px 0px #7a0000, 6px 6px 10px rgba(0,0,0,0.6)",
              }}
            >
              FIRED.
            </h1>
          </div>
        </div>

        {/* Boss XP Window */}
        <div className="xp-window w-[420px]">
          <div className="xp-title-bar">
            <div className="flex items-center gap-1.5">
              <img
                src="/boss-baby.jpeg"
                alt="Boss Baby"
                className="w-4 h-4 rounded-full object-cover"
              />
              <span className="text-xs">Manager</span>
            </div>
          </div>

          <div className="xp-window-body flex flex-col items-center gap-4 p-5">
            <div className="relative w-20 h-20">
              <img
                src="/boss-baby.jpeg"
                alt="Boss Baby"
                loading="lazy"
                className="w-full h-full object-cover rounded-full"
              />
              <div className="absolute inset-0 rounded-full border-2 border-primary" />
            </div>

            <p className="text-sm text-center font-bold leading-relaxed">
              "I hate liars and cheaters. Why are you hired if you don't do your
              job?
              <span className="text-red-600">
                {" "}Focus on work!
              </span>"
            </p>
          </div>
        </div>

        {/* Start Button */}
        <button
          className="xp-button-primary text-lg px-10 py-3"
          onClick={onStart}
        >
          🔥 I'm ready to get fired
        </button>

        {/* Skip Tutorial Window */}
        <div className="xp-window w-[340px]">
          <div className="xp-window-body flex items-center justify-between p-3">
            <span className="text-xs font-bold">
              Skip tutorials
            </span>
            <button
              type="button"
              className="xp-button text-[11px] px-3 py-1"
              onClick={() => setSkipTutorials(!skipTutorials)}
            >
              {skipTutorials ? "ON" : "OFF"}
            </button>
          </div>
        </div>
      </div>

      {/* XP Disclaimer */}
      <p className="absolute bottom-4 text-white text-xs opacity-80 text-center px-4 italic">
        (Disclaimer: This is not representative of us developers; we are very,
        very, very good employees.)
      </p>
    </div>
  );
};