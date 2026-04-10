import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '../hooks/useGameState';

export default function JoinPage() {
  const [roomCode, setRoomCode] = useState('');
  const [teamName, setTeamName] = useState('');
  const [waiting, setWaiting] = useState(false);
  const { joinRoom, organizerJoin } = useGameState();
  const navigate = useNavigate();

  const handleJoin = async (e) => {
    e.preventDefault();
    const code = roomCode.toUpperCase();
    
    setWaiting(true);

    if (code === 'ORG' || code === 'CREATE') {
      try {
        const res = await fetch("http://localhost:3001/api/rooms/create", { method: "POST" });
        const data = await res.json();
        organizerJoin(data.roomCode, "prometheus-admin-2024");
        navigate('/organizer');
      } catch (err) {
        alert("Failed to create room: " + err.message);
        setWaiting(false);
      }
      return;
    }
    
    if (code.startsWith('ORG-')) {
      const actualCode = code.split('-')[1];
      organizerJoin(actualCode, "prometheus-admin-2024");
      navigate('/organizer');
      return;
    }

    const teamId = "t_" + teamName.toLowerCase().replace(/[^a-z0-9]/g, "");
    joinRoom(teamId, code, teamName);

    setTimeout(() => {
      navigate('/play');
    }, 500);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 'var(--spacing-base)' }}>
      <div style={{ width: '100%', maxWidth: '480px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '32px' }}>
        <h1 style={{ color: 'var(--color-primary)', textAlign: 'center', fontSize: '24px', letterSpacing: '0.1em' }} className="mono uppercase">
          ⬡ Operation Prometheus
        </h1>
        <p className="mono text-muted uppercase" style={{ textAlign: 'center', fontSize: '12px', marginBottom: '32px', letterSpacing: '0.05em' }}>
          Authentication Required
        </p>

        {waiting ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <p className="mono text-success uppercase" style={{ fontSize: '16px', letterSpacing: '0.1em' }}>
              Standby — Awaiting Organizer<span style={{ animation: 'blink 1s step-end infinite' }}>|</span>
            </p>
            <style>{`
              @keyframes blink { 50% { opacity: 0; } }
            `}</style>
          </div>
        ) : (
          <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <input
                type="text"
                placeholder="ROOM CODE"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                required
                className="mono uppercase"
                style={{
                  width: '100%', padding: '16px', backgroundColor: 'var(--color-bg)',
                  border: '1px solid var(--color-border)', color: 'var(--color-text)', fontSize: '18px',
                  outline: 'none', transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="TEAM NAME"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
                className="mono uppercase"
                style={{
                  width: '100%', padding: '16px', backgroundColor: 'var(--color-bg)',
                  border: '1px solid var(--color-border)', color: 'var(--color-text)', fontSize: '18px',
                  outline: 'none', transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
              />
            </div>
            <button
              type="submit"
              className="mono uppercase"
              style={{
                marginTop: '16px', width: '100%', height: '48px', backgroundColor: 'var(--color-primary)',
                color: 'var(--color-bg)', fontSize: '18px', fontWeight: 'bold', border: 'none'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-primary-hover)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--color-primary)'}
            >
              Enter The Arena
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
