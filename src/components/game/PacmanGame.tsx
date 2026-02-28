import React, { useRef, useEffect, useState, useCallback } from "react";

const CELL = 20;
const COLS = 15;
const ROWS = 13;
const EMAIL_COUNT = 20;

// Simple maze: 0=path, 1=wall
const MAZE: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

interface Ghost {
  x: number;
  y: number;
  color: string;
  label: string;
  dx: number;
  dy: number;
}

interface PacmanGameProps {
  onWin: () => void;
  onLose: () => void;
}

export const PacmanGame: React.FC<PacmanGameProps> = ({ onWin, onLose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [emailsLeft, setEmailsLeft] = useState(EMAIL_COUNT);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;
    let px = 1,
      py = 1;
    let mouthOpen = true;
    let mouthTimer = 0;
    let dir = { dx: 0, dy: 0 };

    // Place emails on paths
    const emails: { x: number; y: number; eaten: boolean }[] = [];
    const paths: { x: number; y: number }[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (MAZE[r][c] === 0 && !(r === 1 && c === 1))
          paths.push({ x: c, y: r });
      }
    }
    // Shuffle and pick
    for (let i = paths.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [paths[i], paths[j]] = [paths[j], paths[i]];
    }
    for (let i = 0; i < Math.min(EMAIL_COUNT, paths.length); i++) {
      emails.push({ x: paths[i].x, y: paths[i].y, eaten: false });
    }

    // Ghosts (coworkers)
    const ghosts: Ghost[] = [
      { x: 7, y: 6, color: "#f72585", label: "PM", dx: 1, dy: 0 },
      { x: 13, y: 1, color: "#7209b7", label: "HR", dx: 0, dy: 1 },
      { x: 1, y: 11, color: "#4361ee", label: "CEO", dx: 1, dy: 0 },
    ];

    const canMove = (gx: number, gy: number) => {
      if (gx < 0 || gx >= COLS || gy < 0 || gy >= ROWS) return false;
      return MAZE[gy][gx] === 0;
    };

    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "w") dir = { dx: 0, dy: -1 };
      if (e.key === "ArrowDown" || e.key === "s") dir = { dx: 0, dy: 1 };
      if (e.key === "ArrowLeft" || e.key === "a") dir = { dx: -1, dy: 0 };
      if (e.key === "ArrowRight" || e.key === "d") dir = { dx: 1, dy: 0 };
    };
    window.addEventListener("keydown", keyHandler);

    let moveCounter = 0;

    const loop = () => {
      if (!running) return;
      moveCounter++;

      // Player movement (every 8 frames)
      if (moveCounter % 8 === 0) {
        const nx = px + dir.dx;
        const ny = py + dir.dy;
        if (canMove(nx, ny)) {
          px = nx;
          py = ny;
        }

        // Eat emails
        for (const em of emails) {
          if (!em.eaten && em.x === px && em.y === py) {
            em.eaten = true;
            const left = emails.filter((e) => !e.eaten).length;
            setEmailsLeft(left);
            if (left === 0) {
              running = false;
              setDone(true);
              onWin();
              return;
            }
          }
        }
      }

      // Ghost movement (every 12 frames)
      if (moveCounter % 12 === 0) {
        for (const g of ghosts) {
          // Simple random movement with bias toward player
          const dirs = [
            { dx: 1, dy: 0 },
            { dx: -1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: 0, dy: -1 },
          ].filter((d) => canMove(g.x + d.dx, g.y + d.dy));

          if (dirs.length > 0) {
            // 40% chance to move toward player
            if (Math.random() < 0.4) {
              dirs.sort((a, b) => {
                const da =
                  Math.abs(g.x + a.dx - px) + Math.abs(g.y + a.dy - py);
                const db =
                  Math.abs(g.x + b.dx - px) + Math.abs(g.y + b.dy - py);
                return da - db;
              });
            }
            const pick =
              Math.random() < 0.6
                ? dirs[0]
                : dirs[Math.floor(Math.random() * dirs.length)];
            g.x += pick.dx;
            g.y += pick.dy;
          }

          // Check collision
          if (g.x === px && g.y === py) {
            running = false;
            setDone(true);
            onLose();
            return;
          }
        }
      }

      // Mouth animation
      mouthTimer++;
      if (mouthTimer % 10 === 0) mouthOpen = !mouthOpen;

      // Draw
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);

      // Maze
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (MAZE[r][c] === 1) {
            ctx.fillStyle = "#2a2a5e";
            ctx.fillRect(c * CELL, r * CELL, CELL, CELL);
          }
        }
      }

      // Emails (dots)
      for (const em of emails) {
        if (!em.eaten) {
          ctx.fillStyle = "#fcbf49";
          ctx.font = "12px serif";
          ctx.fillText("✉", em.x * CELL + 3, em.y * CELL + 15);
        }
      }

      // Pacman
      ctx.fillStyle = "#f7d000";
      ctx.beginPath();
      const startAngle = mouthOpen ? 0.25 : 0.05;
      const endAngle = mouthOpen ? -0.25 : -0.05;
      const facing =
        dir.dx === -1
          ? Math.PI
          : dir.dy === -1
            ? -Math.PI / 2
            : dir.dy === 1
              ? Math.PI / 2
              : 0;
      ctx.arc(
        px * CELL + CELL / 2,
        py * CELL + CELL / 2,
        CELL / 2 - 2,
        facing + startAngle * Math.PI,
        facing + (2 - endAngle) * Math.PI,
      );
      ctx.lineTo(px * CELL + CELL / 2, py * CELL + CELL / 2);
      ctx.fill();

      // Ghosts
      for (const g of ghosts) {
        ctx.fillStyle = g.color;
        ctx.beginPath();
        const gx = g.x * CELL + CELL / 2;
        const gy = g.y * CELL + CELL / 2;
        ctx.arc(gx, gy - 2, CELL / 2 - 2, Math.PI, 0);
        ctx.lineTo(gx + CELL / 2 - 2, gy + CELL / 2 - 2);
        ctx.lineTo(gx - CELL / 2 + 2, gy + CELL / 2 - 2);
        ctx.fill();
        // Eyes
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(gx - 3, gy - 4, 3, 0, Math.PI * 2);
        ctx.arc(gx + 3, gy - 4, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(gx - 2, gy - 3, 1.5, 0, Math.PI * 2);
        ctx.arc(gx + 4, gy - 3, 1.5, 0, Math.PI * 2);
        ctx.fill();
        // Label
        ctx.fillStyle = "#fff";
        ctx.font = "7px monospace";
        ctx.fillText(g.label, gx - 6, gy + CELL / 2 + 6);
      }

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
    return () => {
      running = false;
      window.removeEventListener("keydown", keyHandler);
    };
  }, [onWin, onLose]);

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs text-card-foreground font-bold">
        📧 Emails remaining: {emailsLeft} | Avoid coworkers!
      </p>
      <canvas
        ref={canvasRef}
        width={COLS * CELL}
        height={ROWS * CELL}
        className="border border-border"
      />
      <p className="text-[10px] text-muted-foreground">
        Arrow keys or WASD to move
      </p>
    </div>
  );
};
