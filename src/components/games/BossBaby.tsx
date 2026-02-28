import React from 'react';
import { Baby } from 'lucide-react';

interface BossBabyProps {
  message: string;
  onDismiss: () => void;
}

export const BossBaby: React.FC<BossBabyProps> = ({ message, onDismiss }) => {
  return (
    <div
      className="fixed z-50 flex flex-col items-center"
      style={{
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        animation: 'bossEnter 0.5s ease-out',
      }}
    >
      <div className="xp-window w-[380px]">
        <div className="xp-title-bar">
          <div className="flex items-center gap-1.5">
            <Baby size={14} />
            <span className="text-xs">Boss Baby - URGENT</span>
          </div>
        </div>
        <div className="xp-window-body flex flex-col items-center gap-3 p-4">
          <div className="w-20 h-20 rounded-full bg-warning flex items-center justify-center border-4 border-foreground">
            <Baby size={40} className="text-foreground" />
          </div>
          <p className="text-sm text-center font-bold text-card-foreground leading-relaxed">
            {message}
          </p>
          <button className="xp-button-primary" onClick={onDismiss}>
            OK, Boss...
          </button>
        </div>
      </div>
    </div>
  );
};
