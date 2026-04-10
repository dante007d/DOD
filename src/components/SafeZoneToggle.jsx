import React from 'react';

export default function SafeZoneToggle({ isActive, onToggle }) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <div className="mono text-muted uppercase" style={{ fontSize: '12px', marginBottom: '8px' }}>
        GLOBAL DIRECTIVES
      </div>
      <button 
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px',
          backgroundColor: isActive ? 'var(--color-success)' : 'var(--color-bg)',
          border: `1px solid ${isActive ? 'var(--color-success)' : 'var(--color-border)'}`,
          transition: 'background-color 0.4s ease, border-color 0.4s ease',
          cursor: 'pointer'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '24px',
            backgroundColor: 'var(--color-surface-raised)',
            border: '1px solid var(--color-border)',
            position: 'relative',
            transition: 'border-color 0.4s'
          }}>
            <div style={{
              position: 'absolute',
              top: '2px',
              left: isActive ? '26px' : '2px',
              width: '18px',
              height: '18px',
              backgroundColor: isActive ? '#fff' : 'var(--color-text-muted)',
              transition: 'left 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), background-color 0.3s'
            }} />
          </div>
          <span className="mono uppercase" style={{ 
            color: isActive ? '#fff' : 'var(--color-text-secondary)',
            fontWeight: 'bold',
            fontSize: '14px',
            transition: 'color 0.4s'
          }}>
            {isActive ? 'SAFE ZONE ACTIVE' : 'SAFE ZONE DISABLED'}
          </span>
        </div>
      </button>
    </div>
  );
}
