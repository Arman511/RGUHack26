import { Monitor, Settings } from "lucide-react";
import React, { useState } from "react";

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
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden font-sans">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="absolute inset-0 bg-foreground/35" />

      <div className="relative z-10 flex flex-col items-center justify-center gap-6 px-6 text-center w-full">
        <div className="xp-window w-[560px] max-w-[95vw]">
          <div className="xp-title-bar">
            <div className="flex items-center gap-1.5">
              <img
                src="/boss-baby.jpeg"
                alt="Boss Baby"
                className="w-4 h-4 rounded-full object-cover"
              />
              <span className="text-xs">Manager - Workstation Alert</span>
            </div>
            <button className="xp-close-btn" type="button" aria-label="Close">
              ×
            </button>
          </div>

          <div className="xp-window-body flex flex-col items-center gap-5 p-5">
            <div className="select-none flex flex-col gap-1">
              <h1 className="pixel-text text-3xl md:text-4xl font-bold tracking-wide text-foreground">
                LIAR...
              </h1>
              <h1 className="pixel-text text-3xl md:text-4xl font-bold tracking-wide text-foreground">
                CHEATER...
              </h1>
              <h1 className="pixel-text text-4xl md:text-5xl font-extrabold tracking-wider text-destructive">
                FIRED.
              </h1>
            </div>

            <div className="xp-window w-full max-w-[460px]">
              <div className="xp-title-bar-inactive">
                <span className="text-xs">Boss Message</span>
              </div>
              <div className="xp-window-body flex flex-col items-center gap-4 p-4">
                <div className="relative w-20 h-20">
                  <img
                    src="/boss-baby.jpeg"
                    alt="Boss Baby"
                    loading="lazy"
                    className="w-full h-full object-cover rounded-full"
                  />
                  <div className="absolute inset-0 rounded-full border-2 border-primary" />
                </div>

                <p className="text-sm text-center font-bold leading-relaxed text-card-foreground">
                  "I hate liars and cheaters. Why are you hired if you don't do
                  your job?{" "}
                  <span className="text-destructive">Focus on work!</span>"
                </p>
              </div>
            </div>

            <button
              className="xp-button-primary text-base px-10 py-2"
              onClick={onStart}
            >
              🔥 I'm ready to get fired
            </button>
          </div>
        </div>
      </div>

      {/* Settings — bottom right, above taskbar */}
      <div className="absolute bottom-[87px] right-6 z-30 flex items-center">
        {/* Expandable panel slides out to the left, attached to the button */}
        <div
          style={{
            overflow: "hidden",
            width: settingsOpen ? 220 : 0,
            transition: "width 0.25s ease",
            whiteSpace: "nowrap",
          }}
        >
          <div
            style={{
              width: 220,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "linear-gradient(180deg, hsl(0,0%,100%) 0%, hsl(0,0%,85%) 100%)",
              border: "2px solid",
              borderColor: "hsl(0,0%,100%) transparent hsl(220,10%,55%) hsl(0,0%,100%)",
              padding: "0 10px",
              height: 40,
              boxSizing: "border-box",
            }}
          >
            <span className="text-xs font-bold">Skip tutorials</span>
            <button
              type="button"
              className="xp-button text-[11px] px-2 py-0.5"
              onClick={() => setSkipTutorials(!skipTutorials)}
            >
              {skipTutorials ? "ON" : "OFF"}
            </button>
          </div>
        </div>

        {/* Settings icon button */}
        <button
          type="button"
          onClick={() => setSettingsOpen(!settingsOpen)}
          title="Settings"
          style={{
            width: 40,
            height: 40,
            background: "linear-gradient(180deg, hsl(0,0%,100%) 0%, hsl(0,0%,85%) 100%)",
            border: "2px solid",
            borderColor: "hsl(0,0%,100%) hsl(220,10%,55%) hsl(220,10%,55%) hsl(0,0%,100%)",
            borderRadius: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
            boxShadow: "1px 1px 2px rgba(0,0,0,0.3)",
          }}
        >
          <Settings size={20} color="hsl(220,10%,30%)" />
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 xp-taskbar z-20">
        <button className="xp-start-btn">
          <Monitor size={16} />
          <span>Start</span>
        </button>
        <div className="ml-3 text-xs text-foreground/80">
          (Disclaimer: This is not representative of us developers; we are very,
          very, very good employees.)
        </div>
      </div>
    </div>
  );
};
