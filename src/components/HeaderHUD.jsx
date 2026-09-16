import React, { useState, useEffect } from 'react';
import { Cpu, Camera, Mic, Volume2, VolumeX, ShieldCheck, Zap, Disc } from 'lucide-react';
import { soundFX } from '../services/audioFX';

export function HeaderHUD({ currentStep, totalSteps, isMicActive, isSpeaking, soundEnabled, setSoundEnabled, capturedCount }) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('pt-BR', { hour12: false }) + ' . ' + now.getMilliseconds().toString().padStart(3, '0'));
    };
    updateClock();
    const timer = setInterval(updateClock, 100);
    return () => clearInterval(timer);
  }, []);

  const toggleAudio = () => {
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) {
      soundFX.playClick();
    }
  };

  return (
    <header className="cyber-panel p-4 mb-4 flex flex-wrap items-center justify-between gap-4 border-b border-cyan-500/30">
      {/* Left Title & System ID */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded border border-cyan-400 bg-cyan-950/40 flex items-center justify-center glow-cyan">
          <Disc className="w-6 h-6 text-cyan-400 animate-spin-slow" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-wider text-cyan-400 glow-cyan">CYBERDECK // OFICINA BIKE</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 font-mono border border-cyan-500/40">
              VIVA-VOZ v2.5
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono flex items-center gap-2">
            <span>PROCEDIMENTO: ENCHER PNEU DE BICICLETA</span>
            <span className="text-cyan-500">•</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> SISTEMA NOMINAL
            </span>
          </p>
        </div>
      </div>

      {/* Middle Telemetry & Step Progress */}
      <div className="flex items-center gap-6 bg-slate-950/60 px-4 py-2 rounded border border-cyan-500/20 font-mono text-sm">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-xs">ETAPA ATIVA:</span>
          <span className="text-cyan-400 font-bold text-base glow-cyan">
            0{currentStep} / 0{totalSteps}
          </span>
        </div>

        <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden border border-cyan-500/30">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500 shadow-[0_0_8px_#00f3ff]"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
          <span className="text-xs text-amber-300 font-mono">FOTOS PNEU: {capturedCount}</span>
        </div>
      </div>

      {/* Right Controls & Status Indicators */}
      <div className="flex items-center gap-3">
        {/* Mic Active Indicator */}
        <div className={`px-3 py-1.5 rounded flex items-center gap-2 text-xs font-mono border transition-all ${
          isMicActive 
            ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400 shadow-[0_0_12px_rgba(0,255,102,0.4)] mic-ring-active' 
            : 'bg-slate-900 border-slate-700 text-slate-500'
        }`}>
          <Mic className={`w-4 h-4 ${isMicActive ? 'animate-pulse text-emerald-400' : ''}`} />
          <span>{isMicActive ? 'MIC ESCUTANDO' : 'MIC OFF'}</span>
        </div>

        {/* TTS Narrator Active Indicator */}
        {isSpeaking && (
          <div className="px-3 py-1.5 rounded bg-purple-950/80 border border-purple-500 text-purple-300 text-xs font-mono flex items-center gap-2 shadow-[0_0_12px_rgba(157,78,221,0.4)] animate-pulse">
            <Volume2 className="w-4 h-4 text-purple-400" />
            <span>FALANDO...</span>
          </div>
        )}

        {/* Sound FX Toggle */}
        <button 
          onClick={toggleAudio}
          className={`p-2 rounded border transition-all ${
            soundEnabled 
              ? 'bg-cyan-950/60 border-cyan-500 text-cyan-400 hover:bg-cyan-900/60' 
              : 'bg-slate-900 border-slate-700 text-slate-500'
          }`}
          title={soundEnabled ? "Sons HUD Ativados" : "Sons Mutados"}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* HUD Live Clock */}
        <div className="hidden md:block text-right font-mono text-xs text-cyan-400 glow-cyan px-2">
          {timeStr}
        </div>
      </div>
    </header>
  );
}
