import React, { useState, useEffect } from 'react';

export default function CipherPanel({ type, text, hint, isSuccess }) {
  const [wipe, setWipe] = useState(false);
  const [displayedText, setDisplayedText] = useState("");

  // Typing effect on new puzzle
  useEffect(() => {
    setDisplayedText("");
    if (!text) return;
    
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.substring(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 15);
    
    return () => clearInterval(interval);
  }, [text]);

  // Success green scan wipe
  useEffect(() => {
    if (isSuccess) {
      setWipe(true);
      const t = setTimeout(() => setWipe(false), 600);
      return () => clearTimeout(t);
    }
  }, [isSuccess]);

  const isBinary = type === 'BINARY';
  
  // Random hex numbers for visual flavor
  const [hexSide, setHexSide] = useState(() => Array.from({length: 12}, () => Math.random().toString(16).substr(2, 6).toUpperCase()));
  
  useEffect(() => {
    const int = setInterval(() => {
      setHexSide(Array.from({length: 12}, () => Math.random().toString(16).substr(2, 6).toUpperCase()));
    }, 2000);
    return () => clearInterval(int);
  }, []);

  return (
    <div className="panel-surface" style={{
      position: 'relative',
      border: `1px solid ${isSuccess ? 'var(--color-success)' : 'var(--color-border)'}`,
      height: '350px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      transition: 'border-color 0.2s',
      padding: '24px'
    }}>
      <div className="mono text-muted uppercase" style={{
        position: 'absolute', top: '12px', left: '12px', fontSize: '10px', letterSpacing: '0.1em'
      }}>
        [INTERCEPT] TYPE: {type} // SOURCE: UNKNOWN
      </div>
      
      {/* Decorative side hex data */}
      <div className="mono text-muted" style={{
        position: 'absolute', left: '12px', top: '40px', fontSize: '10px', display: 'flex', flexDirection: 'column', opacity: 0.5
      }}>
        {hexSide.map((h, i) => <span key={i}>0X{h}</span>)}
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        {isBinary ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, auto)',
            columnGap: '16px',
            rowGap: '8px',
            width: '80%',
            margin: '0 auto',
            justifyContent: 'center'
          }}>
            {text.split(' ').map((chunk, i) => (
              <span key={i} className="mono" style={{ fontSize: '18px', color: 'var(--color-text)', letterSpacing: '0.1em' }}>
                {chunk}
              </span>
            ))}
          </div>
        ) : (
          <div className="mono" style={{
            fontSize: '32px',
            letterSpacing: '0.2em',
            color: 'var(--color-text)',
            textAlign: 'center',
            maxWidth: '85%',
            lineHeight: 1.4,
            wordBreak: 'break-word',
            textShadow: '0 0 10px rgba(232, 228, 220, 0.2)'
          }}>
            {displayedText}
            <span style={{ 
              display: 'inline-block', 
              width: '18px', 
              height: '32px', 
              backgroundColor: 'var(--color-primary)', 
              verticalAlign: 'bottom',
              marginLeft: '8px',
              animation: 'cursorBlink 1s step-end infinite' 
            }} />
          </div>
        )}
      </div>

      {hint && (
        <div className="mono text-muted uppercase" style={{
          position: 'absolute', bottom: '12px', left: '12px', fontSize: '10px', letterSpacing: '0.1em'
        }}>
          * SYSTEM ASSIST: {hint}
        </div>
      )}

      {wipe && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '100%',
          background: 'var(--color-success)',
          opacity: 0.2,
          animation: 'scanwipe 0.6s linear forwards'
        }} />
      )}
      <style>{`
        @keyframes scanwipe {
          0% { transform: translateY(-100%); opacity: 0.4; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        @keyframes cursorBlink { 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}
