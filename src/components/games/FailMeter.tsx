import React from 'react';

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
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-30">
      <svg width="240" height="130" viewBox="0 0 240 130">
        {/* Background arc */}
        <path
          d="M 20 110 A 100 100 0 0 1 220 110"
          fill="none"
          stroke="hsl(0 0% 70%)"
          strokeWidth="18"
          strokeLinecap="round"
        />
        {/* FIRED zone (left - green for player, it's victory) */}
        <path
          d="M 20 110 A 100 100 0 0 1 70 30"
          fill="none"
          stroke="hsl(120 60% 40%)"
          strokeWidth="18"
          strokeLinecap="round"
        />
        {/* Middle zone */}
        <path
          d="M 70 30 A 100 100 0 0 1 170 30"
          fill="none"
          stroke="hsl(45 100% 55%)"
          strokeWidth="18"
          strokeLinecap="round"
        />
        {/* PROMOTED zone (right - red for player, it's loss) */}
        <path
          d="M 170 30 A 100 100 0 0 1 220 110"
          fill="none"
          stroke="hsl(0 85% 50%)"
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
        <text x="15" y="125" fontSize="10" fontWeight="bold" fill="hsl(120 60% 35%)" fontFamily="Tahoma">
          🎉 FIRED
        </text>
        <text x="175" y="125" fontSize="10" fontWeight="bold" fill="hsl(0 85% 50%)" fontFamily="Tahoma">
          PROMOTED 😱
        </text>
      </svg>
    </div>
  );
};
