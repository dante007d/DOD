import React from 'react';

const PHASES = ['LOBBY', 'EARLY', 'MID', 'FINAL', 'SUDDEN DEATH', 'ENDED'];

export default function PhaseController({ currentPhase, onAdvance }) {
  const currentIndex = PHASES.indexOf(currentPhase);

  return (
    <div style={{ marginBottom: '32px' }}>
      <div className="mono text-muted uppercase" style={{ fontSize: '12px', marginBottom: '16px' }}>
        PHASE CONTROLLER
      </div>
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        {PHASES.map((phase, i) => (
          <React.Fragment key={phase}>
            <div className="mono uppercase" style={{
              padding: '4px 8px',
              fontSize: '10px',
              border: `1px solid ${i === currentIndex ? 'var(--color-primary)' : 'var(--color-border)'}`,
              color: i === currentIndex ? 'var(--color-primary)' : (i < currentIndex ? 'var(--color-text-secondary)' : 'var(--color-text-muted)'),
              backgroundColor: i === currentIndex ? 'rgba(200, 169, 110, 0.1)' : 'transparent',
            }}>
              {phase}
            </div>
            {i < PHASES.length - 1 && (
              <div style={{ color: 'var(--color-border)', fontSize: '10px' }}>→</div>
            )}
          </React.Fragment>
        ))}
      </div>
      
      <button 
        onClick={() => {
          if (currentIndex < PHASES.length - 1) onAdvance(PHASES[currentIndex + 1]);
        }}
        disabled={currentIndex >= PHASES.length - 1}
        className="mono uppercase"
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-bg)',
          fontWeight: 'bold',
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)')}
        onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}
      >
        ADVANCE PHASE
      </button>
    </div>
  );
}
