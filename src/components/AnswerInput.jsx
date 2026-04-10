import React, { useState } from 'react';

export default function AnswerInput({ onSubmit, isError, variant = 'normal' }) {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answer.trim()) {
      onSubmit(answer.trim().toUpperCase());
      setAnswer('');
    }
  };

  const isDanger = variant === 'danger';

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', marginTop: '16px' }}>
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="ENTER DECRYPTED MESSAGE..."
        className={`mono uppercase ${isError ? 'shake' : ''}`}
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: 'var(--color-bg)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text)',
          fontSize: '18px',
          outline: 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          borderRadius: 0
        }}
        onFocus={(e) => {
          e.target.style.borderColor = isDanger ? 'var(--color-danger)' : 'var(--color-primary)';
          e.target.style.boxShadow = `inset 0 0 0 1px ${isDanger ? 'var(--color-danger)' : 'var(--color-primary)'}`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--color-border)';
          e.target.style.boxShadow = 'none';
        }}
      />
      <button
        type="submit"
        className="mono uppercase"
        style={{
          marginTop: '16px',
          width: '100%',
          height: '48px',
          backgroundColor: isDanger ? 'var(--color-danger)' : 'var(--color-primary)',
          color: isDanger ? 'var(--color-text)' : 'var(--color-bg)',
          fontSize: '16px',
          fontWeight: 'bold',
          border: 'none'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = isDanger ? 'var(--color-danger-hover)' : 'var(--color-primary-hover)'}
        onMouseLeave={(e) => e.target.style.backgroundColor = isDanger ? 'var(--color-danger)' : 'var(--color-primary)'}
      >
        {isDanger ? 'REPEL ATTACK' : 'SUBMIT ANSWER'}
      </button>

      <style>{`
        .shake {
          animation: shake 300ms ease-in-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          50% { transform: translateX(6px); }
          75% { transform: translateX(-6px); }
        }
      `}</style>
    </form>
  );
}
