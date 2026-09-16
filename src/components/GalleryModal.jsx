import React from 'react';
import { X, Download, Camera, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';
import { soundFX } from '../services/audioFX';

export function GalleryModal({ photos, isOpen, onClose }) {
  if (!isOpen) return null;

  const handlePrint = () => {
    soundFX.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="cyber-panel w-full max-w-3xl max-h-[90vh] flex flex-col p-5 bg-slate-950/90 border border-cyan-500/40 shadow-[0_0_50px_rgba(0,243,255,0.2)]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-cyan-400 glow-cyan" />
            <h2 className="text-base font-bold text-cyan-400 font-heading">RELATÓRIO & REGISTRO FOTOGRÁFICO DE MONTAGEM</h2>
          </div>

          <button 
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="p-1 rounded border border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-500 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {/* Summary Banner */}
          <div className="bg-emerald-950/40 border border-emerald-500/40 p-3 rounded flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-300">CERTIFICADO DE CONEXÃO E MONTAGEM HANDS-FREE COMPLETO</span>
            </div>
            <span className="text-emerald-400 font-bold">{photos.length} CAPTURAS REGISTRADAS</span>
          </div>

          {/* Photo Gallery Grid */}
          {photos.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-800 rounded font-mono text-slate-500 text-xs">
              <Camera className="w-10 h-10 mx-auto mb-2 text-slate-700" />
              <p>Nenhuma foto capturada durante o procedimento.</p>
              <p className="text-[10px] mt-1 text-slate-600">Diga "CAPTURAR" no microfone ou clique no botão da câmera durante o uso.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {photos.map((snap, idx) => (
                <div key={idx} className="bg-slate-900/60 p-2 rounded border border-cyan-500/20 flex flex-col gap-2">
                  <img src={snap} alt={`Snapshot ${idx + 1}`} className="w-full aspect-video object-cover rounded border border-cyan-500/30" />
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="text-cyan-400 font-bold">REGISTRO #{idx + 1}</span>
                    <span className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" /> VERIFICADO
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-cyan-500/30 pt-3 mt-4 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono hidden sm:inline">CYBERDECK WORKSHOP ASSISTANT LOG</span>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="cyber-btn cyber-btn-secondary text-xs py-1.5 px-3"
            >
              <Printer className="w-4 h-4" />
              <span>IMPRIMIR RELATÓRIO</span>
            </button>
            <button
              onClick={() => {
                soundFX.playClick();
                onClose();
              }}
              className="cyber-btn cyber-btn-green text-xs py-1.5 px-3"
            >
              <span>FECHAR</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
