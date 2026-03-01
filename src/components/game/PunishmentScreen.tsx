import React, { useEffect, useState } from "react";
import { Video, MessageCircle, LayoutList } from "lucide-react";
import { OutlookMockup } from "./OutlookMockup";

interface PunishmentScreenProps {
  onComplete: () => void;
  gameStage: string;
  isPunishment: boolean;
}

const PUNISHMENT_TIME_SECONDS = 5;

const PUNISHMENTS = {
  zoom: {
    title: "Zoom - All Hands Meeting",
    icon: <Video size={14} />,
    content: (
  <div className="flex flex-col gap-1 p-2 text-[9px]">
    {/* Fake XP window header */}
    <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-2 py-0.5 rounded-sm text-[9px] font-semibold">
      Skype Call - Sprint Sync
    </div>

    {/* Video grid */}
    <div className="grid grid-cols-2 gap-1">
      {["PM", "Tech Lead", "QA", "You"].map((name, i) => (
        <div
          key={name}
          className="relative h-16 bg-black border border-border rounded overflow-hidden flex items-center justify-center"
        >
          {/* Fake webcam noise */}
          <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(0deg,#ffffff22,#ffffff22_1px,#00000022_2px,#00000022_3px)]" />

          <span className="text-[8px] text-white opacity-80">
            {i === 3 ? "Camera Off" : "Connecting..."}
          </span>

          {/* Name label */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] px-1">
            {name}
          </div>
        </div>
      ))}
    </div>

    {/* Call controls */}
    <div className="flex justify-center gap-2 mt-1">
      <div className="w-4 h-4 rounded-full bg-green-500 border border-black" />
      <div className="w-4 h-4 rounded-full bg-yellow-400 border border-black animate-pulse" />
      <div className="w-4 h-4 rounded-full bg-red-500 border border-black" />
    </div>

    {/* Classic corporate line */}
    <p className="text-center text-[8px] text-muted-foreground mt-1 animate-pulse">
      "You're on mute."
    </p>
  </div>
),
  },
  teams: {
    title: "Microsoft Teams - Sprint Chat",
    icon: <MessageCircle size={14} />,
    content: (
  <div className="flex flex-col p-2 text-[10px] bg-card border border-border rounded gap-1">
    {/* Header */}
    <div className="text-[9px] font-semibold text-muted-foreground border-b border-border pb-1 mb-1">
      # Engineering
    </div>

    {/* Messages */}
    <div className="flex flex-col gap-1">
      <div className="flex flex-col">
        <span className="text-[9px] font-semibold text-card-foreground">
          Sarah
        </span>
        <div className="bg-muted px-1.5 py-1 rounded w-fit max-w-[90%]">
          Prod DB connections are high.
        </div>
      </div>

      <div className="flex flex-col items-end">
        <span className="text-[9px] font-semibold text-primary">You</span>
        <div className="bg-primary/20 px-1.5 py-1 rounded w-fit max-w-[90%]">
          Do we need to scale?
        </div>
      </div>

      <div className="flex flex-col">
        <span className="text-[9px] font-semibold text-card-foreground">
          Michael
        </span>
        <div className="bg-muted px-1.5 py-1 rounded w-fit max-w-[90%]">
          API looks slow too.
        </div>
      </div>

      <div className="flex flex-col">
        <span className="text-[9px] font-semibold text-card-foreground">
          Sarah
        </span>
        <div className="bg-muted px-1.5 py-1 rounded w-fit max-w-[90%]">
          Found a connection leak. Rolling back.
        </div>
      </div>

      <div className="text-center text-[8px] text-muted-foreground mt-1 animate-pulse">
        typing...
      </div>
    </div>
  </div>
),
  },
  jira: {
    title: "Jira - Sprint Board",
    icon: <LayoutList size={14} />,
    content: (
  <div className="flex flex-col gap-1 p-2 text-[9px]">
    {/* Header */}
    <div className="text-[9px] font-semibold text-muted-foreground border-b border-border pb-1">
      Sprint Board
    </div>

    {/* Columns */}
    <div className="grid grid-cols-3 gap-1">
      
      {/* TO DO */}
      <div className="bg-muted/40 border border-border rounded p-1">
        <p className="font-bold text-[8px] mb-1 text-muted-foreground">
          TO DO (3)
        </p>

        {[
          "Fix mobile layout",
          "Update docs",
          "Add dark mode",
        ].map((t) => (
          <div
            key={t}
            className="bg-card border border-border rounded px-1 py-0.5 mb-1 text-card-foreground"
          >
            {t}
          </div>
        ))}
      </div>

      {/* IN PROGRESS */}
      <div className="bg-muted/40 border border-border rounded p-1">
        <p className="font-bold text-[8px] mb-1 text-warning">
          IN PROGRESS (2)
        </p>

        {[
          "Refactor API",
          "Auth flow",
        ].map((t) => (
          <div
            key={t}
            className="bg-warning/20 border border-warning/40 rounded px-1 py-0.5 mb-1 text-card-foreground"
          >
            {t}
          </div>
        ))}
      </div>

      {/* DONE */}
      <div className="bg-muted/40 border border-border rounded p-1">
        <p className="font-bold text-[8px] mb-1 text-success">
          DONE (1)
        </p>

        <div className="bg-success/20 border border-success/40 rounded px-1 py-0.5 text-card-foreground">
          Update README
        </div>
      </div>

    </div>

    {/* Joke footer */}
    <div className="text-center text-[8px] text-muted-foreground mt-1 animate-pulse">
      Sprint ends in 3 minutes...
    </div>
  </div>
),
  },
  email: {
    title: "Outlook",
    icon: <MessageCircle size={14} />,
    content: null,
  },
};

const GAME_STAGE_PUNISHMENT_MAP: Record<string, keyof typeof PUNISHMENTS> = {
  pingpong: "teams",
  wordle: "zoom",
  tetris: "jira",
  pacman: "email",
};

export const PunishmentScreen: React.FC<PunishmentScreenProps> = ({
  onComplete,
  gameStage,
  isPunishment,
}) => {
  const [timer, setTimer] = useState(PUNISHMENT_TIME_SECONDS);
  const punishmentType = GAME_STAGE_PUNISHMENT_MAP[gameStage.toLowerCase()] ?? "zoom";
  const punishment = PUNISHMENTS[punishmentType];

  useEffect(() => {
    setTimer(PUNISHMENT_TIME_SECONDS);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [onComplete, gameStage, punishmentType]);

  return (
    <div className="fixed inset-0 z-[60] bg-foreground/60 flex items-center justify-center">
      <div className={`xp-window ${punishmentType === "email" ? "w-[560px]" : "w-[400px]"}`}>
        <div className="xp-title-bar">
          <div className="flex items-center gap-1.5">
            {punishment.icon}
            <span className="text-xs">{punishment.title}</span>
          </div>
        </div>
        <div className="xp-window-body" style={punishmentType === "email" ? { padding: 0 } : undefined}>
          {punishmentType === "email" ? (
            <OutlookMockup onPlayAgain={onComplete} />
          ) : (
            <>
              <div className="text-center mb-2">
                <p className="text-xs text-destructive font-bold">
                  ⚠️ PUNISHMENT: You must endure {timer}s of work!
                </p>
              </div>
              {punishment.content}
              <div className="mt-2 bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-1000"
                  style={{ width: `${((PUNISHMENT_TIME_SECONDS - timer) / PUNISHMENT_TIME_SECONDS) * 100}%` }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
