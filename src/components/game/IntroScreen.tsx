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
        <div className="xp-window w-[680px] max-w-[95vw]">
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

          <div className="xp-window-body flex flex-col items-center gap-8 p-9">
            <div className="select-none flex flex-col gap-1">
              <h1 className="pixel-text text-4xl md:text-5xl font-bold tracking-wide text-foreground">
                LIAR...
              </h1>
              <h1 className="pixel-text text-4xl md:text-5xl font-bold tracking-wide text-foreground">
                CHEATER...
              </h1>
              <h1 className="pixel-text text-5xl md:text-6xl font-extrabold tracking-wider text-destructive">
                FIRED.
              </h1>
            </div>

            <div className="xp-window w-full max-w-[535px]">
              <div className="xp-title-bar">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold">
                    BOSS MESSAGE
                  </span>
                </div>
              </div>
              <div className="xp-window-body flex flex-col gap-6 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-14 flex-1 justify-center">
                    <p className="text-base font-bold leading-relaxed text-left whitespace-pre-wrap">
                      "I hate liars and cheaters. Why are you hired if you don't do
                      your job?{" "}
                      <span className="text-destructive">Focus on work!</span>"
                    </p>
                    <div className="flex justify-start">
                      <button
                        className="xp-button-primary text-xs px-4 py-0.5"
                        onClick={onStart}
                      >
                        I'm ready to get fired!
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="relative w-32 h-32">
                      <img
                        src="/boss-baby.jpeg"
                        alt="Boss Baby"
                        loading="lazy"
                        className="w-full h-full object-cover rounded-full border-2 border-primary"
                      />
                    </div>
                    <span className="text-sm font-bold text-card-foreground mt-2">Boss Baby</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings — bottom right, above taskbar */}
      <div className="absolute bottom-[68px] right-6 z-30 flex items-center">
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
            <span className="text-xs font-bold">Tutorials</span>
            <button
              type="button"
              className="xp-button text-[11px] px-2 py-0.5"
              onClick={() => setSkipTutorials(!skipTutorials)}
            >
              {skipTutorials ? "OFF" : "ON"}
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
