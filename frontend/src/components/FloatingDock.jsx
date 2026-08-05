import React from 'react';
import { motion } from 'framer-motion';
import { Target, MessageSquare, Camera, Folder, Music } from 'lucide-react';

export default function FloatingDock({ activeWindow, setActiveWindow, isMusicPlaying, toggleMusic }) {
  const dockItems = [
    {
      id: 'core-target',
      label: 'FALCON Core',
      icon: Target,
      action: () => setActiveWindow(null)
    },
    {
      id: 'chat',
      label: 'AI Assistant',
      icon: MessageSquare,
      action: () => setActiveWindow(activeWindow === 'chat' ? null : 'chat')
    },
    {
      id: 'browser',
      label: 'Vision Camera',
      icon: Camera,
      action: () => setActiveWindow(activeWindow === 'browser' ? null : 'browser')
    },
    {
      id: 'files',
      label: 'Neural Files',
      icon: Folder,
      action: () => setActiveWindow(activeWindow === 'files' ? null : 'files')
    },
    {
      id: 'music',
      label: 'Music Player',
      icon: Music,
      action: () => toggleMusic()
    }
  ];

  return (
    <div className="fixed bottom-6 right-16 sm:right-24 z-30 pointer-events-auto flex flex-col items-center space-y-2">
      {/* Minimal Glass Pill Dock - Matched to Screenshot */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
        className="glass-panel rounded-full px-3.5 py-1.5 flex items-center space-x-3 border border-cyan-400/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
      >
        {dockItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeWindow === item.id || (item.id === 'music' && isMusicPlaying);

          return (
            <div key={item.id} className="relative group flex items-center justify-center">
              {/* Tooltip */}
              <div className="absolute -top-9 px-2 py-0.5 rounded glass-panel text-[9px] font-mono text-cyan-200 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                {item.label}
              </div>

              <button
                onClick={item.action}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-950/70 border border-cyan-400/40 shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </motion.div>

      {/* Pagination Pill Dots Underneath - Matched to Screenshot */}
      <div className="flex items-center space-x-1 opacity-70">
        <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
        <div className="w-4 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f0ff]" />
        <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
      </div>
    </div>
  );
}
