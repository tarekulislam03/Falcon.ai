import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Repeat, Disc } from 'lucide-react';
import { formatDuration } from '../utils/timeUtils';
import VoiceVisualizer from './VoiceVisualizer';

export default function MusicWidget({
  isPlaying,
  currentTrack,
  currentTime,
  duration,
  frequencyData,
  audioLevel,
  onTogglePlay,
  onNextTrack,
  onPrevTrack,
  onSeek,
  onClose
}) {
  // Show ONLY when music is playing or assistant triggered play
  if (!isPlaying || !currentTrack) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: -30 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.8, x: -30 }}
        transition={{
          type: 'spring',
          stiffness: 280,
          damping: 22
        }}
        // Positioned floating partially overlapping the left side of the AI Core - EXACT MATCH TO SCREENSHOT
        className="absolute left-1/2 -translate-x-[85%] top-1/2 -translate-y-1/2 z-30 pointer-events-auto flex flex-col items-end"
      >
        {/* Floating Voice Audio Waves (Low voice = low waves, high voice = high waves) */}
        <div className="w-full flex justify-center mb-2">
          <VoiceVisualizer
            frequencyData={frequencyData}
            isPlaying={isPlaying}
            audioLevel={audioLevel}
          />
        </div>

        {/* Music Player Card - Styled 1-to-1 with Reference Screenshot */}
        <motion.div
          animate={{
            y: [0, -4, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="relative w-[370px] bg-slate-950/85 backdrop-blur-2xl border border-cyan-500/40 rounded-2xl p-4 shadow-[0_15px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(0,240,255,0.25)] flex flex-col space-y-3 overflow-hidden"
        >
          {/* Top-Left Angled Badge Tab (SPOTIFY_LINK) */}
          <div className="absolute top-0 left-5 bg-cyan-500/25 border-x border-b border-cyan-400/50 px-3 py-0.5 rounded-b-md shadow-[0_0_10px_rgba(0,240,255,0.3)]">
            <span className="text-[9px] font-mono tracking-widest text-cyan-200 uppercase font-semibold">
              SPOTIFY_LINK
            </span>
          </div>

          <div className="flex items-center space-x-4 pt-2">
            {/* Album Cover Art with Red "PLAYER" Badge - Matches Screenshot */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-600 via-neutral-900 to-black p-0.5 shadow-[0_0_20px_rgba(239,68,68,0.3)] border border-red-500/40 flex flex-col items-center justify-center overflow-hidden">
                <Disc className={`w-8 h-8 text-red-500 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
                <span className="text-[7px] font-mono font-bold tracking-tighter text-white bg-red-600/80 px-1 py-0.2 rounded mt-0.5 uppercase">
                  PLAYER
                </span>
              </div>
            </div>

            {/* Song Meta Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-slate-100 truncate tracking-wide font-sans">
                {currentTrack.title || 'Thunderstruck'}
              </h3>
              <p className="text-xs text-cyan-300/90 font-mono font-medium truncate mt-0.5">
                {currentTrack.artist || 'AC/DC'}
              </p>
              <p className="text-[10px] text-slate-400 font-mono truncate">
                {currentTrack.album || 'The Razors Edge'}
              </p>
            </div>

            {/* Close / Minimize Button */}
            {onClose && (
              <button
                onClick={onClose}
                className="text-slate-500 hover:text-cyan-300 text-xs font-mono p-1 transition-colors self-start"
              >
                ✕
              </button>
            )}
          </div>

          {/* Time Progress Scrubber */}
          <div className="space-y-1 pt-1">
            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const newPercent = clickX / rect.width;
                onSeek(newPercent * duration);
              }}
              className="relative w-full h-1 bg-slate-800 rounded-full cursor-pointer overflow-hidden border border-cyan-500/20 group"
            >
              <div
                className="h-full bg-cyan-400 rounded-full relative shadow-[0_0_8px_#00f0ff]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
              <span>{formatDuration(currentTime)}</span>
              <span>{formatDuration(duration)}</span>
            </div>
          </div>

          {/* Playback Controls (Prev, Play/Pause, Next, Repeat) */}
          <div className="flex items-center justify-between pt-1 px-1">
            <div className="flex items-center space-x-2">
              <button
                onClick={onPrevTrack}
                className="w-7 h-7 rounded-lg bg-slate-900/60 border border-cyan-500/20 hover:border-cyan-400 flex items-center justify-center text-slate-300 hover:text-cyan-300 transition-colors"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onTogglePlay}
                className="w-7 h-7 rounded-lg bg-cyan-500/25 border border-cyan-400/60 flex items-center justify-center text-cyan-200 hover:bg-cyan-400/35 shadow-[0_0_12px_rgba(0,240,255,0.3)] transition-all"
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5 fill-cyan-300" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-cyan-300 ml-0.5" />
                )}
              </button>

              <button
                onClick={onNextTrack}
                className="w-7 h-7 rounded-lg bg-slate-900/60 border border-cyan-500/20 hover:border-cyan-400 flex items-center justify-center text-slate-300 hover:text-cyan-300 transition-colors"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={onTogglePlay}
              className="text-slate-400 hover:text-cyan-300 p-1.5 transition-colors"
            >
              <Repeat className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
