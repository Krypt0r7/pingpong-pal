import React, { useState } from 'react';
import { Button } from './Button';

interface SetupScreenProps {
  onStart: (p1Name: string, p2Name: string, startingServer: number) => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStart }) => {
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [starter, setStarter] = useState<number>(0); // 0 for p1, 1 for p2

  const handleStart = () => {
    const name1 = p1.trim() || 'Player 1';
    const name2 = p2.trim() || 'Player 2';
    onStart(name1, name2, starter);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-8 max-w-md mx-auto w-full">
      <div className="text-center space-y-2">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-accent">
          PingPong Pal
        </h1>
        <p className="text-slate-400 text-lg">The best way to track your game! 🏓</p>
      </div>

      <div className="bg-slate-800 p-6 rounded-3xl shadow-2xl w-full space-y-6 border border-slate-700">
        
        {/* Player 1 Input */}
        <div className="space-y-2">
          <label className="block text-brand-blue font-bold text-lg ml-1">Player 1 (Blue)</label>
          <input
            type="text"
            value={p1}
            onChange={(e) => setP1(e.target.value)}
            placeholder="Enter Name"
            className="w-full bg-slate-900 text-white text-xl px-4 py-3 rounded-xl border-2 border-slate-700 focus:border-brand-blue focus:outline-none transition-colors"
          />
        </div>

        {/* Player 2 Input */}
        <div className="space-y-2">
          <label className="block text-brand-red font-bold text-lg ml-1">Player 2 (Red)</label>
          <input
            type="text"
            value={p2}
            onChange={(e) => setP2(e.target.value)}
            placeholder="Enter Name"
            className="w-full bg-slate-900 text-white text-xl px-4 py-3 rounded-xl border-2 border-slate-700 focus:border-brand-red focus:outline-none transition-colors"
          />
        </div>

        {/* Serve Selection */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
            <span className="block text-center text-slate-400 mb-3 text-sm uppercase tracking-wider font-bold">Who Serves First?</span>
            <div className="flex gap-4">
                <button 
                    onClick={() => setStarter(0)}
                    className={`flex-1 py-3 rounded-lg font-bold transition-all ${starter === 0 ? 'bg-brand-blue text-white ring-2 ring-white' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'}`}
                >
                    {p1 || 'Player 1'}
                </button>
                <button 
                    onClick={() => setStarter(1)}
                    className={`flex-1 py-3 rounded-lg font-bold transition-all ${starter === 1 ? 'bg-brand-red text-white ring-2 ring-white' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'}`}
                >
                    {p2 || 'Player 2'}
                </button>
            </div>
        </div>

        <Button onClick={handleStart} size="lg" className="w-full mt-4">
          Start Match 🚀
        </Button>
      </div>
    </div>
  );
};