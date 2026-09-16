import React, { useState } from 'react';
import { Gauge, Activity, Zap, CheckCircle2, RefreshCw, Disc, ShieldCheck } from 'lucide-react';
import { soundFX } from '../services/audioFX';

export function DiagnosticPanel() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState({
    status: 'VÁLVULA VEDADA',
    psi: '42 PSI (2.9 BAR)',
    valveType: 'PRESTA / SCHRADER OK',
    leakRate: '0.0 PSI/min (SEM VAZAMENTO)',
    tireCondition: 'BANDA DE RODAGEM OK',
    seal: 'VEDAÇÃO HERMÉTICA 100%'
  });

  const runDiagnostic = () => {
    soundFX.playClick();
    setTesting(true);

    setTimeout(() => {
      soundFX.playSuccess();
      setTesting(false);
      const randomPSI = 40 + Math.floor(Math.random() * 15);
      const barVal = (randomPSI * 0.0689476).toFixed(1);
      setResults({
        status: 'PNEU TOTALMENTE CALIBRADO',
        psi: `${randomPSI} PSI (${barVal} BAR)`,
        valveType: 'VÁLVULA DETECTADA',
        leakRate: '0.00 PSI/min (PERFEITO)',
        tireCondition: 'PRESSÃO IDEAL ATINGIDA',
        seal: 'TRAVA DA VÁLVULA APERTADA'
      });
    }, 1500);
  };

  return (
    <div className="cyber-panel p-4 flex flex-col gap-3 relative">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
        <div className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-cyan-400 glow-cyan" />
          <h2 className="text-sm font-bold tracking-wider text-cyan-400">MANÔMETRO E DIAGNÓSTICO DO PNEU</h2>
        </div>

        <button
          onClick={runDiagnostic}
          disabled={testing}
          className="cyber-btn cyber-btn-green text-xs py-1 px-2.5 flex items-center gap-1"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
          <span>{testing ? 'MEDINDO...' : 'TESTAR PRESSÃO'}</span>
        </button>
      </div>

      {/* Speed & Pressure Status Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs">
        <div className="bg-slate-950/60 p-2.5 rounded border border-cyan-500/20 flex flex-col gap-1">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Gauge className="w-3 h-3 text-emerald-400" /> PRESSÃO ATUAL:
          </span>
          <span className="text-emerald-400 font-bold text-[11px] glow-green">{results.psi}</span>
        </div>

        <div className="bg-slate-950/60 p-2.5 rounded border border-cyan-500/20 flex flex-col gap-1">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Disc className="w-3 h-3 text-cyan-400" /> TIPO DE VÁLVULA:
          </span>
          <span className="text-cyan-300 font-bold text-[11px] truncate">{results.valveType}</span>
        </div>

        <div className="bg-slate-950/60 p-2.5 rounded border border-cyan-500/20 flex flex-col gap-1 col-span-2 sm:col-span-1">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Activity className="w-3 h-3 text-amber-400" /> TAXA DE VAZAMENTO:
          </span>
          <span className="text-amber-300 font-bold text-[11px] glow-amber">{results.leakRate}</span>
        </div>
      </div>

      {/* Visual Status Indicator Bar */}
      <div className="bg-slate-950/80 p-2.5 rounded border border-cyan-500/30 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 glow-green" />
          <span className="text-slate-300">ESTADO DA CALIBRAGEM:</span>
        </div>
        <span className="text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40">
          {results.status}
        </span>
      </div>
    </div>
  );
}
