import React from 'react';
import { X, Printer, ShieldCheck, FileText, Wrench, CheckCircle, Calendar, User, Disc } from 'lucide-react';
import { soundFX } from '../services/audioFX';

export function TechnicalReportModal({ 
  isOpen, 
  onClose, 
  activeProcedure, 
  activeProfile, 
  photos, 
  currentStepIndex 
}) {
  if (!isOpen) return null;

  const handlePrint = () => {
    soundFX.playClick();
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="cyber-panel w-full max-w-4xl bg-slate-900 border border-emerald-500/40 p-6 rounded-lg shadow-2xl flex flex-col gap-5 max-h-[95vh] overflow-y-auto print:max-h-none print:shadow-none print:border-none print:p-0 print:bg-white print:text-slate-900">
        
        {/* Modal Actions Bar (Hidden on print) */}
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400 glow-green" />
            <h2 className="text-base font-bold tracking-wider text-emerald-400 uppercase">
              RELATÓRIO TÉCNICO OFICIAL DE MANUTENÇÃO // AUDITORIA PDF
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="cyber-btn cyber-btn-green text-xs py-1.5 px-3 flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>IMPRIMIR / SALVAR PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div id="printable-report" className="flex flex-col gap-6 text-slate-100 print:text-slate-900 font-sans p-2">
          
          {/* Document Header */}
          <div className="flex flex-wrap items-center justify-between border-b-2 border-emerald-500/50 pb-4 gap-4 print:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center print:border-slate-800">
                <Disc className="w-6 h-6 text-emerald-400 print:text-slate-900" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white print:text-slate-900 uppercase">
                  CYBERDECK WORKSHOP // RELATÓRIO TÉCNICO
                </h1>
                <p className="text-xs text-slate-400 print:text-slate-600 font-mono">
                  SISTEMA VIVA-VOZ COM VISÃO COMPUTACIONAL DE PRECISÃO & IA
                </p>
              </div>
            </div>

            <div className="text-right text-xs font-mono text-slate-400 print:text-slate-700">
              <div className="flex items-center justify-end gap-1 font-bold text-emerald-400 print:text-slate-900">
                <ShieldCheck className="w-4 h-4" /> REQUISITO NOMINAL APAGADO
              </div>
              <div>EMISSÃO: {currentDate}</div>
              <div>DOC ID: #CYBER-{Math.floor(100000 + Math.random() * 900000)}</div>
            </div>
          </div>

          {/* Section 1: Equipment & Procedure Meta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-slate-950/70 p-4 rounded border border-white/10 flex flex-col gap-2 print:bg-slate-50 print:border-slate-300">
              <span className="text-emerald-400 font-bold uppercase flex items-center gap-1.5 print:text-slate-900">
                <Wrench className="w-4 h-4" /> DADOS DO PROCEDIMENTO EXECUTADO:
              </span>
              <div><strong className="text-slate-300 print:text-slate-700">CATEGORIA:</strong> {activeProcedure.category}</div>
              <div><strong className="text-slate-300 print:text-slate-700">PROCEDIMENTO:</strong> {activeProcedure.title}</div>
              <div><strong className="text-slate-300 print:text-slate-700">PROGRESSO:</strong> {currentStepIndex + 1} / {activeProcedure.steps.length} Etapas Concluídas</div>
            </div>

            <div className="bg-slate-950/70 p-4 rounded border border-white/10 flex flex-col gap-2 print:bg-slate-50 print:border-slate-300">
              <span className="text-cyan-400 font-bold uppercase flex items-center gap-1.5 print:text-slate-900">
                <ShieldCheck className="w-4 h-4" /> PERFIL DE EQUIPAMENTO (INDEXEDDB):
              </span>
              <div><strong className="text-slate-300 print:text-slate-700">EQUIPAMENTO:</strong> {activeProfile ? activeProfile.name : 'Padrão da Oficina'}</div>
              <div><strong className="text-slate-300 print:text-slate-700">PRESSÃO ALVO:</strong> {activeProfile ? `${activeProfile.targetPsi} PSI (${activeProfile.targetBar} BAR)` : '42 PSI (2.9 BAR)'}</div>
              <div><strong className="text-slate-300 print:text-slate-700">VÁLVULA / FIXAÇÃO:</strong> {activeProfile ? activeProfile.valveType : 'Presta / Schrader'}</div>
            </div>
          </div>

          {/* Section 2: Step Execution Audit List */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-bold tracking-wider text-slate-200 print:text-slate-900 uppercase font-mono flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              REGISTRO DE PASSOS DE MANUTENÇÃO AUDITADOS
            </h3>

            <div className="flex flex-col gap-2 text-xs font-mono">
              {activeProcedure.steps.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex;
                return (
                  <div 
                    key={step.id} 
                    className={`p-3 rounded border flex items-start justify-between gap-3 ${
                      isCompleted 
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200 print:bg-emerald-50 print:border-emerald-200 print:text-slate-900' 
                        : 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-emerald-300 print:text-emerald-800">
                        0{idx + 1}. {step.title}
                      </div>
                      <p className="text-[11px] text-slate-400 print:text-slate-600 mt-1 font-sans">
                        {step.text}
                      </p>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                      isCompleted ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40 print:bg-emerald-200 print:text-emerald-900' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isCompleted ? 'CONCLUÍDO OK' : 'PENDENTE'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Photo Gallery Logs */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-bold tracking-wider text-slate-200 print:text-slate-900 uppercase font-mono">
              EVIDÊNCIAS FOTOGRÁFICAS CAPTURADAS DA SESSÃO ({photos.length})
            </h3>

            {photos.length === 0 ? (
              <p className="text-xs text-slate-500 italic font-mono">Nenhuma captura de foto registrada nesta sessão.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {photos.map((snap, index) => (
                  <div key={index} className="border border-slate-700 rounded p-1 bg-slate-950 print:bg-white print:border-slate-300">
                    <img src={snap.url} alt={`Evidência ${index + 1}`} className="w-full h-24 object-cover rounded" />
                    <div className="text-[10px] font-mono text-slate-400 print:text-slate-600 mt-1 text-center">
                      Foto #{index + 1} • {snap.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 4: Signature & Validation */}
          <div className="mt-6 pt-6 border-t border-slate-700 grid grid-cols-2 gap-8 text-xs font-mono print:border-slate-400">
            <div className="flex flex-col gap-1 text-center">
              <div className="border-b border-slate-500 h-10 print:border-slate-800"></div>
              <span className="text-slate-400 print:text-slate-700 mt-1">ASSINATURA DO TÉCNICO RESPONSÁVEL</span>
            </div>

            <div className="flex flex-col gap-1 text-center">
              <div className="border-b border-slate-500 h-10 print:border-slate-800"></div>
              <span className="text-slate-400 print:text-slate-700 mt-1">VALIDAÇÃO DO CLIENTE / AUDITORIA</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
