import React, { useRef, useEffect, useState, useCallback } from "react";

interface PingPongGameProps {
  onWin: () => void;
  onLose: () => void;
}

export const PingPongGame: React.FC<PingPongGameProps> = ({
  onWin,
  onLose,
}) => {
  const BALL_SPEED_X = 2.5;
  const BALL_SPEED_Y = 1.5;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<{
    ballX: number;
    ballY: number;
    ballVX: number;
    ballVY: number;
    paddleY: number;
    aiY: number;
    playerScore: number;
    aiScore: number;
    running: boolean;
    keysDown: Set<string>;
  }>({
    ballX: 175,
    ballY: 120,
    ballVX: BALL_SPEED_X,
    ballVY: BALL_SPEED_Y,
    paddleY: 90,
    aiY: 90,
    playerScore: 0,
    aiScore: 0,
    running: true,
    keysDown: new Set(),
  });

  const [scores, setScores] = useState({ player: 0, ai: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const g = gameRef.current;

    const keyDown = (e: KeyboardEvent) => {
      g.keysDown.add(e.key);
    };
    const keyUp = (e: KeyboardEvent) => {
      g.keysDown.delete(e.key);
    };
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);

    const PADDLE_SPEED = 5;
    const AI_PADDLE_SPEED = 1.8;
    const PADDLE_H = 60;

    const loop = () => {
      if (!g.running) return;

      // Keyboard paddle control (W/S or Up/Down), clamped
      if (
        g.keysDown.has("w") ||
        g.keysDown.has("W") ||
        g.keysDown.has("ArrowUp")
      ) {
        g.paddleY = Math.max(0, g.paddleY - PADDLE_SPEED);
      }
      if (
        g.keysDown.has("s") ||
        g.keysDown.has("S") ||
        g.keysDown.has("ArrowDown")
      ) {
        g.paddleY = Math.min(240 - PADDLE_H, g.paddleY + PADDLE_SPEED);
      }

      // Ball movement
      g.ballX += g.ballVX;
      g.ballY += g.ballVY;

      // Top/bottom bounce
      if (g.ballY <= 0 || g.ballY >= 240) g.ballVY *= -1;

      // AI movement (clamped)
      const aiCenter = g.aiY + 30;
      if (aiCenter < g.ballY - 15)
        g.aiY = Math.min(240 - PADDLE_H, g.aiY + AI_PADDLE_SPEED);
      else if (aiCenter > g.ballY + 15)
        g.aiY = Math.max(0, g.aiY - AI_PADDLE_SPEED);

      // Player paddle collision (left)
      if (
        g.ballX <= 18 &&
        g.ballY >= g.paddleY &&
        g.ballY <= g.paddleY + PADDLE_H
      ) {
        g.ballVX = Math.abs(g.ballVX);
        g.ballVY += (Math.random() - 0.5) * 2;
      }

      // AI paddle collision (right)
      if (g.ballX >= 332 && g.ballY >= g.aiY && g.ballY <= g.aiY + PADDLE_H) {
        g.ballVX = -Math.abs(g.ballVX);
        g.ballVY += (Math.random() - 0.5) * 2;
      }

      // Scoring
      if (g.ballX < 0) {
        g.aiScore++;
        setScores({ player: g.playerScore, ai: g.aiScore });
        if (g.aiScore >= 3) {
          g.running = false;
          onLose();
          return;
        }
        g.ballX = 175;
        g.ballY = 120;
        g.ballVX = BALL_SPEED_X;
        g.ballVY = BALL_SPEED_Y;
      }
      if (g.ballX > 350) {
        g.playerScore++;
        setScores({ player: g.playerScore, ai: g.aiScore });
        if (g.playerScore >= 3) {
          g.running = false;
          onWin();
          return;
        }
        g.ballX = 175;
        g.ballY = 120;
        g.ballVX = -BALL_SPEED_X;
        g.ballVY = BALL_SPEED_Y;
      }

      // Draw
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, 0, 350, 240);
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = "#444";
      ctx.beginPath();
      ctx.moveTo(175, 0);
      ctx.lineTo(175, 240);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#4cc9f0";
      ctx.fillRect(5, g.paddleY, 12, PADDLE_H);
      ctx.fillStyle = "#f72585";
      ctx.fillRect(333, g.aiY, 12, PADDLE_H);
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(g.ballX, g.ballY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#666";
      ctx.font = "24px monospace";
      ctx.fillText(String(g.playerScore), 140, 30);
      ctx.fillText(String(g.aiScore), 200, 30);

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
    return () => {
      g.running = false;
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
    };
  }, [onWin, onLose]);

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs text-card-foreground">
        W/S or ↑/↓ to move. First to 3 wins!
      </p>
      <canvas
        ref={canvasRef}
        width={350}
        height={240}
        className="border border-border"
      />
      <div className="text-xs text-muted-foreground">
        You: {scores.player} | Boss AI: {scores.ai}
      </div>
    </div>
  );
};
