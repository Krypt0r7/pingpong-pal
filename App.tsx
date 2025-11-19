import React, { useState } from 'react';
import { SetupScreen } from './components/SetupScreen';
import { GameScreen } from './components/GameScreen';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameConfig, setGameConfig] = useState({
    p1Name: 'Player 1',
    p2Name: 'Player 2',
    startingServer: 0
  });

  const handleStartGame = (p1Name: string, p2Name: string, startingServer: number) => {
    setGameConfig({ p1Name, p2Name, startingServer });
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-brand-accent selection:text-slate-900">
      {!isPlaying ? (
        <SetupScreen onStart={handleStartGame} />
      ) : (
        <GameScreen 
          initialP1Name={gameConfig.p1Name} 
          initialP2Name={gameConfig.p2Name}
          initialServerIndex={gameConfig.startingServer}
          onReset={handleReset} 
        />
      )}
    </div>
  );
}

export default App;