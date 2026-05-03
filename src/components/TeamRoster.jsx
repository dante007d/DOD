import React from 'react';
import LivesMeter from './LivesMeter';

export default function TeamRoster({ teams, currentTeamId, selectedTargetId, onSelectTarget, flashedTarget, activeAttacks = [] }) {
  return (
    <div className="panel-surface" style={{ marginBottom: '32px', padding: '16px', position: 'relative' }}>
      <div className="mono text-muted uppercase" style={{ fontSize: '10px', marginBottom: '16px', letterSpacing: '0.2em' }}>
        ► ACTIVE_OPERATIVES // TARGETING_ARRAY
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {teams.map(team => {
          const isMe = team.id === currentTeamId;
          const isEliminated = team.status === 'ELIMINATED';
          const isDanger = team.status === 'DANGER';
          const isSelected = selectedTargetId === team.id;
          const isFlashed = flashedTarget === team.id;
          
          const attacksFromMe = activeAttacks.filter(a => a.from === team.id);
          const attacksOnMe = activeAttacks.filter(a => a.to === team.id);

          let badgeStyle = {
            fontSize: '10px',
            padding: '2px 6px',
            border: '1px solid',
            display: 'inline-block',
            letterSpacing: '0.1em'
          };

          if (isEliminated) {
            badgeStyle = { ...badgeStyle, borderColor: 'var(--color-border)', color: 'var(--color-text-muted)', backgroundColor: 'transparent' };
          } else if (isDanger) {
            badgeStyle = { ...badgeStyle, borderColor: 'var(--color-primary)', color: 'var(--color-primary)', backgroundColor: 'rgba(230, 57, 70, 0.1)' };
          } else {
            badgeStyle = { ...badgeStyle, borderColor: 'var(--color-success)', color: 'var(--color-success)', backgroundColor: 'rgba(46, 204, 113, 0.1)' };
          }

          return (
            <div
              key={team.id}
              onClick={() => !isEliminated && !isMe && onSelectTarget(team.id)}
              className={`target-box ${isSelected ? 'selected' : ''} ${isFlashed ? 'flashed' : ''} ${isEliminated ? 'eliminated' : ''} ${isMe ? 'is-me' : ''}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, zIndex: 2 }}>
                {isSelected && (
                  <span className="mono text-danger blink-fast" style={{ fontSize: '12px' }}>[⌖]</span>
                )}
                {!isSelected && !isMe && !isEliminated && (
                  <span className="mono text-muted crosshair-icon" style={{ fontSize: '12px' }}>[ ]</span>
                )}
                {isMe && (
                  <span className="mono text-gold" style={{ fontSize: '12px' }}>[ME]</span>
                )}
                {isEliminated && (
                  <span className="mono text-muted" style={{ fontSize: '12px' }}>[X]</span>
                )}

                <span className="mono uppercase" style={{
                  textDecoration: isEliminated ? 'line-through' : 'none',
                  color: isEliminated ? 'var(--color-text-muted)' : (isMe ? 'var(--color-gold)' : (isSelected ? 'var(--color-danger)' : 'var(--color-text)')),
                  fontWeight: isSelected ? 'bold' : 'normal',
                  letterSpacing: '0.1em',
                  textShadow: isSelected ? '0 0 8px rgba(230, 57, 70, 0.6)' : 'none'
                }}>
                  {team.name}
                </span>

                <span className="mono text-gold" style={{ fontSize: '12px', marginLeft: 'auto', marginRight: '16px' }}>
                  {team.tokens}⬡
                </span>
                <LivesMeter lives={team.lives} />
              </div>
              <div className="mono uppercase" style={{ ...badgeStyle, zIndex: 2, marginLeft: '12px' }}>
                {team.status}
              </div>

              {/* Attack relationship indicators */}
              <div style={{ position: 'absolute', bottom: '2px', right: '16px', display: 'flex', gap: '8px' }}>
                {attacksOnMe.length > 0 && (
                  <span className="mono text-danger blink-fast" style={{ fontSize: '9px' }}>
                    [⚠ INCOMING ATTACK]
                  </span>
                )}
                {attacksFromMe.length > 0 && (
                  <span className="mono text-gold" style={{ fontSize: '9px' }}>
                    [⚡ STRIKING: {attacksFromMe.map(a => teams.find(t => t.id === a.to)?.name).join(', ')}]
                  </span>
                )}
              </div>

              {isSelected && (
                <div className="hazard-stripes" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.1, zIndex: 1 }} />
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        .target-box {
          position: relative;
          display: flex;
          alignItems: center;
          justify-content: space-between;
          padding: 12px 16px;
          border: 1px solid var(--color-surface-raised);
          background-color: var(--color-bg);
          cursor: pointer;
          transition: all 0.2s ease;
          overflow: hidden;
        }

        .target-box:not(.eliminated):not(.is-me):hover {
          border-color: var(--color-danger);
          background-color: rgba(230, 57, 70, 0.05);
        }

        .target-box:not(.eliminated):not(.is-me):hover .crosshair-icon {
          color: var(--color-danger) !important;
        }

        .target-box.selected {
          border: 1px solid var(--color-danger) !important;
          background-color: rgba(230, 57, 70, 0.15) !important;
          box-shadow: inset 0 0 10px rgba(230, 57, 70, 0.3);
        }

        .target-box.flashed {
          animation: flashTarget 0.3s ease-out;
        }

        .target-box.eliminated {
          opacity: 0.4;
          cursor: not-allowed;
          background-color: transparent;
        }

        .target-box.is-me {
          cursor: default;
          border-color: var(--color-border);
        }

        .blink-fast {
          animation: blinkFast 0.5s infinite;
        }

        @keyframes flashTarget {
          0% { background-color: rgba(230, 57, 70, 0.8); transform: translateX(-4px); }
          50% { transform: translateX(4px); }
          100% { background-color: var(--color-bg); transform: translateX(0); }
        }

        @keyframes blinkFast {
          0%, 100% { opacity: 1; text-shadow: 0 0 8px rgba(230, 57, 70, 0.8); }
          50% { opacity: 0.3; text-shadow: none; }
        }
      `}</style>
    </div>
  );
}
