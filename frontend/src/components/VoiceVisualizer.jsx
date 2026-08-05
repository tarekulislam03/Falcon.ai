import React from 'react';
import { motion } from 'framer-motion';

export default function VoiceVisualizer({ frequencyData = [], isPlaying = false, audioLevel = 0.05 }) {
  if (!isPlaying) return null;

  // Use 20 frequency bands split into left and right wings
  const rawBars = frequencyData.length >= 16 ? frequencyData.slice(0, 20) : new Array(20).fill(15);
  const leftWing = rawBars.slice(0, 10).reverse();
  const rightWing = rawBars.slice(10, 20);

  // Overall amplitude scale factor (low voice = low waves, high voice = tall waves)
  // audioLevel ranges from 0 to 1
  const amplitudeScale = Math.max(0.15, Math.min(1.0, audioLevel * 2.5));

  return (
    <div className="flex items-center justify-center space-x-14 pointer-events-none mb-3">
      {/* Left Wing Voice Bars */}
      <div className="flex items-end space-x-1.5 h-14">
        {leftWing.map((val, idx) => {
          // Calculate dynamic height based on frequency value & overall voice/audio level
          const baseHeight = (val / 255) * 48 * amplitudeScale;
          const minHeight = 3 + (idx % 3);
          const height = Math.max(minHeight, Math.min(52, baseHeight));

          return (
            <motion.div
              key={`left-${idx}`}
              animate={{ height }}
              transition={{ type: 'spring', stiffness: 350, damping: 18 }}
              className="w-1 rounded-full bg-gradient-to-t from-cyan-600 via-cyan-400 to-cyan-200 shadow-[0_0_10px_rgba(0,240,255,0.7)]"
            />
          );
        })}
      </div>

      {/* Center Voice Pulse Dot */}
      <motion.div
        animate={{
          scale: [1, 1.4 * amplitudeScale, 1],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{ duration: 0.6, repeat: Infinity }}
        className="w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_12px_#00f0ff]"
      />

      {/* Right Wing Voice Bars */}
      <div className="flex items-end space-x-1.5 h-14">
        {rightWing.map((val, idx) => {
          const baseHeight = (val / 255) * 48 * amplitudeScale;
          const minHeight = 3 + (idx % 3);
          const height = Math.max(minHeight, Math.min(52, baseHeight));

          return (
            <motion.div
              key={`right-${idx}`}
              animate={{ height }}
              transition={{ type: 'spring', stiffness: 350, damping: 18 }}
              className="w-1 rounded-full bg-gradient-to-t from-cyan-600 via-cyan-400 to-cyan-200 shadow-[0_0_10px_rgba(0,240,255,0.7)]"
            />
          );
        })}
      </div>
    </div>
  );
}
