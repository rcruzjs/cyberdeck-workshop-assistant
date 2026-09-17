import React, { useState, useEffect } from 'react';
import { X, Bike, Cpu, Plus, Trash2, Check, ShieldCheck, Database } from 'lucide-react';
import { indexedDBService } from '../services/indexedDBService';
import { soundFX } from '../services/audioFX';

export function EquipmentProfileModal({ isOpen, onClose, activeProfileId, onSelectProfile }) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  
  // New profile form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState('BIKE');
  const [targetPsi, setTargetPsi] = useState(30);
  const [valveType, setValveType] = useState('Presta');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadProfiles();
    }
  }, [isOpen]);

  const loadProfiles = async () => {
    setLoading(true);
    try {
      const data = await indexedDBService.getAllProfiles();
      setProfiles(data);
    } catch (err) {
      console.error('Erro ao carregar perfis do IndexedDB:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (profile) => {
    soundFX.playClick();
    onSelectProfile(profile);
    onClose();
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    soundFX.playAlert();
    try {
      await indexedDBService.deleteProfile(id);
      loadProfiles();
    } catch (err) {
      console.error('Erro ao deletar perfil:', err);
    }
  };

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    soundFX.playSuccess();
    const barVal = parseFloat((targetPsi * 0.0689476).toFixed(1));
    const newProfile = {
      name,
      category,
      targetPsi: Number(targetPsi),
      targetBar: barVal,
      valveType,
      notes: notes || 'Perfil customizado salvo no IndexedDB'
    };

    try {
      const saved = await indexedDBService.saveProfile(newProfile);
      setProfiles(prev => [...prev, saved]);
      onSelectProfile(saved);
      setShowNewForm(false);
      setName('');
      setNotes('');
    } catch (err) {
      console.error('Erro ao salvar novo perfil:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="cyber-panel w-full max-w-2xl bg-slate-900 border border-cyan-500/30 p-5 rounded-lg shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400 glow-cyan" />
            <h2 className="text-base font-bold tracking-wider text-cyan-400 uppercase">
              PERFIS DE EQUIPAMENTOS // INDEXEDDB
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Profiles List */}
        {!showNewForm ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">
                Selecione o equipamento para ajustar os parâmetros de pressão e componentes:
              </span>

              <button
                onClick={() => {
                  soundFX.playClick();
                  setShowNewForm(true);
                }}
                className="cyber-btn cyber-btn-green text-xs py-1 px-3 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>NOVO PERFIL</span>
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8 font-mono text-sm text-cyan-400 animate-pulse">
                CARREGANDO PERFIS DO BANCO LOCAL...
              </div>
            ) : profiles.length === 0 ? (
              <div className="text-center py-8 font-mono text-sm text-slate-500 border border-dashed border-slate-700 rounded">
                Nenhum perfil salvo no IndexedDB. Clique em "NOVO PERFIL" para criar.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {profiles.map((p) => {
                  const isSelected = activeProfileId === p.id;

                  return (
                    <div
                      key={p.id}
                      onClick={() => handleSelect(p)}
                      className={`p-3.5 rounded border transition cursor-pointer flex flex-col gap-2 relative ${
                        isSelected
                          ? 'bg-cyan-950/40 border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                          : 'bg-slate-950/60 border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {p.category === 'BIKE' ? (
                            <Bike className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Cpu className="w-4 h-4 text-cyan-400" />
                          )}
                          <span className="font-bold text-sm text-slate-100">{p.name}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          {isSelected && (
                            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 border border-emerald-500/40 px-1.5 py-0.5 rounded flex items-center gap-1">
                              <Check className="w-3 h-3" /> ATIVO
                            </span>
                          )}

                          <button
                            onClick={(e) => handleDelete(e, p.id)}
                            className="p-1 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded transition"
                            title="Excluir Perfil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-400 bg-slate-900/50 p-2 rounded">
                        <div>
                          <span className="text-[10px] block text-slate-500">PRESSÃO ALVO:</span>
                          <span className="text-emerald-400 font-bold">
                            {p.targetPsi > 0 ? `${p.targetPsi} PSI (${p.targetBar} BAR)` : 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] block text-slate-500">VÁLVULA / FIXAÇÃO:</span>
                          <span className="text-cyan-300 font-bold">{p.valveType}</span>
                        </div>
                      </div>

                      {p.notes && (
                        <p className="text-[11px] text-slate-400 italic line-clamp-1">
                          "{p.notes}"
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Form for creating new profile */
          <form onSubmit={handleCreateProfile} className="flex flex-col gap-4 font-mono text-xs">
            <div className="text-xs font-mono text-cyan-400 border-b border-cyan-500/20 pb-1">
              CRIAR NOVO PERFIL DE EQUIPAMENTO // INDEXEDDB
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-slate-400">NOME DO EQUIPAMENTO / BICICLETA:</label>
              <input
                type="text"
                required
                placeholder="Ex: MTB Trek Fuel EX 29"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 focus:border-cyan-400 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-slate-400">CATEGORIA:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 focus:border-cyan-400 outline-none"
                >
                  <option value="BIKE">Bicicleta / Ciclismo</option>
                  <option value="HARDWARE">Hardware / Eletrônica</option>
                  <option value="AUTOMOTIVE">Automotivo / Geral</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-400">TIPO DE VÁLVULA / COMPONENTE:</label>
                <select
                  value={valveType}
                  onChange={(e) => setValveType(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 focus:border-cyan-400 outline-none"
                >
                  <option value="Presta">Presta (Fina / Bico Fino)</option>
                  <option value="Schrader">Schrader (Grossa / Auto)</option>
                  <option value="Dunlop">Dunlop</option>
                  <option value="M.2 NVMe">M.2 NVMe SSD</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-slate-400">PRESSÃO IDEAL (PSI):</label>
                <input
                  type="number"
                  min="0"
                  max="150"
                  value={targetPsi}
                  onChange={(e) => setTargetPsi(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 focus:border-cyan-400 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-400">PRESSÃO EM BAR (CALCULADO):</label>
                <input
                  type="text"
                  disabled
                  value={`${(targetPsi * 0.0689476).toFixed(1)} BAR`}
                  className="bg-slate-950/60 border border-slate-800 rounded p-2 text-emerald-400 font-bold"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-slate-400">OBSERVAÇÕES DE MANUTENÇÃO:</label>
              <textarea
                rows="2"
                placeholder="Ex: Pneu tubeless selante novo 120ml, aperto de pino de segurança"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 focus:border-cyan-400 outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowNewForm(false)}
                className="cyber-btn cyber-btn-secondary text-xs"
              >
                CANCELAR
              </button>

              <button
                type="submit"
                className="cyber-btn cyber-btn-green text-xs flex items-center gap-1"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>SALVAR NO INDEXEDDB</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
