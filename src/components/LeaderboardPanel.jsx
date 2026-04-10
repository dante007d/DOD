import React from 'react';
import LivesMeter from './LivesMeter';

export default function LeaderboardPanel({ teams }) {
  const sortedTeams = [...teams].sort((a, b) => {
    if (a.status === 'ELIMINATED' && b.status !== 'ELIMINATED') return 1;
    if (b.status === 'ELIMINATED' && a.status !== 'ELIMINATED') return -1;
    if (b.tokens !== a.tokens) return b.tokens - a.tokens;
    return b.puzzlesSolved - a.puzzlesSolved;
  });

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="mono text-muted uppercase" style={{ fontSize: '10px', marginBottom: '16px' }}>
        LIVE LEADERBOARD
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {sortedTeams.map((team, idx) => {
          const isFirst = idx === 0 && team.status !== 'ELIMINATED';
          const isEliminated = team.status === 'ELIMINATED';

          return (
            <div key={team.id} style={{
              position: 'relative',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderLeft: isFirst ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
              padding: '16px',
              overflow: 'hidden',
              opacity: isEliminated ? 0.4 : 1,
              transition: 'opacity 1s'
            }}>
              <div className="mono text-muted" style={{
                position: 'absolute',
                top: '-10px',
                right: '10px',
                fontSize: '64px',
                fontWeight: 'bold',
                opacity: 0.1,
                userSelect: 'none'
              }}>
                {idx + 1}
              </div>
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div className="mono uppercase" style={{ 
                  fontSize: '18px', 
                  color: isEliminated ? 'var(--color-text-muted)' : 'var(--color-text)',
                  marginBottom: '8px',
                  textDecoration: isEliminated ? 'line-through' : 'none'
                }}>
                  {team.name}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '24px' }}>
                    <div>
                      <div className="mono text-muted" style={{ fontSize: '10px' }}>TOKENS</div>
                      <div className="mono text-gold" style={{ fontSize: '16px' }}>{team.tokens}⬡</div>
                    </div>
                    <div>
                      <div className="mono text-muted" style={{ fontSize: '10px' }}>SOLVED</div>
                      <div className="mono" style={{ fontSize: '16px', color: 'var(--color-success)' }}>{team.puzzlesSolved}</div>
                    </div>
                    <div>
                      <div className="mono text-muted" style={{ fontSize: '10px', marginBottom: '4px' }}>INTEGRITY</div>
                      <LivesMeter lives={team.lives} />
                    </div>
                  </div>

                  {/* Sparkline placeholder */}
                  <div style={{ width: '40px', height: '16px', display: 'flex', alignItems: 'flex-end', gap: '2px' }}>
                    <div style={{ width: '4px', height: '30%', backgroundColor: 'var(--color-surface-raised)' }} />
                    <div style={{ width: '4px', height: '50%', backgroundColor: 'var(--color-surface-raised)' }} />
                    <div style={{ width: '4px', height: '80%', backgroundColor: 'var(--color-surface-raised)' }} />
                    <div style={{ width: '4px', height: '60%', backgroundColor: 'var(--color-primary)' }} />
                    <div style={{ width: '4px', height: '100%', backgroundColor: 'var(--color-primary)' }} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
