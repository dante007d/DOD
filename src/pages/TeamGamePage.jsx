import React, { useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import CipherPanel from '../components/CipherPanel';
import AnswerInput from '../components/AnswerInput';
import TokenBar from '../components/TokenBar';
import TeamRoster from '../components/TeamRoster';
import SignalLog from '../components/SignalLog';
import DefenseOverlay from '../components/DefenseOverlay';
import { audio } from '../utils/audio';

export default function TeamGamePage() {
  const { gameState, submitAnswer, launchAttack, repelAttack, activateShield } = useGameState();
  const [targetId, setTargetId] = useState(null);
  const [flashedTarget, setFlashedTarget] = useState(null);
  const [isAnswerError, setIsAnswerError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [isShaking, setIsShaking] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const prevLivesRef = React.useRef(3);

  const myTeam = gameState.teams.find(t => t.id === gameState.myTeamId) || gameState.teams[0];

  React.useEffect(() => {
    if (gameState.phase === 'STANDBY') {
      audio.playHum();
    }
  }, [gameState.phase]);

  React.useEffect(() => {
    if (gameState.incomingAttack) {
      audio.playAlert();
      setIsShaking(true);
      const t = setTimeout(() => setIsShaking(false), 500);
      return () => clearTimeout(t);
    }
  }, [gameState.incomingAttack]);

  React.useEffect(() => {
    if (myTeam && myTeam.lives < prevLivesRef.current) {
      audio.playCrunch();
      setIsGlitching(true);
      const t = setTimeout(() => setIsGlitching(false), 400);
      prevLivesRef.current = myTeam.lives;
      return () => clearTimeout(t);
    }
    if (myTeam) prevLivesRef.current = myTeam.lives;
  }, [myTeam?.lives]);

  const handleAnswerSubmit = async (answer) => {
    const correct = await submitAnswer(answer);
    if (correct) {
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 800);
    } else {
      setIsAnswerError(true);
      setTimeout(() => setIsAnswerError(false), 400); // sync with animation
    }
  };

  const handleAttack = () => {
    if (!targetId) {
      alert("Please select a target team from the ACTIVE OPERATIVES list on the right by clicking their name first!");
      return;
    }
    launchAttack(targetId);
    setFlashedTarget(targetId);
    setTimeout(() => setFlashedTarget(null), 300);
    setTargetId(null);
  };

  const handleRepel = (ans) => {
    repelAttack(ans);
  };

  const handleBuyTime = () => {
    buyTime();
  };

  const handleDeployFirewall = () => {
    deployFirewall();
  };

  if (myTeam.status === 'ELIMINATED') {
    return (
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: '#050000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        border: '4px solid var(--color-danger)'
      }}>
        <div className="hazard-stripes" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.1, animation: 'glitch 0.2s infinite' }} />
        <h1 className="mono text-danger uppercase" style={{ fontSize: '4vw', letterSpacing: '0.1em', animation: 'fadePulse 4s infinite', textAlign: 'center', zIndex: 2, margin: 0, textShadow: '0 0 20px rgba(192,57,43,0.8)' }}>
          VICTORY WAS NEVER MEANT FOR YOU ANYWAY
        </h1>
        <p className="mono text-danger uppercase" style={{ fontSize: '2vw', letterSpacing: '0.5em', opacity: 0.8, zIndex: 2, marginTop: '24px' }}>
          OPERATIVE LIQUIDATED
        </p>
        <p className="mono text-muted uppercase" style={{ fontSize: '1vw', letterSpacing: '0.2em', marginTop: '48px', zIndex: 2 }}>
          LIVES REMAINING: 0 // SYSTEM LOCKOUT
        </p>
        <style>{`
          @keyframes fadePulse {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.02); }
          }
          @keyframes glitch {
            0% { transform: translate(0); }
            20% { transform: translate(-2px, 1px); }
            40% { transform: translate(-1px, -1px); }
            60% { transform: translate(2px, 1px); }
            80% { transform: translate(1px, -1px); }
            100% { transform: translate(0); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div 
      className={`${isShaking ? "screen-shake" : ""} ${isGlitching ? "screen-glitch" : ""}`}
      style={{ display: 'flex', minHeight: '100vh', padding: 'var(--spacing-base)' }}
    >
      {gameState.incomingAttack && (
        <DefenseOverlay 
          attackDetails={gameState.incomingAttack} 
          onRepel={handleRepel} 
          onBuyTime={handleBuyTime}
          onDeployFirewall={handleDeployFirewall}
          tokens={myTeam.tokens}
        />
      )}

      {/* Left Column 65% */}
      <div style={{ width: '65%', paddingRight: '16px', display: 'flex', flexDirection: 'column' }}>
        
        {/* Top Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 className="mono text-gold uppercase" style={{ fontSize: '24px', margin: 0 }}>
            {myTeam.name}
          </h1>
          <div className="mono text-muted" style={{ fontSize: '14px' }}>
            ROUND {String(gameState.round).padStart(2, '0')} / {String(gameState.totalRounds).padStart(2, '0')}
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {[...Array(3)].map((_, i) => (
              <span key={i} style={{ color: i < myTeam.lives ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                {i < myTeam.lives ? '●' : '○'}
              </span>
            ))}
          </div>
          <div className="mono text-gold uppercase">
            ⬡ {myTeam.tokens} TOKENS
          </div>
        </div>

        {/* Puzzle Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <CipherPanel 
            type={gameState.currentPuzzle.type} 
            text={gameState.currentPuzzle.text} 
            hint={gameState.currentPuzzle.hint}
            isSuccess={isSuccess}
            isError={isAnswerError}
          />
          <AnswerInput 
            onSubmit={handleAnswerSubmit} 
            isError={isAnswerError}
          />
          
          {/* Progress Track */}
          <div style={{ marginTop: '24px', display: 'flex', gap: '4px' }}>
            {[...Array(gameState.currentPuzzle.total)].map((_, i) => {
              const isCompleted = i < gameState.currentPuzzle.progress;
              const isCurrent = i === gameState.currentPuzzle.progress;
              return (
                <div key={i} style={{
                  flex: 1,
                  height: '4px',
                  backgroundColor: isCompleted ? 'var(--color-primary)' : 'var(--color-border)',
                  animation: isCurrent ? 'blink 1s infinite step-end' : 'none'
                }} />
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column 35% */}
      <div style={{ width: '35%', paddingLeft: '16px', borderLeft: '1px solid var(--color-surface-raised)', display: 'flex', flexDirection: 'column' }}>
        <TokenBar 
          tokens={myTeam.tokens} 
          onAttack={handleAttack} 
          onShield={activateShield} 
        />
        <TeamRoster 
          teams={gameState.teams} 
          currentTeamId={gameState.myTeamId} 
          selectedTargetId={targetId}
          onSelectTarget={setTargetId}
          flashedTarget={flashedTarget}
          activeAttacks={gameState.activeAttacks}
        />
        <SignalLog events={gameState.recentEvents} />
      </div>
      
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
