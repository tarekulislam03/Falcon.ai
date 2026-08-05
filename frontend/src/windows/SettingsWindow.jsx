import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Sparkles, Grid, Volume2, Shield, X, Eye } from 'lucide-react';

export default function SettingsWindow({
  gridVisible,
  setGridVisible,
  soundMuted,
  setSoundMuted,
  coreIntensity,
  setCoreIntensity,
  particleCount,
  setParticleCount,
  onClose
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: 'spring', stiffness: 240, damping: 22 }}
      className="fixed inset-x-4 top-20 bottom-24 sm:inset-auto sm:top-24 sm:right-24 sm:w-[440px] sm:h-[500px] glass-panel rounded-3xl border border-cyan-400/30 shadow-[0_15px_50px_rgba(0,0,0,0.6)] flex flex-col z-40 overflow-hidden backdrop-blur-2xl pointer-events-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-cyan-500/20 bg-cyan-950/20">
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
            <Settings className="w-4 h-4 text-cyan-300" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 tracking-wide">System Matrix</h3>
            <p className="text-[10px] font-mono text-cyan-400/80">FALCON OS PARAMETERS</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-slate-800/40 hover:bg-cyan-950/60 border border-cyan-500/20 flex items-center justify-center text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Settings Options */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {/* Core Glow Intensity */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-300">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>AI CORE GLOW INTENSITY</span>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1">
            {['low', 'medium', 'high'].map((level) => (
              <button
                key={level}
                onClick={() => setCoreIntensity(level)}
                className={`py-2 px-3 rounded-xl border text-xs font-mono capitalize transition-all ${
                  coreIntensity === level
                    ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                    : 'bg-slate-900/40 border-cyan-500/15 text-slate-400 hover:border-cyan-500/30'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Blueprint Grid Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/40 border border-cyan-500/15">
          <div className="flex items-center space-x-3">
            <Grid className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="text-xs font-semibold text-slate-200">Blueprint Grid</div>
              <div className="text-[10px] text-slate-400 font-mono">Subtle background geometric grid</div>
            </div>
          </div>
          <button
            onClick={() => setGridVisible(!gridVisible)}
            className={`w-11 h-6 rounded-full transition-colors relative p-1 border ${
              gridVisible ? 'bg-cyan-500/30 border-cyan-400' : 'bg-slate-800 border-slate-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-cyan-300 transition-transform ${
                gridVisible ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Floating Particles Count Slider */}
        <div className="space-y-2 p-3.5 rounded-2xl bg-slate-900/40 border border-cyan-500/15">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-200 flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" /> Floating Particles
            </span>
            <span className="text-cyan-400 font-bold">{particleCount}</span>
          </div>
          <input
            type="range"
            min={10}
            max={80}
            value={particleCount}
            onChange={(e) => setParticleCount(Number(e.target.value))}
            className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Audio Mute Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/40 border border-cyan-500/15">
          <div className="flex items-center space-x-3">
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="text-xs font-semibold text-slate-200">Audio Synthesizer</div>
              <div className="text-[10px] text-slate-400 font-mono">Enable Web Audio synth engine</div>
            </div>
          </div>
          <button
            onClick={() => setSoundMuted(!soundMuted)}
            className={`w-11 h-6 rounded-full transition-colors relative p-1 border ${
              !soundMuted ? 'bg-cyan-500/30 border-cyan-400' : 'bg-slate-800 border-slate-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-cyan-300 transition-transform ${
                !soundMuted ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
