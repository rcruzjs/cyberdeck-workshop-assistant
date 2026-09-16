import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, ArrowLeft, ArrowRight, ShieldAlert, CheckSquare, Square, Lightbulb, Clock, Sparkles } from 'lucide-react';
import { speechService } from '../services/speechService';
import { soundFX } from '../services/audioFX';

export function StepGuide({ step, totalSteps, onNext, onPrev, isSpeaking, setIsSpeaking }) {
  const [checkedTools, setCheckedTools] = useState({});

  useEffect(() => {
    // Reset checked tools on step change
    setCheckedTools({});
    
    // Automatically narrate step instruction using SpeechSynthesis
    narrateStep();
  }, [step.id]);

  const narrateStep = () => {
    soundFX.playClick();
    speechService.speak(step.narration, () => {
      setIsSpeaking(false);
    });
    setIsSpeaking(true);
  };

  const stopNarration = () => {
    speechService.stopSpeaking();
    setIsSpeaking(false);
  };

  const toggleTool = (idx) => {
    soundFX.playClick();
    setCheckedTools(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="cyber-panel p-5 flex flex-col gap-4 relative">
      {/* Step Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/20 pb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 font-mono border border-cyan-500/40">
              PASSO 0{step.id} DE 0{totalSteps}
            </span>
            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" /> TEMPO EST.: {step.duration}
            </span>
          </div>
          <h2 className="text-lg font-bold text-cyan-300 glow-cyan">{step.title}</h2>
          <p className="text-xs text-slate-400 font-mono">{step.subtitle}</p>
        </div>

        {/* TTS Narration Controls */}
        <div className="flex items-center gap-2">
          {isSpeaking ? (
            <button
              onClick={stopNarration}
              className="cyber-btn cyber-btn-danger text-xs py-1.5 px-3 flex items-center gap-1.5"
            >
              <VolumeX className="w-4 h-4 animate-bounce" />
              <span>PARAR VOZ</span>
            </button>
          ) : (
            <button
              onClick={narrateStep}
              className="cyber-btn text-xs py-1.5 px-3 flex items-center gap-1.5"
            >
              <Volume2 className="w-4 h-4" />
              <span>OUVIR INSTRUÇÃO (TTS)</span>
            </button>
          )}
        </div>
      </div>

      {/* Safety Alert Banner */}
      {step.safetyAlert && (
        <div className="bg-amber-950/40 border border-amber-500/40 p-3 rounded flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-amber-400 block font-heading mb-0.5">ALERTA DE SEGURANÇA E PRECAUÇÃO:</span>
            <span className="text-amber-200/90">{step.safetyAlert}</span>
          </div>
        </div>
      )}

      {/* Voice Trigger Cue Banner */}
      <div className="bg-slate-950/80 border border-emerald-500/40 p-3 rounded flex items-center justify-between gap-3 glow-green">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-emerald-300">
            <strong className="text-emerald-400">COMANDO DE VOZ VIVA-VOZ:</strong> {step.voiceCommandHint}
          </span>
        </div>
      </div>

      {/* Instructions & Tools Dual Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-1">
        {/* Detailed Instructions (2 cols) */}
        <div className="md:col-span-2 bg-slate-950/50 p-4 rounded border border-cyan-500/20">
          <h3 className="text-xs font-bold text-cyan-400 font-heading mb-3 flex items-center gap-1.5">
            <span>PROCEDIMENTO OPERACIONAL:</span>
          </h3>
          <ol className="space-y-2 text-xs text-slate-200">
            {step.instructions.map((inst, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{inst}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Required Tools Checklist (1 col) */}
        <div className="bg-slate-950/50 p-4 rounded border border-cyan-500/20 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-cyan-400 font-heading mb-3 flex items-center gap-1.5">
              <span>CHECKLIST DE MATERIAIS:</span>
            </h3>
            <ul className="space-y-2 text-xs">
              {step.tools.map((tool, idx) => (
                <li 
                  key={idx} 
                  onClick={() => toggleTool(idx)}
                  className={`flex items-center gap-2 cursor-pointer transition-colors p-1.5 rounded ${
                    checkedTools[idx] ? 'bg-emerald-950/40 text-emerald-300 line-through' : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  {checkedTools[idx] ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                  <span>{tool}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Expert Tip Box */}
      {step.tip && (
        <div className="bg-cyan-950/30 border border-cyan-500/30 p-3 rounded flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-cyan-400 font-heading block mb-0.5">DICA DO TÉCNICO:</span>
            <span className="text-cyan-200/80 font-mono">{step.tip}</span>
          </div>
        </div>
      )}

      {/* Footer Navigation Buttons */}
      <div className="flex items-center justify-between border-t border-cyan-500/20 pt-3">
        <button
          onClick={onPrev}
          disabled={step.id === 1}
          className={`cyber-btn cyber-btn-secondary text-xs ${step.id === 1 ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>PASSO ANTERIOR</span>
        </button>

        <span className="text-xs font-mono text-slate-400 hidden sm:inline">
          Diga <strong className="text-cyan-300">"PRÓXIMO"</strong> ou <strong className="text-cyan-300">"VOLTAR"</strong> no microfone
        </span>

        <button
          onClick={onNext}
          className="cyber-btn cyber-btn-green text-xs"
        >
          <span>{step.id === totalSteps ? 'CONCLUIR MONTAGEM' : 'PRÓXIMO PASSO'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
