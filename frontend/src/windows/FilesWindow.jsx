import React from 'react';
import { motion } from 'framer-motion';
import { Folder, FileText, Cpu, Database, X, ChevronRight, HardDrive } from 'lucide-react';

export default function FilesWindow({ onClose }) {
  const fileNodes = [
    { name: 'Core_Memories.syn', type: 'system', size: '1.2 GB', date: 'Aug 05, 2026' },
    { name: 'Neural_Weights.bin', type: 'data', size: '4.8 GB', date: 'Aug 04, 2026' },
    { name: 'Audio_Streams.wav', type: 'media', size: '320 MB', date: 'Aug 05, 2026' },
    { name: 'Quantum_State.log', type: 'log', size: '42 KB', date: 'Aug 05, 2026' },
    { name: 'User_Preferences.json', type: 'config', size: '8 KB', date: 'Aug 01, 2026' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: 'spring', stiffness: 240, damping: 22 }}
      className="fixed inset-x-4 top-20 bottom-24 sm:inset-auto sm:top-24 sm:left-36 sm:w-[480px] sm:h-[500px] glass-panel rounded-3xl border border-cyan-400/30 shadow-[0_15px_50px_rgba(0,0,0,0.6)] flex flex-col z-40 overflow-hidden backdrop-blur-2xl pointer-events-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-cyan-500/20 bg-cyan-950/20">
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
            <HardDrive className="w-4 h-4 text-cyan-300" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 tracking-wide">Neural Vault</h3>
            <p className="text-[10px] font-mono text-cyan-400/80">ENCRYPTED STORAGE NODE</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-slate-800/40 hover:bg-cyan-950/60 border border-cyan-500/20 flex items-center justify-center text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Storage Gauge */}
      <div className="p-5 border-b border-cyan-500/10 bg-slate-950/30 flex items-center space-x-4">
        <div className="w-10 h-10 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center">
          <Database className="w-5 h-5 text-cyan-400" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
            <span>Neural Vault Storage</span>
            <span className="text-cyan-400">6.36 GB / 128 GB</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-cyan-500/20">
            <div className="h-full bg-cyan-400 w-[5%] shadow-[0_0_10px_#00f0ff]" />
          </div>
        </div>
      </div>

      {/* Files List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {fileNodes.map((file, idx) => (
          <div
            key={idx}
            className="p-3 rounded-2xl bg-slate-900/40 border border-cyan-500/10 hover:border-cyan-400/40 hover:bg-cyan-950/30 transition-all flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center space-x-3">
              <FileText className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-xs font-semibold text-slate-200 font-mono group-hover:text-cyan-300">
                  {file.name}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">{file.date}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-400">
              <span>{file.size}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
