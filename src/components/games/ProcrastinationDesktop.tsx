import React from 'react';
import { Globe, Play, Cat } from 'lucide-react';

export const ProcrastinationDesktop: React.FC = () => {
  return (
    <div className="xp-window fixed z-20" style={{ left: '10%', top: '8%', width: '75%' }}>
      <div className="xp-title-bar">
        <div className="flex items-center gap-1.5">
          <Globe size={14} />
          <span className="text-xs">Google Chrome - CricketLiveScore.tv</span>
        </div>
        <div className="flex gap-0.5">
          <div className="w-4 h-4 bg-primary-foreground/20 rounded-sm flex items-center justify-center text-[8px]">─</div>
          <div className="w-4 h-4 bg-primary-foreground/20 rounded-sm flex items-center justify-center text-[8px]">□</div>
        </div>
      </div>
      {/* Browser toolbar */}
      <div className="bg-muted px-2 py-1 flex items-center gap-2 border-b border-border">
        <div className="flex gap-1">
          <span className="text-muted-foreground text-[10px]">←</span>
          <span className="text-muted-foreground text-[10px]">→</span>
          <span className="text-muted-foreground text-[10px]">⟳</span>
        </div>
        <div className="flex-1 bg-popover border border-border px-2 py-0.5 text-[10px] text-muted-foreground rounded-sm">
          🔒 https://www.cricketlive.tv/match/ind-vs-aus-2026
        </div>
      </div>
      {/* Tabs */}
      <div className="bg-muted px-1 flex items-end gap-px">
        <div className="bg-card px-3 py-1 text-[10px] text-card-foreground border border-b-0 border-border rounded-t-sm flex items-center gap-1">
          <Globe size={8} /> Cricket Live 🏏
        </div>
        <div className="bg-muted/60 px-3 py-1 text-[10px] text-muted-foreground border border-b-0 border-border rounded-t-sm flex items-center gap-1">
          <Cat size={8} /> Cat Videos 🐱
        </div>
        <div className="bg-muted/60 px-3 py-1 text-[10px] text-muted-foreground border border-b-0 border-border rounded-t-sm flex items-center gap-1">
          <Play size={8} /> YouTube
        </div>
      </div>
      {/* Content */}
      <div className="bg-card p-4" style={{ minHeight: '300px' }}>
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-lg font-bold text-card-foreground">🏏 IND vs AUS - LIVE</h2>
          <div className="bg-foreground/5 border border-border rounded p-4 w-full max-w-md">
            <div className="flex justify-between items-center mb-3">
              <div className="text-center">
                <p className="text-sm font-bold text-card-foreground">🇮🇳 INDIA</p>
                <p className="text-2xl font-bold text-primary">287/4</p>
                <p className="text-[10px] text-muted-foreground">(42.3 ov)</p>
              </div>
              <div className="text-xs text-muted-foreground font-bold">vs</div>
              <div className="text-center">
                <p className="text-sm font-bold text-card-foreground">🇦🇺 AUSTRALIA</p>
                <p className="text-2xl font-bold text-destructive">265/10</p>
                <p className="text-[10px] text-muted-foreground">(48.2 ov)</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs text-success font-bold animate-pulse">● LIVE - India need 22 runs from 45 balls</p>
            </div>
          </div>
          <div className="flex gap-4 text-[10px] text-muted-foreground">
            <span>💬 Live Chat (2.4k)</span>
            <span>📊 Scorecard</span>
            <span>📋 Commentary</span>
          </div>
          <div className="bg-warning/20 border border-warning/40 p-2 rounded text-[10px] text-card-foreground text-center w-full max-w-md">
            ⚠️ Reminder: You should probably be working right now...
          </div>
        </div>
      </div>
    </div>
  );
};
