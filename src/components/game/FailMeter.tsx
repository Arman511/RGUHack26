import React from "react";
import { DraggableWindow } from "./DraggableWindow";

interface FailMeterProps {
  value: number; // -100 (FIRED) to +100 (PROMOTED)
}

export const FailMeter: React.FC<FailMeterProps> = ({ value }) => {
  // Map value from [-100, 100] to angle [180, 0] degrees
  // -100 = 180deg (left, FIRED), 0 = 90deg (center), 100 = 0deg (right, PROMOTED)
  const angle = 90 - (value / 100) * 90;
  const radians = (angle * Math.PI) / 180;

  const cx = 120;
  const cy = 110;
  const r = 90;
  const needleX = cx + r * 0.85 * Math.cos(radians);
  const needleY = cy - r * 0.85 * Math.sin(radians);

  return (
    <DraggableWindow
      title="Performance Meter"
      width={296}
      initialX={window.innerWidth - 310}
      initialY={8}
      closable={false}
    >
      <div className="p-1">
        <div
          className="border-2 p-1"
          style={{
            borderColor:
              "hsl(0 0% 80%) hsl(0 0% 45%) hsl(0 0% 45%) hsl(0 0% 80%)",
          }}
        >
          <svg width="240" height="144" viewBox="0 0 240 144">
            {/* Background arc */}
            <path
              d="M 20 110 A 100 100 0 0 1 220 110"
              fill="none"
              stroke="hsl(0 0% 70%)"
              strokeWidth="18"
              strokeLinecap="round"
            />
            {/* FIRED zone (left - green, 40%) */}
            <path
              d="M 20 110 A 100 100 0 0 1 89.1 14.9"
              fill="none"
              stroke="hsl(var(--success))"
              strokeWidth="18"
              strokeLinecap="round"
            />
            {/* Middle zone (yellow, 20%) */}
            <path
              d="M 89.1 14.9 A 100 100 0 0 1 150.9 14.9"
              fill="none"
              stroke="hsl(var(--warning))"
              strokeWidth="18"
              strokeLinecap="round"
            />
            {/* PROMOTED zone (right - red, 40%) */}
            <path
              d="M 150.9 14.9 A 100 100 0 0 1 220 110"
              fill="none"
              stroke="hsl(var(--demerit))"
              strokeWidth="18"
              strokeLinecap="round"
            />

            {/* Needle */}
            <line
              x1={cx}
              y1={cy}
              x2={needleX}
              y2={needleY}
              stroke="hsl(0 0% 0%)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx={cx} cy={cy} r="6" fill="hsl(0 0% 20%)" />

            {/* Labels */}
            <text
              x="18"
              y="138"
              fontSize="10"
              fontWeight="bold"
              fill="hsl(var(--success))"
              fontFamily="Tahoma"
            >
              🎉 FIRED
            </text>
            <text
              x="230"
              y="138"
              textAnchor="end"
              fontSize="10"
              fontWeight="bold"
              fill="hsl(var(--demerit))"
              fontFamily="Tahoma"
            >
              PROMOTED 😱
            </text>
          </svg>
        </div>
      </div>
    </DraggableWindow>
  );
};
