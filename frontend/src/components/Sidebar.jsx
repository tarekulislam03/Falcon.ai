import React from 'react';
import { motion } from 'framer-motion';
import { Grid, Volume2, VolumeX, ShieldCheck, Sparkles, Activity } from 'lucide-react';

export default function Sidebar({
  gridVisible,
  setGridVisible,
  soundMuted,
  setSoundMuted,
  coreIntensity,
  setCoreIntensity,
  activeWindow,
  setActiveWindow
}) {
  const sidebarItems = [
    {
      id: 'grid-toggle',
      label: gridVisible ? 'Grid: Visible' : 'Grid: Hidden',
      icon: Grid,
      action: () => setGridVisible(!gridVisible),
      active: gridVisible
    },
    {
      id: 'audio-toggle',
      label: soundMuted ? 'Audio: Muted' : 'Audio: Active',
      icon: soundMuted ? VolumeX : Volume2,
      action: () => setSoundMuted(!soundMuted),
      active: !soundMuted
    },
    {
      id: 'intensity',
      label: `Core Glow: ${coreIntensity.toUpperCase()}`,
      icon: Sparkles,
      action: () => {
        const levels = ['low', 'medium', 'high'];
        const next = levels[(levels.indexOf(coreIntensity) + 1) % levels.length];
        setCoreIntensity(next);
      },
      active: true
    },
    {
      id: 'system-health',
      label: 'System Diagnostics',
      icon: Activity,
      action: () => setActiveWindow(activeWindow === 'settings' ? null : 'settings'),
      active: activeWindow === 'settings'
    }
  ];

  return (
    <aside className="fixed left-4 top-1/2 -translate-y-1/2 z-30 pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="glass-panel rounded-2xl py-4 px-2 flex flex-col items-center space-y-4 border border-cyan-500/20 shadow-[0_0_20px_rgba(0,240,255,0.1)]"
      >
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="relative group flex items-center">
              <button
                onClick={item.action}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  item.active
                    ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
              </button>

              {/* Hover Label expanding on hover */}
              <div className="absolute left-14 px-3 py-1.5 rounded-lg glass-panel text-xs tracking-wider text-cyan-200 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 -translate-x-2 group-hover:translate-x-0 font-mono shadow-[0_0_15px_rgba(0,240,255,0.15)] z-40">
                {item.label}
              </div>
            </div>
          );
        })}
      </motion.div>
    </aside>
  );
}
