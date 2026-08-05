import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function AICore({ audioLevel = 0, isPlaying = false, coreIntensity = 'medium', onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  const intensityMap = {
    low: 0.7,
    medium: 1.0,
    high: 1.3
  };
  const intensity = intensityMap[coreIntensity] || 1.0;
  const coreScale = 1 + audioLevel * 0.25 * intensity;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex items-center justify-center cursor-pointer group pointer-events-auto select-none"
      style={{ width: '380px', height: '380px' }}
    >
      {/* Outer Cyan Glow Aura */}
      <motion.div
        animate={{
          scale: [1 * coreScale, 1.08 * coreScale, 1 * coreScale],
          opacity: [0.3 * intensity, 0.6 * intensity, 0.3 * intensity]
        }}
        transition={{
          duration: isPlaying ? 1.5 : 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute inset-0 rounded-full bg-cyan-400/20 blur-3xl"
      />

      {/* Outer Dashed Orbit Ring with Ticks */}
      <svg
        className="absolute inset-0 w-full h-full animate-rotate-slow pointer-events-none"
        viewBox="0 0 380 380"
      >
        <circle
          cx="190"
          cy="190"
          r="180"
          fill="none"
          stroke="rgba(0, 240, 255, 0.18)"
          strokeWidth="1"
          strokeDasharray="4 12 30 12"
        />

        {/* Orbiting White Ticks & Particles */}
        <circle cx="190" cy="10" r="2.5" fill="#ffffff" className="drop-shadow-[0_0_6px_#ffffff]" />
        <circle cx="370" cy="190" r="2" fill="#00f0ff" className="drop-shadow-[0_0_6px_#00f0ff]" />
        <circle cx="70" cy="310" r="2" fill="#00f0ff" className="drop-shadow-[0_0_6px_#00f0ff]" />
        <circle cx="310" cy="70" r="2" fill="#ffffff" className="drop-shadow-[0_0_6px_#ffffff]" />
      </svg>

      {/* 4 Cardinal Tick Clusters (||| at Top, Bottom, Left, Right) */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 flex space-x-1 text-[10px] font-mono text-slate-300 opacity-60">
        <span>|</span><span>|</span><span>|</span>
      </div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1 text-[10px] font-mono text-slate-300 opacity-60">
        <span>|</span><span>|</span><span>|</span>
      </div>
      <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col space-y-0.5 text-[10px] font-mono text-slate-300 opacity-60">
        <span>-</span><span>-</span><span>-</span>
      </div>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col space-y-0.5 text-[10px] font-mono text-slate-300 opacity-60">
        <span>-</span><span>-</span><span>-</span>
      </div>

      {/* Main Glowing Blue Ring - Matched to Screenshot */}
      <motion.div
        animate={{
          scale: isHovered ? 1.05 * coreScale : 1 * coreScale
        }}
        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
        className="relative w-72 h-72 rounded-full border-2 border-cyan-400/80 bg-slate-950/60 shadow-[0_0_40px_rgba(0,240,255,0.45),inset_0_0_25px_rgba(0,240,255,0.25)] backdrop-blur-md flex items-center justify-center overflow-hidden"
      >
        {/* Inner Pulsing Blue Gradient Arc */}
        <div className="absolute inset-1.5 rounded-full border border-cyan-300/40 opacity-70" />
        <div className="absolute inset-4 rounded-full border border-cyan-500/20" />

        {/* Breathing Inner Cyan Energy Glow */}
        <motion.div
          animate={{
            scale: [0.95, 1.08, 0.95],
            opacity: [0.4, 0.85, 0.4]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute inset-8 rounded-full bg-radial from-cyan-400/30 via-blue-600/15 to-transparent blur-xl"
        />

        {/* FALCON NAME IN THE MIDDLE OF THE AI ASSISTANT - EXACT USER REQUEST */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <motion.span
            animate={{
              opacity: [0.85, 1, 0.85],
              textShadow: [
                '0 0 12px rgba(255,255,255,0.8), 0 0 25px rgba(0,240,255,0.6)',
                '0 0 20px rgba(255,255,255,1), 0 0 35px rgba(0,240,255,0.9)',
                '0 0 12px rgba(255,255,255,0.8), 0 0 25px rgba(0,240,255,0.6)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="text-3xl sm:text-4xl font-extrabold tracking-[0.25em] text-white font-sans uppercase pl-2"
          >
            FALCON
          </motion.span>
          <span className="text-[10px] font-mono tracking-[0.4em] text-cyan-300/80 uppercase mt-1">
            AI CORE
          </span>
        </div>
      </motion.div>
    </div>
  );
}
