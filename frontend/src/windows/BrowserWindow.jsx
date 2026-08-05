import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Search, ArrowLeft, ArrowRight, RefreshCw, X, ExternalLink } from 'lucide-react';

export default function BrowserWindow({ onClose }) {
  const [url, setUrl] = useState('https://falcon.ai/quantum-network');
  const [activeTab, setActiveTab] = useState('quantum');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: 'spring', stiffness: 240, damping: 22 }}
      className="fixed inset-x-4 top-20 bottom-24 sm:inset-auto sm:top-20 sm:left-24 sm:right-24 sm:bottom-24 glass-panel rounded-3xl border border-blue-400/30 shadow-[0_15px_50px_rgba(0,0,0,0.6)] flex flex-col z-40 overflow-hidden backdrop-blur-2xl pointer-events-auto"
    >
      {/* Browser Bar */}
      <div className="flex items-center space-x-3 px-5 py-3 border-b border-blue-500/20 bg-slate-950/40">
        <div className="flex items-center space-x-1.5">
          <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400 transition-colors" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>

        {/* Address Input */}
        <div className="flex-1 flex items-center bg-slate-900/60 border border-blue-500/20 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-mono shadow-[inset_0_0_10px_rgba(0,0,0,0.4)]">
          <Globe className="w-3.5 h-3.5 text-blue-400 mr-2 shrink-0" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-transparent focus:outline-none text-blue-200"
          />
        </div>

        <button className="text-slate-400 hover:text-blue-300 p-1.5 rounded-lg hover:bg-blue-950/30">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-8 overflow-y-auto flex flex-col items-center justify-center space-y-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-blue-500/10 border border-blue-400/30 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)]">
          <Globe className="w-8 h-8 text-blue-400 animate-pulse" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-wider cyan-glow-text">
            Quantum Net Portal
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1 max-w-md">
            Decentralized neural search and real-time knowledge synthesis stream.
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-lg relative">
          <input
            type="text"
            placeholder="Search quantum index or enter neural URL..."
            className="w-full bg-slate-900/70 border border-blue-400/40 rounded-2xl py-3.5 pl-11 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-400 shadow-[0_0_20px_rgba(0,240,255,0.15)] font-mono"
          />
          <Search className="w-4 h-4 text-blue-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>

        {/* Featured Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-lg pt-4">
          {[
            { title: 'Neural Papers', desc: 'ArXiv AI Preprints' },
            { title: 'Audio Synthetics', desc: 'Frequency Streams' },
            { title: 'Falcon Docs', desc: 'OS Architecture' }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-900/50 border border-blue-500/20 hover:border-blue-400/50 transition-all cursor-pointer text-left group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-200 group-hover:text-cyan-300">{item.title}</span>
                <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
              </div>
              <span className="text-[10px] font-mono text-slate-400 block mt-1">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
