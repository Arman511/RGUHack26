import React, { useState, useCallback, useEffect } from 'react';

const VALID_WORDS = [
  'SYNCS', 'AGILE', 'PIVOT', 'SCRUM', 'EPICS', 'FLEET', 'RAPID', 'SLACK',
  'STAND', 'FOCUS', 'ALIGN', 'SCOPE', 'PATCH', 'BRICK', 'CRANE', 'GLOBE',
  'HOUSE', 'LIGHT', 'MONEY', 'POWER', 'QUEST', 'RAISE', 'SMART', 'THINK',
  'ULTRA', 'VALVE', 'WATER', 'YIELD', 'BLAST', 'CHARM', 'DRAFT', 'EIGHT',
  'FLAME', 'GRAPE', 'HASTE', 'INPUT', 'JUDGE', 'KNEEL', 'LEAPS', 'MANGO',
  'NOBLE', 'OCEAN', 'PLUMB', 'QUITE', 'ROUND', 'SHARP', 'TOWER', 'UNITE',
  'WATCH', 'WORLD', 'BRAIN', 'CLOUD', 'DAILY', 'EXTRA', 'FRESH', 'GRAIN',
  'TREND', 'TRACK', 'TRADE', 'TRAIN', 'TRAIL', 'TRIAL', 'TWEAK', 'SWARM',
  'SPARK', 'SPACE', 'SOLVE', 'SOLID', 'SHIFT', 'SHARE', 'SHAPE', 'SERVE',
];

const TARGET_WORDS = ['SYNCS', 'AGILE', 'PIVOT', 'SCRUM', 'EPICS', 'SLACK', 'STAND', 'ALIGN', 'SCOPE', 'TREND'];

interface WordleGameProps {
  onComplete: (guesses: number) => void;
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
];

export const WordleGame: React.FC<WordleGameProps> = ({ onComplete }) => {
  const [target] = useState(() => TARGET_WORDS[Math.floor(Math.random() * TARGET_WORDS.length)]);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [letterStates, setLetterStates] = useState<Record<string, 'correct' | 'present' | 'absent'>>({});

  const updateLetterStates = useCallback((word: string, targetWord: string) => {
    setLetterStates(prev => {
      const next = { ...prev };
      for (let i = 0; i < word.length; i++) {
        const letter = word[i];
        if (letter === targetWord[i]) {
          next[letter] = 'correct';
        } else if (targetWord.includes(letter)) {
          if (next[letter] !== 'correct') next[letter] = 'present';
        } else {
          if (!next[letter]) next[letter] = 'absent';
        }
      }
      return next;
    });
  }, []);

  const submit = useCallback(() => {
    if (current.length !== 5 || done) return;
    const upper = current.toUpperCase();
    
    // Validate against dictionary
    if (!VALID_WORDS.includes(upper)) {
      setError('Not a valid word!');
      setTimeout(() => setError(''), 1500);
      return;
    }

    const newGuesses = [...guesses, upper];
    setGuesses(newGuesses);
    setCurrent('');
    updateLetterStates(upper, target);

    if (upper === target) {
      setDone(true);
      onComplete(newGuesses.length);
    } else if (newGuesses.length >= 6) {
      setDone(true);
      onComplete(7);
    }
  }, [current, guesses, target, done, onComplete, updateLetterStates]);

  const handleKey = useCallback((key: string) => {
    if (done) return;
    if (key === 'ENTER') { submit(); return; }
    if (key === '⌫') { setCurrent(prev => prev.slice(0, -1)); return; }
    if (/^[A-Z]$/.test(key) && current.length < 5) {
      setCurrent(prev => prev + key);
    }
  }, [current, done, submit]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (done) return;
      if (e.key === 'Enter') { submit(); return; }
      if (e.key === 'Backspace') { setCurrent(prev => prev.slice(0, -1)); return; }
      if (/^[a-zA-Z]$/.test(e.key) && current.length < 5) {
        setCurrent(prev => prev + e.key.toUpperCase());
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [current, done, submit]);

  const getColor = (letter: string, index: number) => {
    if (letter === target[index]) return 'bg-success text-success-foreground';
    if (target.includes(letter)) return 'bg-warning text-warning-foreground';
    return 'bg-muted text-muted-foreground';
  };

  const getKeyColor = (letter: string) => {
    const state = letterStates[letter];
    if (state === 'correct') return 'bg-success text-success-foreground';
    if (state === 'present') return 'bg-warning text-warning-foreground';
    if (state === 'absent') return 'bg-foreground/30 text-muted-foreground';
    return 'bg-muted text-card-foreground';
  };

  const rows = [...guesses];
  while (rows.length < 6) rows.push('');

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs text-card-foreground font-bold">Decode the corporate buzzword!</p>
      {error && <p className="text-xs text-destructive font-bold animate-pulse">{error}</p>}
      <div className="flex flex-col gap-1">
        {rows.map((row, ri) => (
          <div key={ri} className="flex gap-1">
            {[0, 1, 2, 3, 4].map(ci => {
              const isCurrentRow = ri === guesses.length && !done;
              const letter = isCurrentRow ? (current[ci] || '') : (row[ci] || '');
              const submitted = ri < guesses.length;
              const colorClass = submitted && letter ? getColor(letter, ci) : 'bg-card border border-border';
              return (
                <div
                  key={ci}
                  className={`w-9 h-9 flex items-center justify-center text-sm font-bold border ${colorClass}`}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {/* On-screen keyboard */}
      {!done && (
        <div className="flex flex-col items-center gap-0.5 mt-1">
          {KEYBOARD_ROWS.map((row, ri) => (
            <div key={ri} className="flex gap-0.5">
              {row.map(key => (
                <button
                  key={key}
                  className={`${key.length > 1 ? 'px-2' : 'w-7'} h-8 text-[10px] font-bold rounded-sm cursor-pointer border border-border ${getKeyColor(key)}`}
                  onClick={() => handleKey(key)}
                >
                  {key}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
      {done && guesses[guesses.length - 1] !== target && (
        <p className="text-xs text-destructive font-bold">The word was: {target}</p>
      )}
    </div>
  );
};
