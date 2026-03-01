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
      <div className="flex flex-col h-[420px] text-[11px] bg-[#ece9d8] border border-[#7f9db9]">
        {/* Menu */}
        <div className="bg-[#d4d0c8] border-b border-[#7f9db9] px-2 py-[2px] flex gap-4">
          <span>Call</span>
          <span>View</span>
          <span>Tools</span>
          <span>Help</span>
        </div>

        {/* Main video */}
        <div className="flex-1 p-2 bg-[#f6f4ea]">
          <div className="relative h-full bg-black border border-black">
            <img
              src="public/zoomscreenshare.png"
              className="w-full h-full object-cover opacity-90"
            />

            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white px-2 py-[2px]">
              PM – Screen Sharing (Poor Connection)
            </div>
          </div>
        </div>

        {/* Participant strip */}
        <div className="grid grid-cols-4 gap-1 p-2 border-t border-[#7f9db9] bg-[#ece9d8]">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 border border-black bg-black" />
          ))}
        </div>

        {/* Status */}
        <div className="bg-[#d4d0c8] border-t border-[#7f9db9] px-2 py-[2px]">
          Connected • 12 participants
        </div>
      </div>
    ),
  },
  teams: {
    title: "Microsoft Teams - Sprint Chat",
    icon: <MessageCircle size={14} />,
    content: (
      <div className="flex h-[420px] text-[11px] bg-[#ece9d8] border border-[#7f9db9]">
        {/* Sidebar */}
        <div className="w-36 border-r border-[#7f9db9] bg-[#f6f4ea] p-2">
          <div className="font-bold mb-1">Channels</div>
          <div># General</div>
          <div className="font-bold"># Engineering</div>
          <div># Incidents</div>
        </div>

        {/* Chat */}
        <div className="flex-1 flex flex-col">
          <div className="bg-[#d4d0c8] border-b border-[#7f9db9] px-2 py-[2px]">
            Engineering Chat
          </div>

          <div className="flex-1 p-2 space-y-2 bg-[#f6f4ea]">
            <p>
              <b>Sarah:</b> Prod DB connections high.
            </p>
            <p>
              <b>Michael:</b> API latency increasing.
            </p>
            <p>
              <b>You:</b> Scaling pool?
            </p>
            <p>
              <b>Sarah:</b> Rolling back deployment.
            </p>
          </div>

          <div className="border-t border-[#7f9db9] bg-white px-2 py-1 text-[10px] text-gray-400">
            Type a message...
          </div>
        </div>
      </div>
    ),
  },
  jira: {
    title: "Jira - Sprint Board",
    icon: <LayoutList size={14} />,
    content: (
      <div className="flex flex-col h-[420px] text-[11px] bg-[#ece9d8] border border-[#7f9db9]">
        {/* Toolbar */}
        <div className="bg-[#d4d0c8] border-b border-[#7f9db9] px-2 py-[2px]">
          Project Dashboard
        </div>

        {/* Board */}
        <div className="flex flex-1 gap-2 p-2 bg-[#f6f4ea]">
          {[
            { title: "TO DO", items: ["Fix mobile", "Docs", "Dark mode"] },
            { title: "IN PROGRESS", items: ["Auth flow", "Refactor API"] },
            { title: "DONE", items: ["Update README"] },
          ].map((col) => (
            <div
              key={col.title}
              className="flex-1 border border-[#7f9db9] bg-white"
            >
              <div className="bg-[#d4d0c8] border-b border-[#7f9db9] px-1 font-bold">
                {col.title}
              </div>

              <div className="p-1 space-y-1">
                {col.items.map((i) => (
                  <div
                    key={i}
                    className="border border-[#c0c0c0] bg-[#ffffe1] px-1 py-[2px]"
                  >
                    {i}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Status */}
        <div className="bg-[#d4d0c8] border-t border-[#7f9db9] px-2 py-[2px]">
          47 issues remaining
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
  const punishmentType =
    GAME_STAGE_PUNISHMENT_MAP[gameStage.toLowerCase()] ?? "zoom";
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

  // Unified window size: wide and tall, not fullscreen
  const windowWidth = "w-[700px]";
  const windowHeight = "h-[520px]";
  return (
    <div className="fixed inset-0 z-[60] bg-foreground/60 flex items-center justify-center">
      <div className={`xp-window ${windowWidth} ${windowHeight}`}>
        <div className="xp-title-bar">
          <div className="flex items-center gap-1.5">
            {punishment.icon}
            <span className="text-xs">{punishment.title}</span>
          </div>
        </div>
        <div
          className="xp-window-body"
          style={punishmentType === "email" ? { padding: 0 } : undefined}
        >
          {punishmentType === "email" ? (
            <OutlookMockup onPlayAgain={onComplete} />
          ) : (
            <>
              {isPunishment && (
                <div className="text-center mb-2">
                  <p className="text-xs text-destructive font-bold">
                    ⚠️ PUNISHMENT!
                  </p>
                </div>
              )}
              {punishment.content}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
