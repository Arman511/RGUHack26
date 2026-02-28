import React, { useState, useCallback, useEffect, useRef } from "react";
import { useGameState, GameStage } from "@/hooks/useGameState";
import { Taskbar } from "@/components/game/Taskbar";
import { DesktopIcons } from "@/components/game/DesktopIcons";
import { DraggableWindow } from "@/components/game/DraggableWindow";
import { BossBaby } from "@/components/game/BossBaby";
import { PingPongGame } from "@/components/game/PingPongGame";
import { WordleGame } from "@/components/game/WordleGame";
import { TetrisGame } from "@/components/game/TetrisGame";
import { PacmanGame } from "@/components/game/PacmanGame";
import { EndScreen } from "@/components/game/EndScreen";
import { IntroScreen } from "@/components/game/IntroScreen";
import { ProcrastinationDesktop } from "@/components/game/ProcrastinationDesktop";
import { FailMeter } from "@/components/game/FailMeter";
import { HowToPlay } from "@/components/game/HowToPlay";
import { PunishmentScreen } from "@/components/game/PunishmentScreen";
import { TeamsNotif } from "@/components/game/TeamsNotif";
import { Video, LayoutList, Mail } from "lucide-react";

const STAGE_DELAY_MS = 3000;
const STAGE_METER_POINT_CUTOF = 9;

