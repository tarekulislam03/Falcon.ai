import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Radio, X, Sparkles, Volume2, ShieldAlert } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

export default function VoiceWindow({ onClose, onVoiceCommand }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('Click "Start Voice Assistant" or speak now...');
  const [aiSpeech, setAiSpeech] = useState('');
  const [permissionError, setPermissionError] = useState(false);

  const startListening = () => {
    setPermissionError(false);
    audioEngine.startSpeechAssistant(
      (liveText) => {
        setTranscript(liveText || 'Listening to your voice...');
      },
      (action, responseText) => {
        setAiSpeech(responseText);
        if (onVoiceCommand) onVoiceCommand(action);
      }
    ).then(() => {
      setIsListening(true);
      setTranscript('Listening... Speak into your mic now!');
      audioEngine.speak('FALCON listening. Speak your command.');
    }).catch(() => {
      setPermissionError(true);
    });
  };

  useEffect(() => {
    // Automatically attempt start
    startListening();

    return () => {
      audioEngine.stopSpeechAssistant();
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      audioEngine.stopSpeechAssistant();
      setIsListening(false);
      setTranscript('Voice assistant paused.');
    } else {
      startListening();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: 'spring', stiffness: 240, damping: 22 }}
      className="fixed inset-x-4 top-20 bottom-24 sm:inset-auto sm:top-24 sm:right-16 sm:w-[420px] sm:h-[500px] glass-panel rounded-3xl border border-teal-400/30 shadow-[0_15px_50px_rgba(0,0,0,0.75)] flex flex-col z-40 overflow-hidden backdrop-blur-2xl pointer-events-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-teal-500/20 bg-teal-950/30">
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-400/40 flex items-center justify-center">
            <Radio className="w-4 h-4 text-teal-300 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 tracking-wide">FALCON Voice Core</h3>
            <p className="text-[10px] font-mono text-teal-400/80 font-bold">4.5X AMPLIFIED MIC GAIN</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-slate-800/40 hover:bg-teal-950/60 border border-teal-500/20 flex items-center justify-center text-slate-400 hover:text-teal-300 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-5">
        <div className="relative flex items-center justify-center">
          {/* Animated Pulsing Outer Waves */}
          {isListening && (
            <>
              <motion.div
                animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute w-28 h-28 rounded-full bg-teal-500/25 border border-teal-400/40"
              />
              <motion.div
                animate={{ scale: [1, 2.4, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                className="absolute w-28 h-28 rounded-full bg-cyan-500/20 border border-cyan-400/30"
              />
            </>
          )}

          {/* Big Interactive Mic Button */}
          <button
            onClick={toggleListening}
            className={`w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all duration-500 border relative cursor-pointer ${
              isListening
                ? 'bg-teal-500/30 border-teal-400 shadow-[0_0_45px_rgba(20,184,166,0.6)] text-teal-100'
                : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:border-teal-400/50'
            }`}
          >
            {isListening ? (
              <Mic className="w-10 h-10 animate-pulse text-teal-200" />
            ) : (
              <MicOff className="w-10 h-10 text-slate-500" />
            )}
            <span className="text-[9px] font-mono font-bold tracking-wider mt-1 uppercase">
              {isListening ? 'LISTENING' : 'TAP TO START'}
            </span>
          </button>
        </div>

        {/* Permission Alert Warning if Mic Blocked */}
        {permissionError && (
          <div className="flex items-center space-x-2 bg-red-950/60 border border-red-500/40 px-3 py-1.5 rounded-xl text-[11px] font-mono text-red-300">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Mic access required. Please allow microphone in browser URL bar.</span>
          </div>
        )}

        {/* Live Speech Transcript Banner */}
        <div className="w-full text-center space-y-1.5">
          <div className="text-[10px] font-mono tracking-widest text-teal-400/80 uppercase flex items-center justify-center space-x-1">
            <Sparkles className="w-3 h-3 text-teal-300 animate-spin" />
            <span>LIVE TRANSCRIPT</span>
          </div>
          <p className="text-xs font-mono text-teal-100 bg-teal-950/60 border border-teal-500/30 rounded-xl py-2.5 px-4 shadow-[0_0_15px_rgba(20,184,166,0.15)] min-h-[44px] flex items-center justify-center font-medium">
            "{transcript}"
          </p>
        </div>

        {/* FALCON Voice Response Banner */}
        {aiSpeech && (
          <div className="w-full text-center space-y-1">
            <div className="text-[9px] font-mono tracking-widest text-cyan-400/80 uppercase flex items-center justify-center space-x-1">
              <Volume2 className="w-3 h-3 text-cyan-300 animate-pulse" />
              <span>FALCON SPOKE</span>
            </div>
            <p className="text-xs text-cyan-200 bg-slate-900/80 border border-cyan-500/20 rounded-xl py-2 px-3 font-sans">
              {aiSpeech}
            </p>
          </div>
        )}
      </div>

      {/* Suggested Quick Spoken Commands */}
      <div className="p-3 border-t border-teal-500/20 bg-slate-950/50 text-center">
        <span className="text-[10px] font-mono text-slate-400 block mb-1">
          SAY OUT LOUD:
        </span>
        <div className="flex justify-center space-x-2 overflow-x-auto">
          {['"Play song"', '"Stop music"', '"Open browser"', '"Who is Falcon?"'].map((cmd, i) => (
            <button
              key={i}
              onClick={() => {
                audioEngine.processVoiceCommand(cmd.replace(/"/g, ''), onVoiceCommand);
              }}
              className="text-[9px] font-mono text-teal-300 bg-teal-950/70 border border-teal-500/30 px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-teal-500/30 transition-colors"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
