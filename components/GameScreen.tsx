import React, { useState, useCallback } from 'react';
import { Button } from './Button';
import { GameState } from '../types';
import confetti from 'canvas-confetti';

// Icons
const UndoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
);

const BallIcon = () => (
  <div className="w-6 h-6 rounded-full bg-brand-accent border-2 border-white shadow-[0_0_10px_rgba(250,204,21,0.8)] animate-bounce" title="Server" />
);

const TrophyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-accent"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 21"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 21"/><path d="M18 2l-2.46 15.06A5 5 0 0 1 10.54 21h-3.08a5 5 0 0 1-5-3.94L2 2"/></svg>
);

interface GameScreenProps {
  initialP1Name: string;
  initialP2Name: string;
  initialServerIndex: number;
  onReset: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  initialP1Name,
  initialP2Name,
  initialServerIndex,
  onReset
}) => {
  // Game State
  const [state, setState] = useState<GameState>({
    p1: { name: initialP1Name, score: 0, color: 'bg-brand-blue' },
    p2: { name: initialP2Name, score: 0, color: 'bg-brand-red' },
    startingServerIndex: initialServerIndex,
    history: [],
    winner: null,
    matchActive: true,
  });

  // --- Logic ---

  const getCurrentServer = useCallback((p1Score: number, p2Score: number, startIdx: number) => {
    const totalPoints = p1Score + p2Score;
    
    // Deuce Logic (both >= 10)
    if (p1Score >= 10 && p2Score >= 10) {
      return (totalPoints + startIdx) % 2; 
    } else {
      return (Math.floor(totalPoints / 2) + startIdx) % 2;
    }
  }, []);

  const serverIndex = getCurrentServer(state.p1.score, state.p2.score, state.startingServerIndex);
  const isP1Serving = serverIndex === 0 && state.winner === null;
  const isP2Serving = serverIndex === 1 && state.winner === null;

  const checkWinner = (s1: number, s2: number): number | null => {
    if (s1 >= 11 && s1 >= s2 + 2) return 0;
    if (s2 >= 11 && s2 >= s1 + 2) return 1;
    return null;
  };

  const handleScore = (playerIndex: 0 | 1) => {
    if (state.winner !== null) return;

    setState(prev => {
      const newHistory = [...prev.history, { p1: prev.p1.score, p2: prev.p2.score }];
      const newP1Score = playerIndex === 0 ? prev.p1.score + 1 : prev.p1.score;
      const newP2Score = playerIndex === 1 ? prev.p2.score + 1 : prev.p2.score;
      
      const winner = checkWinner(newP1Score, newP2Score);
      
      if (winner !== null) {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: winner === 0 ? ['#3b82f6', '#60a5fa'] : ['#ef4444', '#f87171']
        });
      }

      return {
        ...prev,
        p1: { ...prev.p1, score: newP1Score },
        p2: { ...prev.p2, score: newP2Score },
        history: newHistory,
        winner,
        matchActive: winner === null
      };
    });
  };

  const handleUndo = () => {
    if (state.history.length === 0) return;
    
    const previous = state.history[state.history.length - 1];
    setState(prev => ({
      ...prev,
      p1: { ...prev.p1, score: previous.p1 },
      p2: { ...prev.p2, score: previous.p2 },
      history: prev.history.slice(0, -1),
      winner: null,
      matchActive: true
    }));
  };

  // --- UI ---

  return (
    <div className="flex flex-col h-screen max-h-screen bg-slate-900 text-white font-sans">
      
      {/* Header Bar */}
      <div className="flex-none p-4 bg-slate-800 border-b border-slate-700 shadow-md z-20 flex justify-between items-center">
          <Button variant="secondary" size="sm" onClick={onReset}>Exit Match</Button>
          
          <div className="text-slate-400 text-xs md:text-sm font-bold tracking-wider uppercase">
            First to 11 • Win by 2
          </div>

          <Button 
            variant="ghost" 
            onClick={handleUndo} 
            disabled={state.history.length === 0}
            aria-label="Undo last point"
          >
            <UndoIcon />
          </Button>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Player 1 Section */}
        <div className={`flex-1 relative flex flex-col md:border-r-2 border-slate-800 transition-all duration-500`}>
            
            {/* Header Section - Lights up when serving */}
            <div className={`p-6 flex justify-between items-center transition-all duration-500 border-b-4 ${
                isP1Serving 
                  ? 'bg-brand-blue border-blue-400 shadow-[0_0_40px_rgba(59,130,246,0.4)] z-10 translate-y-1 md:translate-y-0 md:scale-[1.02]' 
                  : 'bg-slate-800 border-transparent opacity-60 grayscale'
            }`}>
                <div className="flex flex-col">
                   <h2 className={`text-2xl md:text-4xl font-black truncate max-w-[200px] md:max-w-xs transition-colors duration-300 ${isP1Serving ? 'text-white' : 'text-slate-400'}`}>
                       {state.p1.name}
                   </h2>
                   {isP1Serving && (
                     <span className="text-white/90 text-sm font-bold uppercase tracking-widest animate-pulse mt-1 flex items-center gap-2">
                        Server
                     </span>
                   )}
                </div>
                
                {/* Jumping Dot */}
                <div className="w-12 flex justify-center">
                    {isP1Serving && <BallIcon />}
                    {state.winner === 0 && <span className="text-3xl">👑</span>}
                </div>
            </div>
            
            {/* Big Click Area */}
            <button 
                onClick={() => handleScore(0)}
                disabled={state.winner !== null}
                className="flex-1 w-full flex items-center justify-center group active:bg-blue-500/10 transition-colors outline-none relative overflow-hidden"
            >
                {/* Background hint for clickability */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/10 pointer-events-none"></div>

                <div className="relative z-10">
                    <span className={`text-[180px] md:text-[250px] leading-none font-bold tabular-nums drop-shadow-2xl select-none group-active:scale-95 transition-transform duration-100 block ${isP1Serving ? 'text-white' : 'text-slate-600'}`}>
                        {state.p1.score}
                    </span>
                    <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-slate-500 text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Tap to Score
                    </span>
                </div>
            </button>
        </div>

        {/* VS Divider - simplified */}
        <div className="hidden md:flex w-px bg-slate-700 relative items-center justify-center z-10"></div>

        {/* Player 2 Section */}
        <div className={`flex-1 relative flex flex-col transition-all duration-500`}>
            
            {/* Header Section - Lights up when serving */}
            <div className={`p-6 flex justify-between items-center transition-all duration-500 border-b-4 ${
                isP2Serving 
                  ? 'bg-brand-red border-red-400 shadow-[0_0_40px_rgba(239,68,68,0.4)] z-10 translate-y-1 md:translate-y-0 md:scale-[1.02]' 
                  : 'bg-slate-800 border-transparent opacity-60 grayscale'
            }`}>
                <div className="flex flex-col">
                   <h2 className={`text-2xl md:text-4xl font-black truncate max-w-[200px] md:max-w-xs transition-colors duration-300 ${isP2Serving ? 'text-white' : 'text-slate-400'}`}>
                       {state.p2.name}
                   </h2>
                   {isP2Serving && (
                     <span className="text-white/90 text-sm font-bold uppercase tracking-widest animate-pulse mt-1 flex items-center gap-2">
                        Server
                     </span>
                   )}
                </div>

                {/* Jumping Dot */}
                <div className="w-12 flex justify-center">
                    {isP2Serving && <BallIcon />}
                    {state.winner === 1 && <span className="text-3xl">👑</span>}
                </div>
            </div>
            
            {/* Big Click Area */}
            <button 
                onClick={() => handleScore(1)}
                disabled={state.winner !== null}
                className="flex-1 w-full flex items-center justify-center group active:bg-red-500/10 transition-colors outline-none relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-red-900/10 pointer-events-none"></div>
                
                <div className="relative z-10">
                    <span className={`text-[180px] md:text-[250px] leading-none font-bold tabular-nums drop-shadow-2xl select-none group-active:scale-95 transition-transform duration-100 block ${isP2Serving ? 'text-white' : 'text-slate-600'}`}>
                        {state.p2.score}
                    </span>
                    <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-slate-500 text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Tap to Score
                    </span>
                </div>
            </button>
        </div>
      </div>

      {/* Winner Modal Overlay */}
      {state.winner !== null && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-slate-800 border-2 border-brand-accent rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl transform animate-in zoom-in duration-300">
            <div className="flex justify-center mb-4">
                <TrophyIcon />
            </div>
            <h2 className="text-3xl font-black text-white mb-2">WINNER!</h2>
            <p className={`text-4xl font-bold mb-6 ${state.winner === 0 ? 'text-brand-blue' : 'text-brand-red'}`}>
                {state.winner === 0 ? state.p1.name : state.p2.name}
            </p>
            <div className="text-2xl font-mono text-slate-400 mb-8">
                {state.p1.score} - {state.p2.score}
            </div>
            
            <div className="flex flex-col gap-3">
                <Button onClick={onReset} size="lg" variant="primary">New Match</Button>
                <Button onClick={handleUndo} variant="ghost">Undo Last Point</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};