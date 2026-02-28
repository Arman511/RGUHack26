import React, { useEffect, useState } from "react";
import { PartyPopper, Frown } from "lucide-react";

interface EndScreenProps {
  type: "fired" | "promoted";
  onRestart: () => void;
}

const CONFETTI_COLORS = [
  "#f72585",
  "#7209b7",
  "#3a0ca3",
  "#4361ee",
  "#4cc9f0",
  "#f77f00",
  "#fcbf49",
];

export const EndScreen: React.FC<EndScreenProps> = ({ type, onRestart }) => {
  const [confetti, setConfetti] = useState<
    { id: number; x: number; color: string; delay: number; size: number }[]
  >([]);

  useEffect(() => {
    if (type === "fired") {
      setConfetti(
        Array.from({ length: 50 }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          color:
            CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          delay: Math.random() * 2,
          size: Math.random() * 8 + 4,
        })),
      );
    }
  }, [type]);

  if (type === "fired") {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/90">
        {confetti.map((c) => (
          <div
            key={c.id}
            className="confetti-piece"
            style={{
              left: `${c.x}%`,
              top: "-20px",
              width: c.size,
              height: c.size,
              backgroundColor: c.color,
              animationDelay: `${c.delay}s`,
              borderRadius: Math.random() > 0.5 ? "50%" : "0",
            }}
          />
        ))}
        <div className="flex flex-col items-center gap-6 z-10">
          <h1
            className="pixel-text text-6xl md:text-8xl font-bold text-destructive"
            style={{ animation: "shake 0.5s ease-in-out infinite" }}
          >
            YOU'RE FIRED!
          </h1>
          <PartyPopper size={64} className="text-warning" />
          <p className="text-xl text-primary-foreground font-bold text-center max-w-md">
            🎉 Congratulations! You successfully avoided all productivity and
            earned your freedom! 🎉
          </p>
          <button
            className="xp-button-primary text-lg px-8 py-2"
            onClick={onRestart}
          >
            🕊️ Freedom (Play Again)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-card">
      <div className="flex flex-col items-center gap-6">
        <Frown size={64} className="text-muted-foreground" />
        <h1 className="pixel-text text-4xl md:text-6xl font-bold text-card-foreground text-center">
          CONGRATULATIONS
        </h1>
        <p className="text-lg text-muted-foreground text-center max-w-md leading-relaxed">
          You were <strong>too good</strong> at your job. You've been promoted
          to
          <br />
          <span className="text-destructive font-bold text-xl">
            Senior Vice President of Meetings
          </span>
        </p>
        <p className="text-sm text-muted-foreground italic">
          You are trapped here forever.
        </p>
        <button
          className="xp-button-primary text-lg px-8 py-2"
          onClick={onRestart}
        >
          Try Again (Escape)
        </button>
      </div>
    </div>
  );
};
