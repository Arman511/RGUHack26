import React, { useState, useCallback, useEffect } from "react";
import { Globe, Play } from "lucide-react";

const MAX_BALLS_PER_INNINGS = 90 * 6;

type BattingTeam = "INDIA" | "AUSTRALIA" | "DONE";

interface InningsState {
  runs: number;
  wickets: number;
  balls: number;
}

interface MatchState {
  battingTeam: BattingTeam;
  india: InningsState;
  australia: InningsState;
}

function formatOvers(ballsFaced: number) {
  return `${Math.floor(ballsFaced / 6)}.${ballsFaced % 6}`;
}

function isInningsComplete(innings: InningsState) {
  return innings.wickets >= 10 || innings.balls >= MAX_BALLS_PER_INNINGS;
}

export const ProcrastinationDesktop: React.FC = () => {
  const [pos, setPos] = useState({ x: 96, y: 40 });
  const [activeTab, setActiveTab] = useState<"cricket" | "cat" | "youtube">(
    "cricket",
  );
  const [match, setMatch] = useState<MatchState>({
    battingTeam: "INDIA",
    india: { runs: 0, wickets: 0, balls: 0 },
    australia: { runs: 0, wickets: 0, balls: 0 },
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setMatch((prev) => {
        if (prev.battingTeam === "DONE") return prev;

        const teamKey = prev.battingTeam === "INDIA" ? "india" : "australia";
        const currentInnings = prev[teamKey];

        if (isInningsComplete(currentInnings)) {
          if (prev.battingTeam === "INDIA") {
            return { ...prev, battingTeam: "AUSTRALIA" };
          }
          return { ...prev, battingTeam: "DONE" };
        }

        const outcomeRoll = Math.random();
        let runDelta = 0;
        let wicketDelta = 0;

        if (outcomeRoll < 0.04) {
          wicketDelta = 1;
        } else if (outcomeRoll < 0.44) {
          runDelta = 0;
        } else if (outcomeRoll < 0.79) {
          runDelta = 1;
        } else if (outcomeRoll < 0.91) {
          runDelta = 2;
        } else if (outcomeRoll < 0.94) {
          runDelta = 3;
        } else if (outcomeRoll < 0.995) {
          runDelta = 4;
        } else {
          runDelta = 6;
        }

        const nextInnings: InningsState = {
          runs: currentInnings.runs + runDelta,
          wickets: Math.min(10, currentInnings.wickets + wicketDelta),
          balls: currentInnings.balls + 1,
        };

        const nextState: MatchState = {
          ...prev,
          [teamKey]: nextInnings,
        } as MatchState;

        if (isInningsComplete(nextInnings)) {
          if (prev.battingTeam === "INDIA") {
            return { ...nextState, battingTeam: "AUSTRALIA" };
          }
          return { ...nextState, battingTeam: "DONE" };
        }

        return nextState;
      });
    }, 1900);

    return () => clearInterval(timer);
  }, []);

  const indiaRuns = match.india.runs;
  const australiaRuns = match.australia.runs;

  const liveLine =
    match.battingTeam === "INDIA"
      ? "● LIVE - India 1st innings in progress"
      : match.battingTeam === "AUSTRALIA"
        ? indiaRuns === australiaRuns
          ? "● LIVE - Scores level"
          : australiaRuns < indiaRuns
            ? `● LIVE - Australia trail by ${indiaRuns - australiaRuns} runs`
            : `● LIVE - Australia lead by ${australiaRuns - indiaRuns} runs`
        : indiaRuns === australiaRuns
          ? "● RESULT - Match tied after one innings each"
          : indiaRuns > australiaRuns
            ? `● RESULT - India lead by ${indiaRuns - australiaRuns} runs after one innings each`
            : `● RESULT - Australia lead by ${australiaRuns - indiaRuns} runs after one innings each`;

  const statusColorClass =
    match.battingTeam !== "DONE"
      ? "text-green-700"
      : indiaRuns > australiaRuns
        ? "text-blue-700"
        : indiaRuns < australiaRuns
          ? "text-red-700"
          : "text-gray-700";

  const browserTitle =
    activeTab === "cricket"
      ? "CricketLiveScore.tv"
      : activeTab === "cat"
        ? "CatVideosNow.tv"
        : "YouTube";

  const browserUrl =
    activeTab === "cricket"
      ? "https://www.cricketlive.tv/match/ind-vs-aus-2026"
      : activeTab === "cat"
        ? "https://www.catvideosnow.tv/watch/funniest-cats"
        : "https://www.youtube.com/watch?v=minecraft-live";

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
              Google Chrome - {browserTitle}
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
            {browserUrl}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-[#d4d0c8] px-1 pt-1 flex gap-1 border-b border-[#808080]">
          <button
            type="button"
            onClick={() => setActiveTab("cricket")}
            className={`${activeTab === "cricket"
              ? "bg-[#ECE9D8] border-t border-l border-r border-white border-b-0 font-bold"
              : "bg-[#c0c0c0] border border-[#808080]"
              } px-3 py-1 text-[11px] flex items-center gap-1`}
          >
            <Globe size={10} /> Cricket Live 🏏
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("cat")}
            className={`${activeTab === "cat"
              ? "bg-[#ECE9D8] border-t border-l border-r border-white border-b-0 font-bold"
              : "bg-[#c0c0c0] border border-[#808080]"
              } px-3 py-1 text-[11px] flex items-center gap-1`}
          >
            <Globe size={10} /> Cat Videos 🐱
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("youtube")}
            className={`${activeTab === "youtube"
              ? "bg-[#ECE9D8] border-t border-l border-r border-white border-b-0 font-bold"
              : "bg-[#c0c0c0] border border-[#808080]"
              } px-3 py-1 text-[11px] flex items-center gap-1`}
          >
            <Play size={10} /> YouTube
          </button>
        </div>

        {/* Content */}
        <div className="bg-white p-6 overflow-y-auto flex-1">
          {activeTab === "cricket" && (
            <>
              <h2 className="text-lg font-bold text-center mb-6">
                🏏 IND vs AUS - LIVE
              </h2>
              <div className="mx-auto max-w-md bg-[#ECE9D8] p-4 border-2 border-[#808080] shadow-inner">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-center">
                    <p className="text-sm font-bold">INDIA</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {match.india.runs}/{match.india.wickets}
                    </p>
                    <p className="text-xs text-gray-600">
                      ({formatOvers(match.india.balls)} ov)
                    </p>
                  </div>
                  <div className="text-sm font-bold text-gray-600">vs</div>
                  <div className="text-center">
                    <p className="text-sm font-bold">AUSTRALIA</p>
                    <p className="text-2xl font-bold text-red-600">
                      {match.australia.runs}/{match.australia.wickets}
                    </p>
                    <p className="text-xs text-gray-600">
                      ({formatOvers(match.australia.balls)} ov)
                    </p>
                  </div>
                </div>
                <div className="text-center mt-3">
                  <p className={`text-sm font-bold ${statusColorClass}`}>
                    {liveLine}
                  </p>
                </div>
              </div>
              <div className="flex justify-center gap-6 text-xs mt-6">
                <span className="underline cursor-pointer">Live Chat (2.4k)</span>
                <span className="underline cursor-pointer">Scorecard</span>
                <span className="underline cursor-pointer">Commentary</span>
              </div>
            </>
          )}

          {activeTab === "cat" && (
            <div className="h-full flex flex-col items-center justify-center gap-4">
              <h2 className="text-lg font-bold text-center">🐱 Cat Videos - LIVE</h2>
              <img
                src="/cats.gif"
                alt="Funny cat video"
                className="max-h-[320px] w-auto border-2 border-[#808080]"
              />
            </div>
          )}

          {activeTab === "youtube" && (
            <div className="h-full flex flex-col items-center justify-center gap-4">
              <h2 className="text-lg font-bold text-center">▶ YouTube</h2>
              <div className="relative w-full max-w-[560px] border-2 border-[#808080] bg-black">
                <img
                  src="/minecraft.jpg"
                  alt="Minecraft gameplay"
                  className="w-full h-auto max-h-[315px] object-cover opacity-85"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/25">
                  <div className="w-10 h-10 border-4 border-white/40 border-t-white rounded-full animate-spin" />
                  <p className="text-xs font-bold text-white drop-shadow">
                    Buffering...
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-600 font-bold">
                probably your office Wi-Fi.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
