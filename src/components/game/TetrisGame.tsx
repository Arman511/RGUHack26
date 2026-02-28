import React, { useRef, useEffect, useState } from 'react';

const COLS = 10;
const ROWS = 18;
const CELL = 20;
const LABELS = ['BUG', 'UI', 'DEBT', 'FIX', 'TEST'];
const TIMER_SECONDS = 15;

const SHAPES = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[0, 1, 0], [1, 1, 1]], // T
  [[1, 0], [1, 0], [1, 1]], // L
  [[0, 1], [0, 1], [1, 1]], // J
];

const COLORS = ['#4cc9f0', '#f72585', '#7209b7', '#4361ee', '#4895ef'];

interface TetrisGameProps {
  onTopReached: () => void;
  onCleared: () => void;
}

export const TetrisGame: React.FC<TetrisGameProps> = ({ onTopReached, onCleared }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const grid: (string | null)[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    let currentPiece: { shape: number[][]; color: string; label: string; x: number; y: number } | null = null;
    let running = true;
    let dropCounter = 0;
    let lastTime = 0;
    let startTime = performance.now();

    function newPiece() {
      const idx = Math.floor(Math.random() * SHAPES.length);
      currentPiece = {
        shape: SHAPES[idx],
        color: COLORS[idx],
        label: LABELS[Math.floor(Math.random() * LABELS.length)],
        x: Math.floor(COLS / 2) - 1,
        y: 0,
      };
      if (collides(currentPiece)) {
        running = false;
        setGameOver(true);
        onTopReached();
      }
    }

    function collides(piece: typeof currentPiece) {
      if (!piece) return false;
      for (let r = 0; r < piece.shape.length; r++) {
        for (let c = 0; c < piece.shape[r].length; c++) {
          if (piece.shape[r][c]) {
            const nx = piece.x + c;
            const ny = piece.y + r;
            if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
            if (ny >= 0 && grid[ny][nx]) return true;
          }
        }
      }
      return false;
    }

    function merge() {
      if (!currentPiece) return;
      for (let r = 0; r < currentPiece.shape.length; r++) {
        for (let c = 0; c < currentPiece.shape[r].length; c++) {
          if (currentPiece.shape[r][c]) {
            const ny = currentPiece.y + r;
            const nx = currentPiece.x + c;
            if (ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS) {
              grid[ny][nx] = currentPiece.color;
            }
          }
        }
      }
      for (let r = ROWS - 1; r >= 0; r--) {
        if (grid[r].every(c => c !== null)) {
          grid.splice(r, 1);
          grid.unshift(Array(COLS).fill(null));
          setScore(prev => prev + 100);
          r++;
        }
      }
    }

    function drop() {
      if (!currentPiece) return;
      currentPiece.y++;
      if (collides(currentPiece)) {
        currentPiece.y--;
        merge();
        newPiece();
      }
    }

    function move(dir: number) {
      if (!currentPiece) return;
      currentPiece.x += dir;
      if (collides(currentPiece)) currentPiece.x -= dir;
    }

    function rotate() {
      if (!currentPiece) return;
      const rotated = currentPiece.shape[0].map((_, i) =>
        currentPiece!.shape.map(row => row[i]).reverse()
      );
      const old = currentPiece.shape;
      currentPiece.shape = rotated;
      if (collides(currentPiece)) currentPiece.shape = old;
    }

    function draw() {
      ctx.fillStyle = '#0a0a1a';
      ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (grid[r][c]) {
            ctx.fillStyle = grid[r][c]!;
            ctx.fillRect(c * CELL, r * CELL, CELL - 1, CELL - 1);
          }
        }
      }
      if (currentPiece) {
        ctx.fillStyle = currentPiece.color;
        for (let r = 0; r < currentPiece.shape.length; r++) {
          for (let c = 0; c < currentPiece.shape[r].length; c++) {
            if (currentPiece.shape[r][c]) {
              ctx.fillRect((currentPiece.x + c) * CELL, (currentPiece.y + r) * CELL, CELL - 1, CELL - 1);
            }
          }
        }
        ctx.fillStyle = '#fff';
        ctx.font = '8px monospace';
        ctx.fillText(currentPiece.label, (currentPiece.x + 0.2) * CELL, (currentPiece.y + 1) * CELL);
      }
      ctx.strokeStyle = '#1a1a3e';
      for (let r = 0; r <= ROWS; r++) {
        ctx.beginPath(); ctx.moveTo(0, r * CELL); ctx.lineTo(COLS * CELL, r * CELL); ctx.stroke();
      }
      for (let c = 0; c <= COLS; c++) {
        ctx.beginPath(); ctx.moveTo(c * CELL, 0); ctx.lineTo(c * CELL, ROWS * CELL); ctx.stroke();
      }
    }

    function gameLoop(time: number) {
      if (!running) return;
      const delta = time - lastTime;
      lastTime = time;
      dropCounter += delta;

      // Check timer
      const elapsed = (time - startTime) / 1000;
      const remaining = Math.max(0, TIMER_SECONDS - elapsed);
      setTimeLeft(Math.ceil(remaining));
      if (remaining <= 0) {
        running = false;
        onCleared(); // survived!
        return;
      }

      if (dropCounter > 500) {
        drop();
        dropCounter = 0;
      }
      draw();
      requestAnimationFrame(gameLoop);
    }

    const keyHandler = (e: KeyboardEvent) => {
      if (!running) return;
      if (e.key === 'ArrowLeft') move(-1);
      if (e.key === 'ArrowRight') move(1);
      if (e.key === 'ArrowDown') drop();
      if (e.key === 'ArrowUp') rotate();
    };

    window.addEventListener('keydown', keyHandler);
    newPiece();
    startTime = performance.now();
    requestAnimationFrame(gameLoop);

    return () => {
      running = false;
      window.removeEventListener('keydown', keyHandler);
    };
  }, [onTopReached, onCleared]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex justify-between w-full px-1">
        <span className="text-xs text-card-foreground">Score: {score}</span>
        <span className={`text-xs font-bold ${timeLeft <= 10 ? 'text-destructive animate-pulse' : 'text-card-foreground'}`}>
          ⏱ {timeLeft}s
        </span>
      </div>
      <canvas ref={canvasRef} width={COLS * CELL} height={ROWS * CELL} className="border border-border" />
      <p className="text-[10px] text-muted-foreground">Survive 30s! Arrow keys to move/rotate.</p>
    </div>
  );
};
