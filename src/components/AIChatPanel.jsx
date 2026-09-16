import React, { useState } from 'react';
import { Bot, Send, VolumeX, HelpCircle, Loader2, User } from 'lucide-react';
import { askCyberdeckAI } from '../services/aiLLMService';
import { speechService } from '../services/speechService';
import { soundFX } from '../services/audioFX';

export function AIChatPanel({ isMicActive }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Olá! Sou o Assistente IA Especialista de Oficina. Faça qualquer pergunta sobre calibragem de pneus (tubulares, tubeless, clincher), bombas de ar ou manutenção!'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeakingAI, setIsSpeakingAI] = useState(false);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query || query.trim() === '') return;

    soundFX.playClick();
    const userMsg = { sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    try {
      const aiResponse = await askCyberdeckAI(query);
      soundFX.playSuccess();
      const aiMsg = { sender: 'ai', text: aiResponse };
      setMessages(prev => [...prev, aiMsg]);
      setIsThinking(false);

      speechService.speak(aiResponse, () => setIsSpeakingAI(false));
      setIsSpeakingAI(true);
    } catch (err) {
      setIsThinking(false);
      setMessages(prev => [...prev, { sender: 'ai', text: 'Desculpe, ocorreu uma falha ao consultar a base de IA.' }]);
    }
  };

  const handleQuickPrompt = (promptText) => {
    handleSendMessage(promptText);
  };

  const stopAISpeech = () => {
    speechService.stopSpeaking();
    setIsSpeakingAI(false);
  };

  return (
    <div className="cyber-panel p-5 flex flex-col gap-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-semibold text-slate-200 font-heading">Consultor IA de Mecânica</h2>
        </div>

        {isSpeakingAI && (
          <button
            onClick={stopAISpeech}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 flex items-center gap-1.5 animate-pulse"
          >
            <VolumeX className="w-3.5 h-3.5" />
            <span>Parar Fala IA</span>
          </button>
        )}
      </div>

      {/* Chat Messages */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 min-h-[220px] max-h-[300px] overflow-y-auto flex flex-col gap-3 font-sans text-xs">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`p-3.5 rounded-xl max-w-[85%] leading-relaxed whitespace-pre-line text-xs ${
                msg.sender === 'user'
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-200'
                  : 'bg-slate-800/80 border border-white/5 text-slate-200'
              }`}
            >
              {msg.text}
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2 text-indigo-400 text-xs py-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="animate-pulse">Consultando especialista IA...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-slate-400 text-xs mr-1 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-emerald-400" /> Sugestões:
        </span>

        <button
          onClick={() => handleQuickPrompt("Qual a calibragem dos pneus tubulares?")}
          className="px-2.5 py-1 rounded-lg bg-slate-800/60 border border-white/5 text-slate-300 hover:bg-slate-800 hover:text-white transition-all text-xs"
        >
          Pneus Tubulares (PSI)
        </button>

        <button
          onClick={() => handleQuickPrompt("Quais tipos de bomba devo usar?")}
          className="px-2.5 py-1 rounded-lg bg-slate-800/60 border border-white/5 text-slate-300 hover:bg-slate-800 hover:text-white transition-all text-xs"
        >
          Tipos de Bombas
        </button>

        <button
          onClick={() => handleQuickPrompt("Qual a calibragem para pneu Tubeless?")}
          className="px-2.5 py-1 rounded-lg bg-slate-800/60 border border-white/5 text-slate-300 hover:bg-slate-800 hover:text-white transition-all text-xs"
        >
          Pressão Tubeless
        </button>
      </div>

      {/* Input Box */}
      <div className="flex items-center gap-2 mt-1">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Pergunte sobre bombas, pneus tubulares, selante, válvulas..."
          className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={isThinking || !inputQuery.trim()}
          className="cyber-btn cyber-btn-green py-2.5 px-4 text-xs flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Enviar</span>
        </button>
      </div>
    </div>
  );
}
