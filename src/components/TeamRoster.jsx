import React from 'react';
import LivesMeter from './LivesMeter';

export default function TeamRoster({ teams, currentTeamId, selectedTargetId, onSelectTarget, flashedTarget }) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <div className="mono text-muted uppercase" style={{ fontSize: '10px', marginBottom: '8px' }}>
        ACTIVE OPERATIVES
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {teams.map(team => {
          const isMe = team.id === currentTeamId;
          const isEliminated = team.status === 'ELIMINATED';
          const isDanger = team.status === 'DANGER';
          const isSelected = selectedTargetId === team.id;
          const isFlashed = flashedTarget === team.id;

          let badgeStyle = { 
            fontSize: '10px', 
            padding: '2px 4px', 
            border: '2px solid',
            display: 'inline-block' 
          };

          if (isEliminated) {
            badgeStyle = { ...badgeStyle, borderColor: 'transparent', color: 'var(--color-text-muted)', backgroundColor: 'transparent' };
          } else if (isDanger) {
            badgeStyle = { ...badgeStyle, borderColor: 'var(--color-primary)', color: 'var(--color-primary)', backgroundColor: 'var(--color-danger-bg)' };
          } else {
            badgeStyle = { ...badgeStyle, borderColor: 'var(--color-success)', color: 'var(--color-success)', backgroundColor: '#0A1A0F' };
          }

          return (
            <div 
              key={team.id}
              onClick={() => !isEliminated && !isMe && onSelectTarget(team.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid var(--color-surface-raised)',
                cursor: (!isEliminated && !isMe) ? 'pointer' : 'default',
                opacity: isEliminated ? 0.5 : 1,
                borderLeft: isSelected || isFlashed ? `2px solid var(--color-danger)` : '2px solid transparent',
                paddingLeft: isSelected || isFlashed ? '6px' : '8px',
                transition: 'border-left-color 0.1s, opacity 1.5s ease-out'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                <span className="mono" style={{ 
                  textDecoration: isEliminated ? 'line-through' : 'none',
                  color: isEliminated ? 'var(--color-text-muted)' : (isMe ? 'var(--color-text)' : 'var(--color-text-secondary)')
                }}>
                  {team.name} {isMe && '(YOU)'}
                </span>
                <span className="mono text-gold" style={{ fontSize: '12px' }}>{team.tokens}⬡</span>
                <LivesMeter lives={team.lives} />
              </div>
              <div className="mono uppercase" style={badgeStyle}>
                {team.status}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
