import React, { useState, useEffect } from 'react';
import { X, BarChart3, Database, ShieldCheck, Activity, Calendar, Camera, Wrench, CheckCircle2 } from 'lucide-react';
import { indexedDBService } from '../services/indexedDBService';
import { soundFX } from '../services/audioFX';

export function AnalyticsModal({ isOpen, onClose, photosCount }) {
  const [profiles, setProfiles] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchAnalyticsData();
    }
  }, [isOpen]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const [profilesData, historyData] = await Promise.all([
        indexedDBService.getAllProfiles(),
        indexedDBService.getMaintenanceHistory()
      ]);
      setProfiles(profilesData);
      setLogs(historyData);
    } catch (err) {
      console.error("Erro ao buscar dados do Analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="cyber-panel w-full max-w-4xl bg-slate-900 border border-cyan-500/40 p-5 rounded-lg shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400 glow-cyan" />
            <h2 className="text-base font-bold tracking-wider text-cyan-400 uppercase">
              DASHBOARD ANALYTICS & HISTÓRICO DE OFICINA // INDEXEDDB
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="bg-slate-950/70 p-3.5 rounded border border-cyan-500/30 flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-cyan-400" /> PERFIS REGISTRADOS:
            </span>
            <span className="text-xl font-bold text-cyan-300 glow-cyan">{profiles.length}</span>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded border border-emerald-500/30 flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> SESSÕES CONCLUÍDAS:
            </span>
            <span className="text-xl font-bold text-emerald-400 glow-green">{logs.length + 1}</span>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded border border-amber-500/30 flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Camera className="w-3.5 h-3.5 text-amber-400" /> REGISTROS DE FOTOS:
            </span>
            <span className="text-xl font-bold text-amber-300 glow-amber">{photosCount || 0}</span>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded border border-purple-500/30 flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-purple-400" /> DISPONIBILIDADE:
            </span>
            <span className="text-xl font-bold text-purple-300">100% OFFLINE</span>
          </div>
        </div>

        {/* Procedure Distribution Bar Chart Simulation */}
        <div className="bg-slate-950/80 p-4 rounded border border-cyan-500/20 flex flex-col gap-3 font-mono text-xs">
          <div className="text-slate-300 font-bold flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>ESTATÍSTICAS DE MANUTENÇÃO POR CATEGORIA</span>
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>CICLISMO / BICICLETAS (Pneus, Freios, Corrente)</span>
                <span className="text-emerald-400 font-bold">78%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>HARDWARE / ELETRÔNICOS (SSD, Placas, Notebooks)</span>
                <span className="text-cyan-400 font-bold">22%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: '22%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Historical Logs List */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-bold tracking-wider text-slate-300 uppercase font-mono flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            HISTÓRICO DE ATIVIDADES SALVAS NO INDEXEDDB
          </h3>

          {loading ? (
            <div className="text-center py-6 font-mono text-xs text-cyan-400 animate-pulse">
              CARREGANDO HISTÓRICO...
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-6 font-mono text-xs text-slate-500 border border-dashed border-slate-800 rounded">
              Sessão atual ativa. Novas manutenções serão registradas no banco local.
            </div>
          ) : (
            <div className="flex flex-col gap-2 font-mono text-xs max-h-48 overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id} className="p-3 bg-slate-950/60 rounded border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-emerald-400 font-bold">{log.procedureTitle || 'Manutenção de Oficina'}</span>
                    <div className="text-[10px] text-slate-400">{new Date(log.date).toLocaleString('pt-BR')}</div>
                  </div>
                  <span className="text-[10px] bg-emerald-950 border border-emerald-500/40 text-emerald-300 px-2 py-0.5 rounded font-bold">
                    CONCLUÍDO
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 pt-3 flex justify-end">
          <button
            onClick={onClose}
            className="cyber-btn cyber-btn-green text-xs py-1.5 px-4"
          >
            FECHAR ANALYTICS
          </button>
        </div>

      </div>
    </div>
  );
}
