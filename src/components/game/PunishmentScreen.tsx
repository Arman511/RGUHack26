import React, { useEffect, useState } from "react";
import { Video, MessageCircle, LayoutList } from "lucide-react";
import { OutlookMockup } from "./OutlookMockup";

interface PunishmentScreenProps {
  onComplete: () => void;
  gameStage: string;
}

const PUNISHMENT_TIME_SECONDS = 5;

const PUNISHMENTS = {
  zoom: {
    title: "Zoom - All Hands Meeting",
    icon: <Video size={14} />,
    content: (
      <div className="flex flex-col gap-2 p-2">
        <div className="grid grid-cols-5 gap-1">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="w-10 h-10 bg-foreground/10 border border-border rounded flex items-center justify-center text-[8px] text-muted-foreground"
            >
              {
                [
                  "Dev",
                  "PM",
                  "QA",
                  "HR",
                  "CEO",
                  "CTO",
                  "VP",
                  "Mgr",
                  "Lead",
                  "Jr",
                ][i % 10]
              }
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground text-center animate-pulse">
          "Can everyone see my screen?" — Someone, always
        </p>
      </div>
    ),
  },
  teams: {
    title: "Microsoft Teams - Sprint Chat",
    icon: <MessageCircle size={14} />,
    content: (
      <div className="flex flex-col gap-1 p-2 text-[10px]">
        {[
          'PM: "Quick sync?"',
          'Dev: "Sure"',
          "PM: *shares 47 slides*",
          'Dev: "..."',
          'PM: "This should only take 5 mins"',
          "(45 minutes later)",
          'PM: "Let\'s continue offline"',
        ].map((msg, i) => (
          <p key={i} className="text-card-foreground">
            {msg}
          </p>
        ))}
      </div>
    ),
  },
  jira: {
    title: "Jira - Sprint Board",
    icon: <LayoutList size={14} />,
    content: (
      <div className="grid grid-cols-3 gap-1 p-2 text-[8px]">
        <div className="bg-foreground/5 p-1 border border-border">
          <p className="font-bold text-card-foreground mb-1">TO DO (47)</p>
          {["Fix prod", "Update docs", "Code review", "Sprint retro"].map(
            (t) => (
              <div
                key={t}
                className="bg-card border border-border p-0.5 mb-0.5 text-card-foreground"
              >
                {t}
              </div>
            ),
          )}
        </div>
        <div className="bg-foreground/5 p-1 border border-border">
          <p className="font-bold text-card-foreground mb-1">
            IN PROGRESS (12)
          </p>
          {["Refactor API", "DB migration"].map((t) => (
            <div
              key={t}
              className="bg-warning/20 border border-warning/40 p-0.5 mb-0.5 text-card-foreground"
            >
              {t}
            </div>
          ))}
        </div>
        <div className="bg-foreground/5 p-1 border border-border">
          <p className="font-bold text-card-foreground mb-1">DONE (2)</p>
          <div className="bg-success/20 border border-success/40 p-0.5 mb-0.5 text-card-foreground">
            Update README
          </div>
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
  onComplete, gameStage
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
