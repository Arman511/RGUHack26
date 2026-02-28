import React, { useState, useEffect } from 'react';
import { Monitor, Globe, MessageCircle, FolderOpen, Volume2 } from 'lucide-react';

interface TaskbarProps {
  meterValue: number;
}

export const Taskbar: React.FC<TaskbarProps> = ({ meterValue }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = time.toLocaleDateString([], { month: 'short', day: 'numeric' });

  return (
    <div className="xp-taskbar fixed bottom-0 left-0 right-0 z-50 flex justify-between">
      <div className="flex items-center gap-1">
        <button className="xp-start-btn">
          <Monitor size={16} />
          <span>Start</span>
        </button>
        <div className="h-6 w-px bg-border mx-1" />
        {/* Quick launch icons (Win7 style) */}
        <div className="flex items-center gap-0.5">
          {[
            { icon: <Globe size={14} />, label: 'Chrome' },
            { icon: <MessageCircle size={14} />, label: 'Teams' },
            { icon: <FolderOpen size={14} />, label: 'Explorer' },
          ].map(item => (
            <button
              key={item.label}
              className="w-8 h-8 flex items-center justify-center hover:bg-primary/10 rounded cursor-pointer"
              title={item.label}
            >
              {item.icon}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 px-2 bg-primary/10 border-l border-border">
        <Volume2 size={12} className="text-muted-foreground" />
        <div className="h-4 w-px bg-border" />
        <div className="text-right">
          <span className="text-xs font-bold block leading-none">{timeStr}</span>
          <span className="text-[9px] text-muted-foreground block leading-none">{dateStr}</span>
        </div>
      </div>
    </div>
  );
};
