import React, { useState } from 'react';
import { Bot, Send, Mic, Volume2, VolumeX, Sparkles, HelpCircle, Loader2, MessageSquare } from 'lucide-react';
import { askCyberdeckAI } from '../services/aiLLMService';
import { speechService } from '../services/speechService';
import { soundFX } from '../services/audioFX';

export function AIChatPanel({ isMicActive }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Olá! Sou o Assistente IA Especialista de Oficina Cyberdeck. Pode me perguntar qualquer dúvida sobre calibragem de pneus (tubulares, tubeless, clincher), tipos de bombas ou ferramentas de bicicleta!'
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

      // Speak response via TTS
      speechService.speak(aiResponse, () => setIsSpeakingAI(false));
      setIsSpeakingAI(true);
    } catch (err) {
      setIsThinking(false);
      setMessages(prev => [...prev, { sender: 'ai', text: 'Desculpe, ocorreu uma falha ao consultar a base de conhecimento de IA.' }]);
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
    <div className="cyber-panel p-4 flex flex-col gap-3 relative">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-purple-400 glow-cyan animate-pulse" />
          <h2 className="text-sm font-bold tracking-wider text-purple-300">ASSISTENTE IA ESPECIALISTA DE BICICLETAS (LLM)</h2>
        </div>

        {isSpeakingAI && (
          <button
            onClick={stopAISpeech}
            className="px-2 py-1 rounded text-xs font-mono bg-purple-950 border border-purple-500 text-purple-300 flex items-center gap-1 animate-pulse"
          >
            <VolumeX className="w-3.5 h-3.5" />
            <span>PARAR FALA IA</span>
          </button>
        )}
      </div>

      {/* Chat Messages Container */}
      <div className="bg-slate-950/80 p-3 rounded border border-purple-500/30 min-h-[220px] max-h-[300px] overflow-y-auto flex flex-col gap-3 font-mono text-xs">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-6 h-6 rounded-full bg-purple-950 border border-purple-500 text-purple-400 flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`p-3 rounded max-w-[85%] leading-relaxed whitespace-pre-line ${
                msg.sender === 'user'
                  ? 'bg-cyan-950/80 border border-cyan-500/40 text-cyan-200'
                  : 'bg-purple-950/60 border border-purple-500/40 text-slate-200'
              }`}
            >
              {msg.text}
            </div>

            {msg.sender === 'user' && (
              <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500 text-cyan-400 flex items-center justify-center shrink-0">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {/* AI Thinking Indicator */}
        {isThinking && (
          <div className="flex items-center gap-2 text-purple-400 text-xs py-2">
            <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
            <span className="animate-pulse">IA Cyberdeck consultando base de mecânica...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts Suggestion Pills */}
      <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
        <span className="text-slate-400 flex items-center gap-1 mr-1">
          <HelpCircle className="w-3 h-3 text-cyan-400" /> SUGESTÕES:
        </span>

        <button
          onClick={() => handleQuickPrompt("Qual a calibragem dos pneus tubulares?")}
          className="px-2 py-1 rounded bg-slate-900 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-950 hover:border-cyan-400 transition-all"
        >
          Pneus Tubulares (PSI)
        </button>

        <button
          onClick={() => handleQuickPrompt("Quais tipos de bomba devo usar?")}
          className="px-2 py-1 rounded bg-slate-900 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-950 hover:border-cyan-400 transition-all"
        >
          Tipos de Bombas
        </button>

        <button
          onClick={() => handleQuickPrompt("Qual a calibragem para pneu Tubeless?")}
          className="px-2 py-1 rounded bg-slate-900 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-950 hover:border-cyan-400 transition-all"
        >
          Pressão Tubeless
        </button>

        <button
          onClick={() => handleQuickPrompt("Diferença da válvula Presta e Schrader")}
          className="px-2 py-1 rounded bg-slate-900 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-950 hover:border-cyan-400 transition-all"
        >
          Presta vs Schrader
        </button>
      </div>

      {/* Input Box & Action Buttons */}
      <div className="flex items-center gap-2 mt-1">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Pergunte sobre bombas, pneus tubulares, selante, válvulas..."
          className="flex-1 bg-slate-950 border border-purple-500/40 rounded px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-purple-400"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={isThinking || !inputQuery.trim()}
          className="cyber-btn cyber-btn-green py-2 px-3 text-xs flex items-center gap-1"
        >
          <Send className="w-3.5 h-3.5" />
          <span>ENVIAR</span>
        </button>
      </div>
    </div>
  );
}
