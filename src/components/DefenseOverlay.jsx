import React from 'react';
import CipherPanel from './CipherPanel';
import AnswerInput from './AnswerInput';
import useCountdown from '../hooks/useCountdown';
import '../styles/components.css';

export default function DefenseOverlay({ attackDetails, onRepel, onBuyTime, onDeployFirewall, tokens }) {
  const { timeLeft, formatTime } = useCountdown(attackDetails.timeLeft || 60);

  return (
    <div className="defense-overlay">
      <div className="hazard-stripes" style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: 'none',
        opacity: 0.1,
        animation: 'pulseHazard 2s infinite'
      }} />

      <div className="defense-overlay-border" />

      <h2 className="mono text-danger uppercase defense-title">
        ⚠ INCOMING ATTACK FROM {attackDetails.from}
      </h2>

      <div className="defense-timer-container">
        <div className="mono text-danger defense-timer-text">
          {formatTime(timeLeft)}
        </div>
        <div className="defense-progress-bg">
          <div 
            className="defense-progress-bar"
            style={{ width: `${(timeLeft / (attackDetails.timeLeft || 90)) * 100}%` }} 
          />
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: '800px' }}>
        <CipherPanel 
          type={attackDetails.puzzle?.type?.toUpperCase() || 'CAESAR'} 
          text={attackDetails.puzzle?.cipherText || 'DEFEND THE SYSTEM'} 
          hint={attackDetails.puzzle?.hint}
        />
        <AnswerInput 
          onSubmit={(ans) => onRepel(ans)} 
          variant="danger" 
          isError={false}
        />

        <div className="defense-actions">
          <button 
            onClick={onBuyTime}
            disabled={tokens < 2}
            className="mono uppercase defense-btn defense-btn-primary"
          >
            BUY TIME (2⬡)
          </button>
          <button 
            onClick={onDeployFirewall}
            disabled={tokens < 3}
            className="mono uppercase defense-btn defense-btn-danger"
          >
            DEPLOY FIREWALL (3⬡)
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulseHazard {
          0% { opacity: 0.05; }
          50% { opacity: 0.15; }
          100% { opacity: 0.05; }
        }
      `}</style>
    </div>
  );
}
