import React, { useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import PhaseController from '../components/PhaseController';
import SafeZoneToggle from '../components/SafeZoneToggle';
import LeaderboardPanel from '../components/LeaderboardPanel';
import SignalLog from '../components/SignalLog';

export default function OrganizerPage() {
  const { gameState, organizer } = useGameState();
  const [showSuddenDeathModal, setShowSuddenDeathModal] = useState(false);

  // Handle phase blur animation
  const [phaseWipe, setPhaseWipe] = useState(false);
  const [currentPhaseStr, setCurrentPhaseStr] = useState(gameState.phase);

  React.useEffect(() => {
    if (gameState.phase !== currentPhaseStr) {
      setPhaseWipe(true);
      setTimeout(() => {
        setCurrentPhaseStr(gameState.phase);
        setPhaseWipe(false);
      }, 200); // Wait halfway for wipe to swap text
    }
  }, [gameState.phase, currentPhaseStr]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* Top Bar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '16px var(--spacing-base)',
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)'
      }}>
        <div className="mono text-gold uppercase" style={{ fontSize: '18px', flex: 1 }}>
          ⬡ OPERATION PROMETHEUS
        </div>
        <div className="mono text-muted uppercase" style={{ fontSize: '14px', flex: 1, textAlign: 'center' }}>
          ROOM: {gameState.roomCode}
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '24px' }}>
          <div className={`mono text-gold uppercase ${phaseWipe ? 'phase-wipe' : ''}`} style={{ 
            border: '1px solid var(--color-primary)', 
            padding: '4px 12px', 
            fontSize: '12px' 
          }}>
            PHASE {PHASES_MAP[currentPhaseStr] || 0} — {currentPhaseStr}
          </div>
          <style>{`
            .phase-wipe {
              animation: phaseWipeAnim 400ms ease-in-out forwards;
            }
            @keyframes phaseWipeAnim {
              0% { filter: blur(0px); opacity: 1; transform: scaleY(1); }
              50% { filter: blur(4px); opacity: 0; transform: scaleY(0.1); }
              100% { filter: blur(0px); opacity: 1; transform: scaleY(1); }
            }
          `}</style>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="mono text-muted bg-transparent border-0 uppercase" style={{ fontSize: '12px' }}>◀ PREV ROUND</button>
            <button className="mono text-muted bg-transparent border-0 uppercase" style={{ fontSize: '12px' }}>NEXT ROUND ▶</button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, padding: 'var(--spacing-base)' }}>
        
        {/* Left Column 30% */}
        <div style={{ width: '30%', paddingRight: '16px', borderRight: '1px solid var(--color-surface-raised)', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
          <div className="mono text-muted uppercase" style={{ fontSize: '10px' }}>TEAM COMMAND</div>
          {gameState.teams.map(team => (
            <div key={team.id} style={{ 
              backgroundColor: 'var(--color-surface)', 
              border: '1px solid var(--color-border)', 
              padding: '16px',
              opacity: team.status === 'ELIMINATED' ? 0.5 : 1
            }}>
              <div className="mono text-gold uppercase" style={{ fontSize: '16px', marginBottom: '16px' }}>{team.name}</div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <div className="mono text-muted" style={{ fontSize: '10px', marginBottom: '4px' }}>LIVES</div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[...Array(3)].map((_, i) => (
                      <span key={i} 
                        onClick={() => organizer.updateTeamLives(team.id, i < team.lives ? team.lives - 1 : team.lives + 1)}
                        style={{ 
                          cursor: 'pointer',
                          color: i < team.lives ? 'var(--color-primary)' : 'var(--color-text-muted)',
                          fontSize: '18px',
                          lineHeight: 1
                        }}>
                        {i < team.lives ? '●' : '○'}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mono text-muted" style={{ fontSize: '10px', marginBottom: '4px' }}>TOKENS</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button onClick={() => organizer.updateTeamTokens(team.id, -1)} style={{ width: '28px', height: '28px', border: '1px solid var(--color-border)', color: 'var(--color-text)', backgroundColor: 'transparent' }}>-</button>
                    <span className="mono text-gold" style={{ width: '32px', textAlign: 'center' }}>{team.tokens}</span>
                    <button onClick={() => organizer.updateTeamTokens(team.id, 1)} style={{ width: '28px', height: '28px', border: '1px solid var(--color-border)', color: 'var(--color-text)', backgroundColor: 'transparent' }}>+</button>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <select 
                  className="mono uppercase"
                  value={team.status} 
                  onChange={() => {}} // Disabled for simplicity, we mock ELIMINATE separately
                  style={{
                    flex: 1,
                    padding: '8px',
                    backgroundColor: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)'
                  }}>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="DANGER">DANGER</option>
                  <option value="SAFE ZONE">SAFE ZONE</option>
                  <option value="ELIMINATED">ELIMINATED</option>
                </select>
                <button 
                  onClick={() => organizer.eliminateTeam(team.id)}
                  disabled={team.status === 'ELIMINATED'}
                  className="mono uppercase"
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--color-danger)',
                    color: 'var(--color-danger)',
                    transition: 'background-color 0.2s',
                    opacity: team.status === 'ELIMINATED' ? 0.3 : 1
                  }}
                  onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = 'var(--color-danger-hover)')}
                  onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  ELIMINATE
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Center Column 40% */}
        <div style={{ width: '40%', padding: '0 16px' }}>
          <LeaderboardPanel teams={gameState.teams} />
        </div>

        {/* Right Column 30% */}
        <div style={{ width: '30%', paddingLeft: '16px', borderLeft: '1px solid var(--color-surface-raised)', display: 'flex', flexDirection: 'column' }}>
          <PhaseController currentPhase={gameState.phase} onAdvance={(p) => organizer.setPhase(p)} />
          
          <SafeZoneToggle isActive={gameState.safeZoneActive} onToggle={organizer.toggleSafeZone} />
          
          <div style={{ marginBottom: '32px' }}>
            <button 
              onClick={() => setShowSuddenDeathModal(true)}
              className="mono uppercase text-danger"
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: 'transparent',
                border: '1px solid var(--color-danger)',
                fontWeight: 'bold',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-danger-hover)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              ACTIVATE SUDDEN DEATH
            </button>
          </div>

          <div style={{ flex: 1 }}>
            <SignalLog events={gameState.recentEvents} />
          </div>
        </div>

      </div>

      {showSuddenDeathModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(10,10,10,0.95)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-danger)', padding: '32px', width: '400px' }}>
            <h2 className="mono text-danger uppercase" style={{ fontSize: '24px', marginBottom: '24px', textAlign: 'center' }}>
              CONFIRM SUDDEN DEATH?
            </h2>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button onClick={() => setShowSuddenDeathModal(false)} className="mono uppercase" style={{ flex: 1, padding: '12px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text)' }}>
                CANCEL
              </button>
              <button 
                onClick={() => {
                  organizer.setPhase('SUDDEN DEATH');
                  setShowSuddenDeathModal(false);
                }} 
                className="mono uppercase" style={{ flex: 1, padding: '12px', backgroundColor: 'var(--color-danger)', border: 'none', color: '#fff', fontWeight: 'bold' }}>
                YES, ACTIVATE
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const PHASES_MAP = {
  'LOBBY': 1,
  'EARLY': 2,
  'MID': 3,
  'FINAL': 4,
  'SUDDEN DEATH': 5,
  'ENDED': 6
};
