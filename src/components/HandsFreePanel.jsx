import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Timer, Radio, HelpCircle, Activity, Sparkles } from 'lucide-react';
import { soundFX } from '../services/audioFX';
import { speechService } from '../services/speechService';

export function HandsFreePanel({ isMicActive, toggleMic, transcript, lastCommand, onNextStep, onPrevStep, onRepeatStep, onCapturePhoto }) {
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [countdown, setCountdown] = useState(20);

  // Auto Advance Timer logic
  useEffect(() => {
    let interval = null;
    if (autoAdvance) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            soundFX.playVoiceConfirm();
            onNextStep();
            return 20; // reset
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setCountdown(20);
    }
    return () => clearInterval(interval);
  }, [autoAdvance, onNextStep]);

  return (
    <div className="cyber-panel p-4 flex flex-col gap-3 relative">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400 glow-green animate-pulse" />
          <h2 className="text-sm font-bold tracking-wider text-emerald-400">CENTRAL VIVA-VOZ (HANDS-FREE)</h2>
        </div>

        <button
          onClick={() => {
            soundFX.playClick();
            toggleMic();
          }}
          className={`cyber-btn text-xs py-1.5 px-3 flex items-center gap-1.5 ${
            isMicActive ? 'cyber-btn-green mic-ring-active' : 'cyber-btn-secondary'
          }`}
        >
          {isMicActive ? <Mic className="w-4 h-4 animate-pulse text-emerald-400" /> : <MicOff className="w-4 h-4" />}
          <span>{isMicActive ? 'MICROFONE ATIVO' : 'ATIVAR MICROFONE'}</span>
        </button>
      </div>

      {/* Mic Status & Voice Transcript Box */}
      <div className="bg-slate-950/80 p-3 rounded border border-emerald-500/30 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Radio className={`w-3.5 h-3.5 ${isMicActive ? 'text-emerald-400 animate-pulse' : 'text-slate-600'}`} />
            STATUS DA ESCUTA:
          </span>
          <span className={isMicActive ? 'text-emerald-400 font-bold glow-green' : 'text-slate-500'}>
            {isMicActive ? 'ESCUTANDO COMANDOS (PT-BR)...' : 'DESATIVADO (CLIQUE PARA LIGAR)'}
          </span>
        </div>

        {/* Live Speech Recognition Log */}
        <div className="bg-black/60 p-2.5 rounded border border-slate-800 text-xs font-mono min-h-[50px] flex flex-col justify-between">
          <div className="text-cyan-300">
            {transcript ? (
              <span className="italic">"{transcript}"</span>
            ) : (
              <span className="text-slate-600">Diga um comando de voz como "PRÓXIMO" ou "CAPTURAR"...</span>
            )}
          </div>

          {lastCommand && (
            <div className="mt-2 pt-1 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">ÚLTIMO COMANDO RECONHECIDO:</span>
              <span className="text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40">
                {lastCommand}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Voice Speed & Pitch Controls */}
      <div className="bg-slate-950/60 p-3 rounded border border-cyan-500/20 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300">VELOCIDADE DE VOZ DA IA:</span>
        </div>

        <div className="flex items-center gap-3">
          <input 
            type="range"
            min="0.7"
            max="1.5"
            step="0.1"
            defaultValue={parseFloat(localStorage.getItem('cyberdeck_speech_rate') || '1.0')}
            onChange={(e) => {
              const rate = parseFloat(e.target.value);
              speechService.setRate(rate);
            }}
            className="w-24 h-1.5 accent-emerald-500 cursor-pointer"
          />

          <button
            onClick={() => {
              soundFX.playClick();
              speechService.speak("Testando velocidade da narração viva voz da oficina.");
            }}
            className="cyber-btn cyber-btn-secondary text-[11px] py-1 px-2.5 flex items-center gap-1"
          >
            <span>TESTAR VOZ 🔊</span>
          </button>
        </div>
      </div>

      {/* Auto-Advance Hands-Free Timer Mode */}
      <div className="bg-slate-950/60 p-3 rounded border border-cyan-500/20 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Timer className={`w-4 h-4 ${autoAdvance ? 'text-cyan-400 animate-spin-slow' : 'text-slate-500'}`} />
          <div>
            <div className="text-xs font-bold text-cyan-300 font-heading">MODO TEMPORIZADOR AUTOMÁTICO</div>
            <div className="text-[10px] text-slate-400 font-mono">Avança o passo sozinho sem falar a cada 20s</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {autoAdvance && (
            <span className="text-sm font-bold font-mono text-cyan-400 glow-cyan">
              {countdown}s
            </span>
          )}
          <button
            onClick={() => {
              soundFX.playClick();
              setAutoAdvance(!autoAdvance);
            }}
            className={`px-3 py-1 rounded text-xs font-mono border transition-all ${
              autoAdvance ? 'bg-cyan-950 border-cyan-400 text-cyan-300 glow-cyan' : 'bg-slate-900 border-slate-700 text-slate-500'
            }`}
          >
            {autoAdvance ? 'PAUSAR TIMER' : 'ATIVAR TIMER'}
          </button>
        </div>
      </div>

      {/* Voice Command Cheat Sheet Grid */}
      <div>
        <div className="text-[11px] font-mono text-slate-400 mb-2 flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-cyan-400" />
          <span>GUIA DE COMANDOS DE VOZ RECONHECIDOS:</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div className="bg-slate-950/40 border border-cyan-500/20 p-2 rounded flex flex-col gap-0.5">
            <span className="text-cyan-400 font-bold">"PRÓXIMO"</span>
            <span className="text-[10px] text-slate-400">Avança etapa</span>
          </div>

          <div className="bg-slate-950/40 border border-cyan-500/20 p-2 rounded flex flex-col gap-0.5">
            <span className="text-cyan-400 font-bold">"VOLTAR"</span>
            <span className="text-[10px] text-slate-400">Retorna etapa</span>
          </div>

          <div className="bg-slate-950/40 border border-cyan-500/20 p-2 rounded flex flex-col gap-0.5">
            <span className="text-emerald-400 font-bold">"CAPTURAR"</span>
            <span className="text-[10px] text-slate-400">Tira foto AR</span>
          </div>

          <div className="bg-slate-950/40 border border-cyan-500/20 p-2 rounded flex flex-col gap-0.5">
            <span className="text-purple-400 font-bold">"REPETIR"</span>
            <span className="text-[10px] text-slate-400">Fala instrução</span>
          </div>
        </div>
      </div>
    </div>
  );
}
