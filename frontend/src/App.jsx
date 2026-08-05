import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

import BackgroundCanvas from './components/BackgroundCanvas';
import Header from './components/Header';
import AICore from './components/AICore';
import MusicWidget from './components/MusicWidget';
import VoiceVisualizer from './components/VoiceVisualizer';
import FloatingDock from './components/FloatingDock';

import ChatWindow from './windows/ChatWindow';
import VoiceWindow from './windows/VoiceWindow';
import BrowserWindow from './windows/BrowserWindow';
import MusicWindow from './windows/MusicWindow';
import FilesWindow from './windows/FilesWindow';
import SettingsWindow from './windows/SettingsWindow';

import { audioEngine } from './utils/audioEngine';

export default function App() {
  const [gridVisible, setGridVisible] = useState(true);
  const [soundMuted, setSoundMuted] = useState(false);
  const [coreIntensity, setCoreIntensity] = useState('medium');
  const [particleCount, setParticleCount] = useState(40);
  const [activeWindow, setActiveWindow] = useState(null);

  // Audio Engine State
  const [audioState, setAudioState] = useState({
    isPlaying: false,
    isMicActive: false,
    isListeningSpeech: false,
    currentTrack: audioEngine.getCurrentTrack(),
    currentTime: 0,
    duration: 180,
    volume: 0.7
  });
  const [frequencyData, setFrequencyData] = useState([]);
  const [audioLevel, setAudioLevel] = useState(0.05);

  useEffect(() => {
    const unsubscribe = audioEngine.subscribe((state) => {
      setAudioState(state);
    });
    return () => unsubscribe();
  }, []);

  // Real-time audio frequency animation loop
  useEffect(() => {
    let animId;
    const updateAudioViz = () => {
      if (audioState.isPlaying || audioState.isMicActive || audioState.isListeningSpeech) {
        setFrequencyData(audioEngine.getFrequencyData());
        setAudioLevel(audioEngine.getAudioLevel());
      } else {
        setAudioLevel(0.05);
      }
      animId = requestAnimationFrame(updateAudioViz);
    };

    updateAudioViz();

    return () => cancelAnimationFrame(animId);
  }, [audioState.isPlaying, audioState.isMicActive, audioState.isListeningSpeech]);

  useEffect(() => {
    audioEngine.setVolume(soundMuted ? 0 : 0.7);
  }, [soundMuted]);

  const handleTogglePlay = () => {
    audioEngine.togglePlay();
  };

  const handleNextTrack = () => {
    audioEngine.nextTrack();
  };

  const handlePrevTrack = () => {
    audioEngine.prevTrack();
  };

  const handleSeek = (secs) => {
    audioEngine.seek(secs);
  };

  const handleVoiceCommandAction = (action) => {
    if (action === 'play_music') {
      audioEngine.play();
    } else if (action === 'stop_music') {
      audioEngine.pause();
    } else if (action === 'open_chat') {
      setActiveWindow('chat');
    } else if (action === 'open_browser') {
      setActiveWindow('browser');
    } else if (action === 'open_files') {
      setActiveWindow('files');
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-[#050816] text-slate-100 font-sans">
      {/* 1. Background Blueprint Grid & Floating Particles */}
      <BackgroundCanvas gridVisible={gridVisible} particleCount={particleCount} />

      {/* 2. Top Header */}
      <Header />

      {/* 3. Center Screen: Floating Voice Waves + AI Core + Music Widget */}
      <main className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4">
        {/* Floating Voice Wave Visualizer Above Core (Active during microphone voice, speech recognition or audio playback) */}
        {(audioState.isMicActive && !audioState.isPlaying) && (
          <div className="absolute top-1/4 z-30 pointer-events-none">
            <VoiceVisualizer
              frequencyData={frequencyData}
              isPlaying={true}
              audioLevel={audioLevel}
            />
          </div>
        )}

        {/* Music Player Widget (Overlapping left side of core when playing) */}
        <MusicWidget
          isPlaying={audioState.isPlaying}
          currentTrack={audioState.currentTrack}
          currentTime={audioState.currentTime}
          duration={audioState.duration}
          frequencyData={frequencyData}
          audioLevel={audioLevel}
          onTogglePlay={handleTogglePlay}
          onNextTrack={handleNextTrack}
          onPrevTrack={handlePrevTrack}
          onSeek={handleSeek}
          onClose={() => audioEngine.pause()}
        />

        {/* Central Circular AI Core with FALCON in Middle */}
        <AICore
          audioLevel={audioLevel}
          isPlaying={audioState.isPlaying || audioState.isMicActive || audioState.isListeningSpeech}
          coreIntensity={coreIntensity}
          onClick={() => {
            // Clicking central core opens Voice Assistant directly!
            setActiveWindow(activeWindow === 'voice' ? null : 'voice');
          }}
        />
      </main>

      {/* 4. Minimal Bottom Dock */}
      <FloatingDock
        activeWindow={activeWindow}
        setActiveWindow={setActiveWindow}
        isMusicPlaying={audioState.isPlaying}
        toggleMusic={handleTogglePlay}
      />

      {/* 5. Floating Windows */}
      <AnimatePresence>
        {activeWindow === 'chat' && (
          <ChatWindow
            key="chat"
            onClose={() => setActiveWindow(null)}
            onPlayMusic={() => {}}
          />
        )}

        {activeWindow === 'voice' && (
          <VoiceWindow
            key="voice"
            onClose={() => setActiveWindow(null)}
            onVoiceCommand={handleVoiceCommandAction}
          />
        )}

        {activeWindow === 'browser' && (
          <BrowserWindow key="browser" onClose={() => setActiveWindow(null)} />
        )}

        {activeWindow === 'music' && (
          <MusicWindow
            key="music"
            playlist={audioEngine.playlist}
            currentTrack={audioState.currentTrack}
            isPlaying={audioState.isPlaying}
            currentTime={audioState.currentTime}
            duration={audioState.duration}
            volume={audioState.volume}
            onTogglePlay={handleTogglePlay}
            onNextTrack={handleNextTrack}
            onPrevTrack={handlePrevTrack}
            onSeek={handleSeek}
            onSetVolume={(v) => audioEngine.setVolume(v)}
            onClose={() => setActiveWindow(null)}
          />
        )}

        {activeWindow === 'files' && (
          <FilesWindow key="files" onClose={() => setActiveWindow(null)} />
        )}

        {activeWindow === 'settings' && (
          <SettingsWindow
            key="settings"
            gridVisible={gridVisible}
            setGridVisible={setGridVisible}
            soundMuted={soundMuted}
            setSoundMuted={setSoundMuted}
            coreIntensity={coreIntensity}
            setCoreIntensity={setCoreIntensity}
            particleCount={particleCount}
            setParticleCount={setParticleCount}
            onClose={() => setActiveWindow(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
