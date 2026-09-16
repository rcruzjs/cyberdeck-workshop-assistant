import React, { useState } from 'react';
import { Video, X, ExternalLink, Play, RefreshCw, AlertCircle } from 'lucide-react';
import { soundFX } from '../services/audioFX';

export function YouTubePlayerPanel({ youtubeVideoId, youtubeTitle, onClose }) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [playStarted, setPlayStarted] = useState(true);

  if (!youtubeVideoId) return null;

  const embedUrl = `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`;

  return (
    <div className={`cyber-panel p-4 flex flex-col gap-3 transition-all duration-300 border-red-500/40 shadow-xl ${
      isMinimized ? 'h-14 overflow-hidden' : ''
    }`}>
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-red-500/20 border border-red-500/40 text-red-500 flex items-center justify-center shrink-0">
            <Video className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-xs font-semibold text-slate-100 font-heading truncate max-w-[280px]">
            {youtubeTitle || "Vídeo Tutorial Recomendado pela IA"}
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          {/* External Link to YouTube */}
          <a
            href={`https://www.youtube.com/watch?v=${youtubeVideoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-1 rounded bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all text-[11px] font-medium flex items-center gap-1"
            title="Abrir no YouTube"
          >
            <span>YouTube</span>
            <ExternalLink className="w-3 h-3" />
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

      {/* Embedded YouTube Video Container */}
      {!isMinimized && (
        <div className="relative w-full aspect-video rounded-xl border border-white/10 overflow-hidden bg-slate-950 shadow-inner flex items-center justify-center">
          {iframeError ? (
            <div className="p-6 text-center flex flex-col items-center justify-center gap-2">
              <AlertCircle className="w-8 h-8 text-amber-400 mb-1" />
              <p className="text-xs font-medium text-slate-200">Este vídeo possui restrição de incorporação direta no navegador.</p>
              <a
                href={`https://www.youtube.com/watch?v=${youtubeVideoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-btn cyber-btn-green text-xs py-1.5 px-3 mt-1"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Assistir no YouTube</span>
              </a>
            </div>
          ) : (
            <iframe
              key={youtubeVideoId}
              src={embedUrl}
              title={youtubeTitle || "Tutorial YouTube"}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onError={() => setIframeError(true)}
            />
          )}
        </div>
      )}
    </div>
  );
}
