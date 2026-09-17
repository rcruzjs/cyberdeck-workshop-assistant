import React, { useState, useEffect } from 'react';
import { Disc, Mic, Volume2, VolumeX, ShieldCheck, Camera, Layers } from 'lucide-react';
import { soundFX } from '../services/audioFX';
import { PROCEDURES_REGISTRY } from '../services/proceduresData';

export function HeaderHUD({ 
  activeProcedureId, 
  onSelectProcedure, 
  currentStep, 
  totalSteps, 
  isMicActive, 
  isSpeaking, 
  soundEnabled, 
  setSoundEnabled, 
  capturedCount 
}) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('pt-BR', { hour12: false }));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleAudio = () => {
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) {
      soundFX.playClick();
    }
  };

  const activeProcedure = PROCEDURES_REGISTRY.find(p => p.id === activeProcedureId) || PROCEDURES_REGISTRY[0];

  return (
    <header className="cyber-panel px-6 py-4 mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-white/10">
      {/* Left Brand ID & Multi-Procedure Dropdown */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
          <Disc className="w-5 h-5 text-emerald-400 animate-spin-slow" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-100 font-heading tracking-tight">OFICINA VIVA-VOZ</h1>
            
            {/* Multi-Procedure Selector Dropdown */}
            <div className="relative flex items-center gap-1 bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={activeProcedureId}
                onChange={(e) => {
                  soundFX.playClick();
                  onSelectProcedure(e.target.value);
                }}
                className="bg-transparent text-xs text-emerald-300 font-medium focus:outline-none cursor-pointer max-w-[200px] truncate"
              >
                {props.proceduresRegistry ? props.proceduresRegistry.map(proc => (
                  <option key={proc.id} value={proc.id} className="bg-slate-900 text-slate-200">
                    [{proc.category}] {proc.title}
                  </option>
                )) : (
                  <option value={activeProcedureId}>[{activeProcedure.category}] {activeProcedure.title}</option>
                )}
              </select>
            </div>

            {/* Import / Export JSON Buttons */}
            <div className="flex items-center gap-1">
              <label 
                className="cyber-btn cyber-btn-secondary text-[11px] px-2 py-0.5 cursor-pointer flex items-center gap-1"
                title="Importar manual em arquivo .JSON"
              >
                <span>+ JSON</span>
                <input 
                  type="file" 
                  accept=".json" 
                  className="hidden" 
                  onChange={(e) => {
                    if (props.onImportJSON) props.onImportJSON(e);
                  }}
                />
              </label>

              {props.onExportCurrentJSON && (
                <button
                  onClick={props.onExportCurrentJSON}
                  className="cyber-btn cyber-btn-secondary text-[11px] px-2 py-0.5 flex items-center gap-1"
                  title="Exportar este procedimento como arquivo .JSON"
                >
                  <span>⬇ JSON</span>
                </button>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-400 flex items-center gap-2 mt-1 font-sans">
            <span className="truncate max-w-[320px]">{activeProcedure.description}</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 flex items-center gap-1 font-medium shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" /> Nominal
            </span>
          </p>
        </div>
      </div>

      {/* Middle Progress Bar */}
      <div className="flex items-center gap-4 bg-slate-900/80 px-4 py-2 rounded-xl border border-white/5 font-sans text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-xs uppercase font-medium tracking-wider">Passo</span>
          <span className="text-slate-100 font-bold text-sm">
            0{currentStep} / 0{totalSteps}
          </span>
        </div>

        <div className="w-28 h-2 bg-slate-800 rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-amber-400 font-medium ml-2">
          <Camera className="w-3.5 h-3.5" />
          <span>{capturedCount} Fotos</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Mic Indicator */}
        <div className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-medium border transition-all ${
          isMicActive 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 mic-ring-active' 
            : 'bg-slate-900 border-white/5 text-slate-400'
        }`}>
          <Mic className={`w-4 h-4 ${isMicActive ? 'animate-pulse text-emerald-400' : ''}`} />
          <span>{isMicActive ? 'Voz Ativa' : 'Mic Off'}</span>
        </div>

        {/* TTS Narrator Indicator */}
        {isSpeaking && (
          <div className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium flex items-center gap-2 animate-pulse">
            <Volume2 className="w-4 h-4 text-indigo-400" />
            <span>Falando...</span>
          </div>
        )}

        {/* PWA Offline Ready Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>OFFLINE READY ⚡</span>
        </div>

        {/* Equipment Profile IndexedDB Button */}
        {props.onOpenProfilesModal && (
          <button
            onClick={props.onOpenProfilesModal}
            className="cyber-btn cyber-btn-secondary text-xs px-2.5 py-1.5 flex items-center gap-1.5"
            title="Gerenciar Perfis de Equipamentos no IndexedDB"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden xl:inline">PERFIL:</span>
            <span className="text-cyan-300 font-bold truncate max-w-[100px]">
              {props.activeProfile ? props.activeProfile.name : 'PADRÃO'}
            </span>
          </button>
        )}

        {/* Audio FX Toggle */}
        <button 
          onClick={toggleAudio}
          className={`p-2 rounded-lg border transition-all ${
            soundEnabled 
              ? 'bg-slate-800/80 border-white/10 text-slate-200 hover:bg-slate-700' 
              : 'bg-slate-900 border-white/5 text-slate-500'
          }`}
          title={soundEnabled ? "Sons Ativados" : "Sons Mutados"}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Clock */}
        <div className="hidden md:block text-right font-mono text-xs text-slate-400">
          {timeStr}
        </div>
      </div>
    </header>
  );
}
