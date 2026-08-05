// FALCON OS Audio Engine with Amplified Microphone Gain & Robust Speech Recognition
class AudioEngine {
  constructor() {
    this.audioCtx = null;
    this.analyser = null;
    this.dataArray = null;
    this.isPlaying = false;
    this.isMicActive = false;
    this.isListeningSpeech = false;
    this.micStream = null;
    this.micSourceNode = null;
    this.micGainNode = null;
    this.volume = 0.7;
    this.currentTime = 0;
    this.duration = 180;
    this.timerId = null;
    this.synthOscillators = [];
    this.activeTrackIndex = 0;
    this.listeners = new Set();
    this.synth = window.speechSynthesis || null;

    // Web Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 3;
      this.recognition.lang = 'en-US';
    } else {
      this.recognition = null;
    }

    this.playlist = [
      {
        id: 'synth-1',
        title: 'Thunderstruck',
        artist: 'AC/DC',
        album: 'The Razors Edge',
        coverGradient: 'from-red-600 via-neutral-900 to-black',
        duration: 292,
        bpm: 133,
        scale: [164.81, 196.00, 220.00, 246.94, 293.66, 329.63]
      },
      {
        id: 'synth-2',
        title: 'Neural Drift',
        artist: 'FALCON Core',
        album: 'Cyber Horizon',
        coverGradient: 'from-cyan-500 via-blue-600 to-indigo-900',
        duration: 180,
        bpm: 110,
        scale: [220, 261.63, 293.66, 329.63, 392.00, 440]
      }
    ];
  }

  init() {
    if (this.audioCtx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    this.audioCtx = new AudioContext();
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 64;
    this.analyser.smoothingTimeConstant = 0.75; // More responsive wave movement

    this.masterGain = this.audioCtx.createGain();
    this.masterGain.gain.value = this.volume;

    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.audioCtx.destination);

    const bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);
  }

  // --- Start Amplified Microphone & Speech Recognition ---
  async startSpeechAssistant(onTranscriptCallback, onCommandCallback) {
    this.init();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }

    // 1. Amplified Mic Audio Stream (Boosted Gain for quiet mics)
    try {
      if (!this.micStream) {
        this.micStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });

        this.micSourceNode = this.audioCtx.createMediaStreamSource(this.micStream);
        
        // Microphone Gain Booster (Multiply mic sensitivity x 4.5 for high responsiveness)
        this.micGainNode = this.audioCtx.createGain();
        this.micGainNode.gain.value = 4.5;

        this.micSourceNode.connect(this.micGainNode);
        this.micGainNode.connect(this.analyser);
      }
      this.isMicActive = true;
    } catch (err) {
      console.warn('Microphone error:', err);
      this.isMicActive = true;
    }

    // 2. Speech Recognition Setup with Auto-Reconnect
    if (this.recognition) {
      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalTranscript += item[0].transcript;
          } else {
            interimTranscript += item[0].transcript;
          }
        }

        const currentText = (finalTranscript || interimTranscript).trim();
        if (onTranscriptCallback && currentText) {
          onTranscriptCallback(currentText);
        }

        if (finalTranscript) {
          this.processVoiceCommand(finalTranscript, onCommandCallback);
        }
      };

      this.recognition.onerror = (e) => {
        console.warn('Speech recognition error:', e.error);
        if (e.error === 'not-allowed') {
          if (onTranscriptCallback) {
            onTranscriptCallback('Microphone blocked. Please click allow in browser location bar.');
          }
        }
      };

      this.recognition.onend = () => {
        if (this.isListeningSpeech) {
          try { this.recognition.start(); } catch (e) {}
        }
      };

      try {
        this.recognition.start();
        this.isListeningSpeech = true;
      } catch (e) {
        this.isListeningSpeech = true;
      }
    }

    this.notify();
  }

  stopSpeechAssistant() {
    this.isListeningSpeech = false;
    this.isMicActive = false;

    if (this.recognition) {
      try { this.recognition.stop(); } catch (e) {}
    }

    if (this.micStream) {
      this.micStream.getTracks().forEach(track => track.stop());
      this.micStream = null;
    }

    if (this.micSourceNode) {
      this.micSourceNode.disconnect();
      this.micSourceNode = null;
    }

    if (this.micGainNode) {
      this.micGainNode.disconnect();
      this.micGainNode = null;
    }

    this.notify();
  }

  // --- Voice Command Parsing ---
  processVoiceCommand(text, onCommandCallback) {
    const cmd = text.toLowerCase();
    let responseText = '';

    if (cmd.includes('play') || cmd.includes('song') || cmd.includes('music') || cmd.includes('thunderstruck') || cmd.includes('start')) {
      this.play();
      responseText = 'Playing Thunderstruck by AC DC.';
      if (onCommandCallback) onCommandCallback('play_music', responseText);
    } else if (cmd.includes('stop') || cmd.includes('pause') || cmd.includes('quiet') || cmd.includes('mute')) {
      this.pause();
      responseText = 'Music playback paused.';
      if (onCommandCallback) onCommandCallback('stop_music', responseText);
    } else if (cmd.includes('chat') || cmd.includes('talk') || cmd.includes('message')) {
      responseText = 'Opening AI assistant chat.';
      if (onCommandCallback) onCommandCallback('open_chat', responseText);
    } else if (cmd.includes('browser') || cmd.includes('search') || cmd.includes('web')) {
      responseText = 'Opening Quantum Net Browser.';
      if (onCommandCallback) onCommandCallback('open_browser', responseText);
    } else if (cmd.includes('file') || cmd.includes('vault') || cmd.includes('storage')) {
      responseText = 'Opening Neural Vault storage.';
      if (onCommandCallback) onCommandCallback('open_files', responseText);
    } else if (cmd.includes('who') || cmd.includes('name') || cmd.includes('falcon') || cmd.includes('hello') || cmd.includes('hi')) {
      responseText = 'Hello! I am FALCON — your artificial intelligence desktop operating system.';
      if (onCommandCallback) onCommandCallback('info', responseText);
    } else {
      responseText = `I heard: "${text}". FALCON core active.`;
      if (onCommandCallback) onCommandCallback('general', responseText);
    }

    // Speak response back out loud
    this.speak(responseText);
  }

  // --- Speech Synthesis ---
  speak(text) {
    if (!this.synth) return;
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 0.95;

    const voices = this.synth.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('David') || v.name.includes('Zira'))) || voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;

    this.synth.speak(utterance);
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    const currentTrack = this.getCurrentTrack();
    this.listeners.forEach(fn => fn({
      isPlaying: this.isPlaying,
      isMicActive: this.isMicActive,
      isListeningSpeech: this.isListeningSpeech,
      currentTrack,
      currentTime: this.currentTime,
      duration: currentTrack.duration,
      volume: this.volume
    }));
  }

  getCurrentTrack() {
    return this.playlist[this.activeTrackIndex];
  }

  startSynthSequence() {
    if (!this.audioCtx) this.init();
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    this.stopSynthSequence();

    const track = this.getCurrentTrack();
    const intervalMs = (60 / track.bpm) * 500;

    const bassOsc = this.audioCtx.createOscillator();
    const bassGain = this.audioCtx.createGain();
    bassOsc.type = 'sine';
    bassOsc.frequency.setValueAtTime(track.scale[0] / 2, this.audioCtx.currentTime);
    bassGain.gain.setValueAtTime(0.15 * this.volume, this.audioCtx.currentTime);
    bassOsc.connect(bassGain);
    bassGain.connect(this.masterGain);
    bassOsc.start();
    this.synthOscillators.push(bassOsc);

    let step = 0;
    this.synthInterval = setInterval(() => {
      if (!this.isPlaying || !this.audioCtx) return;

      const freq = track.scale[step % track.scale.length];
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = step % 2 === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      const now = this.audioCtx.currentTime;
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.exponentialRampToValueAtTime(0.12 * this.volume, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (intervalMs / 1000) * 0.9);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + intervalMs / 1000);

      step++;
    }, intervalMs);
  }

  stopSynthSequence() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    this.synthOscillators.forEach(osc => {
      try { osc.stop(); } catch (e) {}
    });
    this.synthOscillators = [];
  }

  play() {
    this.init();
    this.isPlaying = true;
    this.startSynthSequence();

    if (this.timerId) clearInterval(this.timerId);
    this.timerId = setInterval(() => {
      const track = this.getCurrentTrack();
      this.currentTime += 1;
      if (this.currentTime >= track.duration) {
        this.nextTrack();
      } else {
        this.notify();
      }
    }, 1000);

    this.notify();
  }

  pause() {
    this.isPlaying = false;
    this.stopSynthSequence();
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.notify();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  nextTrack() {
    this.activeTrackIndex = (this.activeTrackIndex + 1) % this.playlist.length;
    this.currentTime = 0;
    if (this.isPlaying) {
      this.startSynthSequence();
    }
    this.notify();
  }

  prevTrack() {
    this.activeTrackIndex = (this.activeTrackIndex - 1 + this.playlist.length) % this.playlist.length;
    this.currentTime = 0;
    if (this.isPlaying) {
      this.startSynthSequence();
    }
    this.notify();
  }

  seek(seconds) {
    this.currentTime = Math.max(0, Math.min(seconds, this.getCurrentTrack().duration));
    this.notify();
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx ? this.audioCtx.currentTime : 0);
    }
    this.notify();
  }

  getFrequencyData() {
    if (!this.analyser) {
      return new Array(20).fill(15);
    }
    this.analyser.getByteFrequencyData(this.dataArray);
    return Array.from(this.dataArray.slice(0, 20));
  }

  getAudioLevel() {
    if (!this.analyser) return 0.08;
    const freq = this.getFrequencyData();
    const sum = freq.reduce((acc, v) => acc + v, 0);
    const raw = sum / (freq.length * 255);
    // Multiply sensitivity x 4.0 for immediate voice detection even on quiet mics
    return Math.min(1, Math.max(0.06, raw * 4.5));
  }
}

export const audioEngine = new AudioEngine();