const Index = () => {
  const { state, setStage, moveMeter, setBossMessage } = useGameState();
  const [skipTutorials, setSkipTutorials] = useState(true);
  const [showBoss, setShowBoss] = useState(false);
  const [bossMsg, setBossMsg] = useState("");
  const [nextStageAfterBoss, setNextStageAfterBoss] =
    useState<GameStage | null>(null);
  const [showPunishment, setShowPunishment] = useState<GameStage | null>(null);
  const [stageAfterPunishment, setStageAfterPunishment] =
    useState<GameStage | null>(null);
  const [skipDoneStageDelay, setSkipDoneStageDelay] = useState(false);
  const [loopDone, setLoopDone] = useState(false);
  const delayTimer = useRef<ReturnType<typeof setTimeout>>();

  // Delayed stage transition (5s gap)
  const delayedStage = useCallback(
    (stage: GameStage, delayMs = 5000) => {
      if (delayTimer.current) clearTimeout(delayTimer.current);
      delayTimer.current = setTimeout(() => setStage(stage), delayMs);
    },
    [setStage],
  );

  useEffect(() => {
    return () => {
      if (delayTimer.current) clearTimeout(delayTimer.current);
    };
  }, []);

  const triggerBoss = useCallback((msg: string, nextStage: GameStage) => {
    setBossMsg(msg);
    setShowBoss(true);
    setNextStageAfterBoss(nextStage);
  }, []);

  const dismissBoss = useCallback(() => {
    setShowBoss(false);
    if (nextStageAfterBoss) {
      setStage(nextStageAfterBoss);
      setNextStageAfterBoss(null);
    }
  }, [nextStageAfterBoss, setStage]);

  const triggerPunishment = useCallback((nextStage: GameStage, punishmentStage: GameStage) => {
    setShowPunishment(punishmentStage);
    setStageAfterPunishment(nextStage);
  }, []);

  const handlePunishmentDone = useCallback(() => {
    setShowPunishment(null);
    if (stageAfterPunishment) {
      setSkipDoneStageDelay(true);
      setStage(stageAfterPunishment);
      setStageAfterPunishment(null);
    }
  }, [stageAfterPunishment, setStage]);

  // ── Handlers ──

  const handleIntroStart = useCallback(() => {
    setStage("procrastination");
    delayedStage("teams", STAGE_DELAY_MS);
  }, [setStage, delayedStage]);

  const handleTeamsClose = useCallback(() => {
    triggerBoss(
      "Ignoring my pings? Fine. If you won't reply, then you'll rebound. Put your paddle where your mouse is and let's see if you can keep up.",
      skipTutorials ? 'pingpong' : 'pong-howto'
    );
  }, [skipTutorials, triggerBoss]);

  const handlePongWin = useCallback(() => {
    moveMeter(-30); // toward FIRED (victory)
    triggerBoss(
      "You WON?! Instead of working?! The meter moves toward FIRED. Now get to the standup!",
      "pong-done",
    );
  }, [moveMeter, triggerBoss]);

  const handlePongLose = useCallback(() => {
    moveMeter(10); // toward PROMOTED (loss)
    triggerPunishment("pong-done", "pingpong");
  }, [moveMeter, triggerPunishment]);

  const handleMeterOutcome = useCallback(() => {
    if (state.meterValue <= -STAGE_METER_POINT_CUTOF) {
      setStage("fired");
      return true;
    }

    if (state.meterValue >= STAGE_METER_POINT_CUTOF) {
      setStage("promoted");
      return true;
    }

    return false;
  }, [state.meterValue, setStage]);

  useEffect(() => {
    if (state.stage === "pong-done") {
      if (loopDone && handleMeterOutcome()) {
        return;
      }

      if (skipDoneStageDelay) {
        setSkipDoneStageDelay(false);
        setStage("zoom");
      } else {
        delayedStage("zoom", STAGE_DELAY_MS);
      }
    }
  }, [state.stage, skipDoneStageDelay, delayedStage, setStage, loopDone, handleMeterOutcome]);

  const handleZoomJoin = useCallback(() => {
    moveMeter(20); // did work = toward promoted
    triggerBoss(
      "Good employee! You joined the meeting. But that moves you toward PROMOTED...",
      "wordle-done",
    );
  }, [moveMeter, triggerBoss]);

  const handleZoomDecline = useCallback(() => {
    moveMeter(-15); // declined meeting = toward fired
    triggerBoss(
      "Think you can skip the standup? Decode this corporate jargon!",
      skipTutorials ? "wordle" : "wordle-howto",
    );
  }, [moveMeter, skipTutorials, triggerBoss]);

  const handleWordleComplete = useCallback(
    (guesses: number) => {
      if (guesses <= 6) {
        moveMeter(-25);
        triggerBoss(
          `Decoded in ${guesses} tries?! You are trying to escape work, aren't you? The meter moves toward FIRED!`,
          "wordle-done",
        );
      } else {
        moveMeter(10);
        triggerPunishment("wordle-done", "wordle");
      }
    },
    [moveMeter, triggerBoss, triggerPunishment],
  );

  useEffect(() => {
    if (state.stage === "wordle-done") {
      if (loopDone && handleMeterOutcome()) {
        return;
      }
      if (skipDoneStageDelay) {
        setSkipDoneStageDelay(false);
        setStage("pacman");
      } else {
        triggerBoss(
          "Check your emails! 10 unread messages! You're on prod support!",
          skipTutorials ? "pacman" : "pacman-howto",
        );
      }

    }
  }, [skipTutorials, state.stage, triggerBoss, loopDone, handleMeterOutcome]);

  const handlePacmanWin = useCallback(() => {
    moveMeter(-30);
    triggerBoss(
      "You are AVOIDING work?! Impressive slacking! Keep it up and you might get FIRED!",
      "pacman-done",
    );
  }, [moveMeter, triggerBoss]);

  const handlePacmanLose = useCallback(() => {
    moveMeter(10);
    triggerPunishment("pacman-done", "pacman");
  }, [moveMeter, triggerPunishment]);

  useEffect(() => {
    if (state.stage === "pacman-done") {
      if (loopDone && handleMeterOutcome()) {
        return;
      }

      if (skipDoneStageDelay) {
        setSkipDoneStageDelay(false);
        setStage("jira");
      } else {
        delayedStage("jira", STAGE_DELAY_MS);
      }
    }
  }, [state.stage, skipDoneStageDelay, delayedStage, setStage, loopDone, handleMeterOutcome]);

  const handleJiraNotification = useCallback(() => {
    triggerBoss(
      "The sprint is on fire! It's all your fault for not working! Survive the backlog of tasks!",
      skipTutorials ? "tetris" : "tetris-howto",
    );
  }, [skipTutorials, triggerBoss]);

  useEffect(() => {
    if (state.stage === "jira") {
      const t = setTimeout(handleJiraNotification, 100);
      return () => clearTimeout(t);
    }
  }, [state.stage, handleJiraNotification]);

  const handleTetrisTopReached = useCallback(() => {
    moveMeter(10); // failed work = toward fired
    triggerBoss(
      "Ha got you, better luck next time, pay attention during the zoom! Moving toward PROMOTED...",
      "tetris-done",
    );
  }, [moveMeter]);

  const handleTetrisSurvived = useCallback(() => {
    moveMeter(-30); // survived = too productive
    triggerBoss(
      "You survived the backlog?! I'll get you next time! Moving toward FIRED!",
      "tetris-done",
    );
  }, [moveMeter, triggerBoss]);

  useEffect(() => {
    if (state.stage === "tetris-done") {
      if (handleMeterOutcome()) {
        return;
      }

      setLoopDone(true);
      delayedStage("procrastination", STAGE_DELAY_MS);
      const t = setTimeout(() => delayedStage("teams", 5000), 100);
      return () => clearTimeout(t);
    }
  }, [state.stage, delayedStage, handleMeterOutcome]);

  const handleRestart = useCallback(() => {
    window.location.reload();
  }, []);

  // ── Rendering ──

  if (state.stage === "intro") {
    return (
      <IntroScreen
        onStart={handleIntroStart}
        skipTutorials={skipTutorials}
        setSkipTutorials={setSkipTutorials}
      />
    );
  }

  if (state.stage === "fired") {
    return <EndScreen type="fired" onRestart={handleRestart} />;
  }
  if (state.stage === "promoted") {
    return <EndScreen type="promoted" onRestart={handleRestart} />;
  }

  const isGameActive =
    ["pingpong", "wordle", "pacman", "tetris"].includes(state.stage) ||
    state.stage.endsWith("-howto");

  return (
    <div className="w-screen h-screen overflow-hidden relative bg-background">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 80%, hsl(213 80% 40%) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(220 70% 30%) 0%, transparent 50%)",
        }}
      />

      <FailMeter value={state.meterValue} />
      <DesktopIcons />

      {/* Procrastination desktop — stays visible until player loses */}
      {!showPunishment && <ProcrastinationDesktop />}

      {/* Grey overlay when game is active */}
      {isGameActive && <div className="fixed inset-0 bg-foreground/50 z-30" />}

      {/* Teams Notification */}
      {state.stage === "teams" && (
        <div className="teams-notification">
          <TeamsNotif onDismiss={handleTeamsClose} />
        </div>
      )}

      {/* Pong How-To */}
      {state.stage === "pong-howto" && (
        <DraggableWindow
          title="Work Avoidance.exe"
          width={400}
          closable={false}
        >
          <HowToPlay
            title="Pong"
            instructions={[
              "Use W/S or ↑/↓ to move your paddle (left side)",
              "Score 3 points to win and earn demerit!",
              "Losing means you did work... punishment awaits.",
            ]}
            onStart={() => setStage("pingpong")}
          />
        </DraggableWindow>
      )}

      {/* Ping Pong */}
      {state.stage === 'pingpong' && (
        <DraggableWindow
          title="Work Avoidance.exe"
          width={400}
          closable={false}
          icon={
            <img
              src="/pingpongpaddle.jpeg"
              alt="paddle icon"
              className="w-4 h-4 rounded-full object-cover"
            />
          }
        >
          <PingPongGame
            onWin={handlePongWin}
            onLose={handlePongLose}
            playerAvatar="/sword.jpeg"
            botAvatar='/marty.jpeg'
            playerName="Marty Supreme"
          />
        </DraggableWindow>
      )}

      {/* Zoom Invite */}
      {state.stage === "zoom" && (
        <DraggableWindow
          title="Zoom Meeting"
          icon={<Video size={14} />}
          width={380}
          closable={false}
        >
          <div className="flex flex-col items-center gap-3 p-3">
            <Video size={40} className="text-primary" />
            <h3 className="text-sm font-bold text-card-foreground text-center">
              📅 Meeting Invite
            </h3>
            <p className="text-xs text-card-foreground text-center font-bold">
              "Synergy Bandwidth Alignment Standup"
            </p>
            <p className="text-[10px] text-muted-foreground text-center">
              Mandatory • 45 min • No agenda • All hands
            </p>
            <div className="flex gap-2">
              <button className="xp-button text-xs" onClick={handleZoomDecline}>
                ✕ Decline
              </button>
              <button className="xp-button text-xs" onClick={handleZoomJoin}>
                ✓ Join
              </button>
            </div>
          </div>
        </DraggableWindow>
      )}

      {/* Wordle How-To */}
      {state.stage === "wordle-howto" && (
        <DraggableWindow
          title="Corporate Jargon Decoder"
          width={340}
          closable={false}
        >
          <HowToPlay
            title="Wordle"
            instructions={[
              "Guess the 5-letter corporate buzzword in 6 tries",
              "Green = correct letter & position",
              "Yellow = correct letter, wrong position",
              "Getting it in ≤3 tries = slacking (good!)",
            ]}
            onStart={() => setStage("wordle")}
          />
        </DraggableWindow>
      )}

      {/* Wordle */}
      {state.stage === "wordle" && (
        <DraggableWindow
          title="Corporate Jargon Decoder"
          width={340}
          closable={false}
        >
          <WordleGame onComplete={handleWordleComplete} />
        </DraggableWindow>
      )}

      {/* Pacman How-To */}
      {state.stage === "pacman-howto" && (
        <DraggableWindow
          title="Email Client - Inbox (10)"
          icon={<Mail size={14} />}
          width={340}
          closable={false}
        >
          <HowToPlay
            title="Email Pacman"
            instructions={[
              "Eat all 📧 emails while avoiding coworkers",
              "Arrow keys or WASD to move",
              "Ghosts are PM, HR, and CEO - avoid them!",
              "Clear all emails = slacking success!",
            ]}
            onStart={() => setStage("pacman")}
          />
        </DraggableWindow>
      )}

      {/* Pacman */}
      {state.stage === "pacman" && (
        <DraggableWindow
          title="Outlook Inbox"
          icon={<Mail size={14} />}
          width={510}
          closable={false}
          bodyStyle={{ padding: 0 }}
        >
          <PacmanGame onWin={handlePacmanWin} onLose={handlePacmanLose} />
        </DraggableWindow>
      )}

      {/* Tetris How-To */}
      {state.stage === "tetris-howto" && (
        <DraggableWindow
          title="Jira Backlog Refinement"
          icon={<LayoutList size={14} />}
          width={260}
          closable={false}
        >
          <HowToPlay
            title="Backlog Tetris"
            instructions={[
              "Survive for 30 seconds!",
              "Arrow keys: ←→ move, ↑ rotate, ↓ drop",
              "Let blocks pile up to get fired!",
              "Surviving = too productive = PROMOTED",
            ]}
            onStart={() => setStage("tetris")}
          />
        </DraggableWindow>
      )}

      {/* Tetris */}
      {state.stage === "tetris" && (
        <DraggableWindow
          title="Jira Backlog Refinement"
          icon={<LayoutList size={14} />}
          width={260}
          closable={false}
        >
          <TetrisGame
            onTopReached={handleTetrisTopReached}
            onCleared={handleTetrisSurvived}
          />
        </DraggableWindow>
      )}

      {/* Boss Baby Overlay + Popup */}
      {showBoss && (
        <>
          <div className="fixed inset-0 bg-foreground/50 z-40" />
          <BossBaby message={bossMsg} onDismiss={dismissBoss} />
        </>
      )}

      {/* Punishment Screen */}
      {showPunishment && (
        <PunishmentScreen
          onComplete={handlePunishmentDone}
          gameStage={showPunishment}
        />
      )}

      <Taskbar meterValue={state.meterValue} />
    </div>
  );
};

export default Index;
