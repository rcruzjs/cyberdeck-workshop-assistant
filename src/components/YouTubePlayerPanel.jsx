import React, { useState } from 'react';
import { Video, X, ExternalLink, Play, Tv } from 'lucide-react';
import { soundFX } from '../services/audioFX';

export function YouTubePlayerPanel({ youtubeVideoId, youtubeTitle, onClose }) {
  const [isMinimized, setIsMinimized] = useState(false);

  if (!youtubeVideoId) return null;

  return (
    <div className={`cyber-panel p-4 flex flex-col gap-3 transition-all duration-300 border-red-500/30 ${
      isMinimized ? 'h-14 overflow-hidden' : ''
    }`}>
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 flex items-center justify-center">
            <Video className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-xs font-semibold text-slate-200 font-heading truncate max-w-[280px]">
            {youtubeTitle || "Vídeo Tutorial Recomendado pela IA"}
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          {/* External Link to YouTube */}
          <a
            href={`https://www.youtube.com/watch?v=${youtubeVideoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded text-slate-400 hover:text-red-400 transition-all"
            title="Abrir no YouTube"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Minimize Button */}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded text-slate-400 hover:text-white transition-all text-xs font-mono"
            title={isMinimized ? "Expandir Vídeo" : "Minimizar"}
          >
            {isMinimized ? "▲" : "▼"}
          </button>

          {/* Close Button */}
          {onClose && (
            <button
              onClick={() => {
                soundFX.playClick();
                onClose();
              }}
              className="p-1 rounded text-slate-400 hover:text-rose-400 transition-all"
              title="Fechar Vídeo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Embedded YouTube Player Iframe */}
      {!isMinimized && (
        <div className="relative w-full aspect-video rounded-xl border border-white/10 overflow-hidden bg-slate-900 shadow-md">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}?autoplay=1&rel=0`}
            title={youtubeTitle || "Tutorial YouTube"}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}
