import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import JoinPage from './pages/JoinPage';
import TeamGamePage from './pages/TeamGamePage';
import OrganizerPage from './pages/OrganizerPage';
import { GameProvider } from './hooks/useGameState';

function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/join" replace />} />
          <Route path="/join" element={<JoinPage />} />
          <Route path="/play" element={<TeamGamePage />} />
          <Route path="/organizer" element={<OrganizerPage />} />
        </Routes>
      </BrowserRouter>
    </GameProvider>
  );
}

export default App;
