import React from 'react';

export default function LivesMeter({ lives, max = 3 }) {
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[...Array(max)].map((_, i) => {
        const isFilled = i < lives;
        return (
          <span key={i} style={{
            color: isFilled ? 'var(--color-primary)' : 'var(--color-text-muted)',
            fontSize: '14px',
            lineHeight: 1
          }}>
            {isFilled ? '●' : '○'}
          </span>
        );
      })}
    </div>
  );
}
