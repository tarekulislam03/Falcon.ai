import React from 'react';
import { motion } from 'framer-motion';
import { Music, Play, Pause, SkipForward, SkipBack, Volume2, X, Disc, Radio } from 'lucide-react';
import { formatDuration } from '../utils/timeUtils';

export default function MusicWindow({
  playlist = [],
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  volume,
  onTogglePlay,
  onNextTrack,
  onPrevTrack,
  onSeek,
  onSetVolume,
  onClose
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: 'spring', stiffness: 240, damping: 22 }}
      className="fixed inset-x-4 top-20 bottom-24 sm:inset-auto sm:top-24 sm:left-24 sm:w-[460px] sm:h-[540px] glass-panel rounded-3xl border border-indigo-400/30 shadow-[0_15px_50px_rgba(0,0,0,0.6)] flex flex-col z-40 overflow-hidden backdrop-blur-2xl pointer-events-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-indigo-500/20 bg-indigo-950/20">
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center">
            <Music className="w-4 h-4 text-indigo-300" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 tracking-wide">Audio Matrix</h3>
            <p className="text-[10px] font-mono text-indigo-300/80">SYNTHETIC AUDIO GENERATOR</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-slate-800/40 hover:bg-indigo-950/60 border border-indigo-500/20 flex items-center justify-center text-slate-400 hover:text-indigo-300 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Track Details */}
      <div className="p-6 flex flex-col items-center justify-center space-y-4 border-b border-indigo-500/10">
        <div className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${currentTrack?.coverGradient || 'from-indigo-600 to-purple-900'} p-1 shadow-[0_0_30px_rgba(99,102,241,0.4)] flex items-center justify-center border border-indigo-300/40`}>
          <Disc className={`w-16 h-16 text-indigo-100 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
        </div>

        <div className="text-center">
          <h2 className="text-lg font-bold text-slate-100 tracking-wide">{currentTrack?.title}</h2>
          <p className="text-xs text-indigo-300 font-mono mt-0.5">{currentTrack?.artist}</p>
        </div>

        {/* Progress Slider */}
        <div className="w-full space-y-1">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>{formatDuration(currentTime)}</span>
            <span>{formatDuration(duration)}</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center space-x-6 pt-2">
          <button onClick={onPrevTrack} className="text-slate-400 hover:text-cyan-300 transition-colors p-2">
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={onTogglePlay}
            className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400/60 flex items-center justify-center text-cyan-200 hover:bg-cyan-400/30 shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-cyan-300" /> : <Play className="w-6 h-6 fill-cyan-300 ml-0.5" />}
          </button>

          <button onClick={onNextTrack} className="text-slate-400 hover:text-cyan-300 transition-colors p-2">
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Track List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        <h4 className="text-[10px] font-mono tracking-widest text-indigo-300/70 uppercase px-2">Playlist</h4>
        {playlist.map((track, idx) => (
          <div
            key={track.id}
            onClick={() => {
              if (currentTrack.id !== track.id) {
                onNextTrack();
              }
            }}
            className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer border transition-all ${
              currentTrack.id === track.id
                ? 'bg-cyan-950/40 border-cyan-400/40 text-cyan-200 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                : 'bg-slate-900/40 border-transparent text-slate-400 hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Radio className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="text-xs font-semibold text-slate-200">{track.title}</div>
                <div className="text-[10px] font-mono text-slate-400">{track.artist}</div>
              </div>
            </div>
            <span className="text-[10px] font-mono">{formatDuration(track.duration)}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
