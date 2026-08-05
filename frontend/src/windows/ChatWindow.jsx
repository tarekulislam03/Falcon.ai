import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, Sparkles, X } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

export default function ChatWindow({ onClose, onPlayMusic }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'falcon',
      text: 'FALCON Core online. Ask me to play a song, query systems, or speak to me via voice.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // Also activate mic for real voice reactivity
    audioEngine.startMicListening();

    const lower = query.toLowerCase();
    const isPlayRequest = lower.includes('play') || lower.includes('song') || lower.includes('music') || lower.includes('thunderstruck');

    setTimeout(() => {
      let aiText = `Processing request: "${query}". Core parameters optimal.`;

      if (isPlayRequest) {
        aiText = 'Now playing Thunderstruck by AC DC. Real-time audio spectrum active.';
        audioEngine.play();
        if (onPlayMusic) onPlayMusic();
      } else if (lower.includes('stop') || lower.includes('pause')) {
        aiText = 'Audio synthesis paused.';
        audioEngine.pause();
      } else if (lower.includes('who') || lower.includes('falcon')) {
        aiText = 'I am FALCON — a calm, minimal artificial intelligence desktop operating system.';
      }

      // Voice Output: Speak response out loud!
      audioEngine.speak(aiText);

      const falconMsg = {
        id: Date.now() + 1,
        sender: 'falcon',
        text: aiText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, falconMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: 'spring', stiffness: 240, damping: 22 }}
      className="fixed inset-x-4 top-20 bottom-24 sm:inset-auto sm:top-24 sm:right-12 sm:w-[420px] sm:h-[520px] glass-panel rounded-3xl border border-cyan-400/30 shadow-[0_15px_50px_rgba(0,0,0,0.7)] flex flex-col z-40 overflow-hidden backdrop-blur-2xl pointer-events-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-cyan-500/20 bg-cyan-950/30">
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
            <Bot className="w-4 h-4 text-cyan-300" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 tracking-wide">FALCON Voice AI</h3>
            <p className="text-[10px] font-mono text-cyan-400/80 font-bold">SPEECH SYNTHESIS ACTIVE</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-slate-800/40 hover:bg-cyan-950/60 border border-cyan-500/20 flex items-center justify-center text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[84%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-cyan-600/30 text-cyan-100 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,240,255,0.15)] rounded-br-none'
                  : 'bg-slate-900/70 text-slate-200 border border-cyan-500/15 shadow-[0_0_10px_rgba(0,0,0,0.4)] rounded-bl-none font-sans'
              }`}
            >
              <p>{msg.text}</p>
              <span className="block text-[9px] font-mono text-right opacity-50 mt-1">
                {msg.time}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-900/70 text-cyan-300 border border-cyan-500/20 rounded-2xl rounded-bl-none p-3 text-xs flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              <span className="font-mono text-[11px]">Synthesizing voice response...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Chips */}
      <div className="px-4 py-2 flex items-center space-x-2 overflow-x-auto border-t border-cyan-500/10 bg-slate-950/30">
        {['Play Song', 'Play Thunderstruck', 'Stop Music'].map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            className="text-[10px] font-mono text-cyan-300/90 bg-cyan-950/50 border border-cyan-500/30 px-3 py-1 rounded-full whitespace-nowrap hover:bg-cyan-500/25 hover:border-cyan-400 transition-colors"
          >
            + {chip}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 border-t border-cyan-500/20 bg-slate-950/50 flex items-center space-x-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Talk to FALCON..."
          className="flex-1 bg-slate-900/60 border border-cyan-500/20 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 transition-all font-sans"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 disabled:opacity-40 flex items-center justify-center hover:bg-cyan-400/30 transition-all"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </motion.div>
  );
}
