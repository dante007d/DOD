import React from 'react';

export default function SignalLog({ events }) {
  return (
    <div>
      <div className="mono text-muted uppercase" style={{ fontSize: '10px', marginBottom: '8px' }}>
        SIGNAL LOG
      </div>
      <div style={{
        maxHeight: '150px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        {events.map((ev, idx) => {
          let color = 'var(--color-text-muted)';
          if (ev.type === 'attack') color = 'var(--color-danger)';
          if (ev.type === 'solve') color = 'var(--color-success)';

          return (
            <div key={idx} className="mono" style={{ fontSize: '12px', color }}>
              {ev.text}
            </div>
          );
        })}
      </div>
    </div>
  );
}
