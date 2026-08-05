import React, { useState, useEffect } from 'react';
import { formatTime, formatDate } from '../utils/timeUtils';

export default function Header() {
  const [time, setTime] = useState(formatTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(formatTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-10 px-8 flex items-center justify-between z-20 pointer-events-none text-xs font-mono text-slate-500">
      {/* Top Left Clean Status */}
      <div className="flex items-center space-x-3 tracking-widest text-[10px]">
        <span className="text-cyan-400/80 font-bold">FALCON.AI</span>
        <span>/</span>
        <span className="text-slate-400">BLUEPRINT_GRID</span>
      </div>

      {/* Top Right Live Time */}
      <div className="flex items-center space-x-4 tracking-widest text-[10px]">
        <span className="text-cyan-300 font-semibold">{time}</span>
        <div className="flex items-center space-x-1.5 bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-cyan-300 font-bold">ONLINE</span>
        </div>
      </div>
    </header>
  );
}
