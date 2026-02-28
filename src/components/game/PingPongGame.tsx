import React, { useRef, useEffect, useState, useCallback } from "react";

interface PingPongGameProps {
  onWin: () => void;
  onLose: () => void;
  playerAvatar?: string;
  botAvatar?: string;
  playerName?: string;
}

export const PingPongGame: React.FC<PingPongGameProps> = ({
  onWin,
  onLose,
  playerAvatar,
  botAvatar,

}) => {
  const BALL_SPEED_X = 3.4;
  const BALL_SPEED_Y = 2.2;
  // Marty Supreme color palette
  const COLOR_BG = '#0a0a0a';
  const COLOR_PRIMARY = '#ff8c00';
  const COLOR_SECONDARY = '#ff4500';
  const COLOR_UI_TEXT = '#ffffff';

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
    const AI_PADDLE_SPEED = 1.2;
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

      // Draw background
      ctx.fillStyle = COLOR_BG;
      ctx.fillRect(0, 0, 350, 240);

      // Center dashed line (muted orange)
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = 'rgba(255,140,0,0.45)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(175, 0); ctx.lineTo(175, 240); ctx.stroke();
      ctx.setLineDash([]);

      // Paddles with inner + outer glow
      ctx.save();
      ctx.shadowColor = COLOR_PRIMARY;
      ctx.shadowBlur = 14;
      // left paddle gradient (brighter center)
      const leftGrad = ctx.createLinearGradient(5, g.paddleY, 17, g.paddleY + PADDLE_H);
      leftGrad.addColorStop(0, COLOR_SECONDARY);
      leftGrad.addColorStop(0.5, COLOR_PRIMARY);
      leftGrad.addColorStop(1, COLOR_SECONDARY);
      ctx.fillStyle = leftGrad;
      ctx.fillRect(5, g.paddleY, 12, PADDLE_H);
      ctx.restore();

      ctx.save();
      ctx.shadowColor = COLOR_PRIMARY;
      ctx.shadowBlur = 12;
      const rightGrad = ctx.createLinearGradient(333, g.aiY, 345, g.aiY + PADDLE_H);
      rightGrad.addColorStop(0, COLOR_SECONDARY);
      rightGrad.addColorStop(0.5, COLOR_PRIMARY);
      rightGrad.addColorStop(1, COLOR_SECONDARY);
      ctx.fillStyle = rightGrad;
      ctx.fillRect(333, g.aiY, 12, PADDLE_H);
      ctx.restore();

      // Ball with radial gradient + glow (looks like a small lightbulb)
      ctx.save();
      const r = 6;
      const grad = ctx.createRadialGradient(g.ballX, g.ballY, 1, g.ballX, g.ballY, r + 8);
      grad.addColorStop(0, 'rgba(255, 245, 230, 1)');
      grad.addColorStop(0.2, COLOR_PRIMARY);
      grad.addColorStop(0.6, COLOR_SECONDARY);
      grad.addColorStop(1, 'rgba(255,69,0,0.0)');
      ctx.fillStyle = grad;
      ctx.shadowColor = COLOR_PRIMARY;
      ctx.shadowBlur = 18;
      ctx.beginPath(); ctx.arc(g.ballX, g.ballY, r, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      // Scores: labels in white, values below
      ctx.fillStyle = COLOR_UI_TEXT;
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('You', 140, 18);
      ctx.fillText('Marty', 200, 18);
      ctx.font = '24px monospace';
      ctx.fillText(String(g.playerScore), 140, 38);
      ctx.fillText(String(g.aiScore), 200, 38);

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
      {/* avatar above game, right-aligned */}
      {playerAvatar && (
        <div className="w-full flex justify-between items-center px-1">
          <img
            src={playerAvatar}
            alt={'Player avatar'}
            className="w-10 h-10 rounded-full border-2 border-primary object-cover"
          />
          <img
            src={botAvatar}
            alt={'Bot avatar'}
            className="w-10 h-10 rounded-full border-2 border-primary object-cover"
          />
        </div>
      )}

      <p className="text-xs text-card-foreground">W/S or ↑/↓ to move. First to 3 wins!</p>
      <canvas
        ref={canvasRef}
        width={350}
        height={240}
        className="border border-border"
        style={{ border: `2px solid ${COLOR_PRIMARY}`, borderRadius: 10, background: COLOR_BG }}
      />
      <div className="text-xs text-muted-foreground">
        You: {scores.player} | Marty Supreme: {scores.ai}
      </div>
    </div>
  );
};
