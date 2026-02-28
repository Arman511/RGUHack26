import React from 'react';
import { Baby } from 'lucide-react';

// boss baby poster stored in the hidden .assets folder
import bossPic from '../../../.assets/boss-baby.jpeg';

interface IntroScreenProps {
  onStart: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background font-sans">
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 30% 70%, hsl(213 80% 40%) 0%, transparent 50%), radial-gradient(circle at 70% 30%, hsl(220 70% 30%) 0%, transparent 50%)',
        }}
      />
      
      <div className="relative z-10 flex flex-col items-center gap-6 max-w-2xl px-8 ">
        <h1 className="pixel-text text-5xl md:text-7xl tracking-wide font-bold text-primary-foreground text-center leading-tight relative left-[0.5ch]">
          <span className="relative left-[0.30ch]">Liar...</span><br />
          Cheater...<br />
          <span className="text-destructive pixel-text tracking-wider relative" style={{ animation: 'shake 0.5s ease-in-out infinite' }}>
             FIRED.
          </span>
        </h1>

        <div className="xp-window w-[380px]">
          <div className="xp-title-bar">
            <div className="flex items-center gap-1.5">
              <Baby size={14} />
              <span className="text-xs">Boss Baby</span>
            </div>
          </div>
          <div className="xp-window-body flex flex-col items-center gap-3 p-4">
            <div className="relative w-16 h-16">
              <img
                src={bossPic}
                alt="Boss Baby"
                loading="lazy"
                className="w-full h-full object-cover rounded-full"
              />
              {/* circular border overlay */}
              <div className="absolute inset-0 rounded-full border-2 border-primary" />
            </div>
            <p className="text-sm text-center font-bold text-card-foreground leading-relaxed">
              "I hate liars and cheaters. Why are you hired if you don't do your job? 
              <span className="text-destructive"> Focus on work!</span>"
            </p>
          </div>
        </div>

        <button 
          className="xp-button-primary text-lg px-8 py-3 mt-2"
          onClick={onStart}
        >
          🔥 I'm ready to get fired
        </button>

      </div>

      <p className="intro-disclaimer">
        (Disclaimer: This is not representative of us developers; we are very, very, very, very good employees)
      </p>
    </div>
  );
};
