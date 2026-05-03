import React, { useEffect, useState, useRef } from 'react';

export default function TokenBar({ tokens, onAttack, onShield }) {
  const [pulse, setPulse] = useState(false);
  const prevTokens = useRef(tokens);

  useEffect(() => {
    if (tokens > prevTokens.current) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 200);
      return () => clearTimeout(t);
    }
    prevTokens.current = tokens;
  }, [tokens]);

  return (
    <div style={{ marginBottom: '32px' }}>
      <div className="mono text-muted uppercase" style={{ fontSize: '10px', marginBottom: '8px' }}>
        TOKEN BANK
      </div>
      <div className={`mono text-gold ${pulse ? 'pulse-anim' : ''}`} style={{ 
        fontSize: '48px', 
        lineHeight: 1, 
        marginBottom: '16px',
        display: 'inline-block'
      }}>
        {tokens}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button 
          onClick={onAttack}
          disabled={tokens < 5}
          className="mono uppercase text-danger"
          style={{
            padding: '12px',
            border: '1px solid var(--color-danger)',
            fontSize: '12px',
            textAlign: 'left',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = 'var(--color-danger-hover)')}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          [LAUNCH ATTACK — 5 ⬡]
        </button>

      </div>

      <style>{`
        .pulse-anim {
          animation: pulse 200ms ease-in-out;
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
