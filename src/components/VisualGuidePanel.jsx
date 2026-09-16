import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Film, Sparkles } from 'lucide-react';
import { soundFX } from '../services/audioFX';

export function VisualGuidePanel({ stepId, stepTitle }) {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [frameTime, setFrameTime] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let t = 0;

    const renderStepAnimation = () => {
      if (isPlaying) {
        t += 0.03 * playbackSpeed;
        setFrameTime(Math.floor((t % 10) * 10) / 10);
      }

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Deep Sleek Neutral Background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      // Render Clean Procedural Video Animations
      if (stepId === 1) {
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2 + 60, 110, Math.PI, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 18;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2 + 60, 125, Math.PI, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(w / 2 - 5, h / 2 - 40, 10, 40);

        const capY = h / 2 - 60 - Math.abs(Math.sin(t * 2)) * 30;
        ctx.fillStyle = '#10b981';
        ctx.fillRect(w / 2 - 7, capY, 14, 14);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '600 13px Outfit, sans-serif';
        ctx.fillText('Vídeo Demonstrativo: Remoção da Tampa da Válvula', 24, 32);
      }
      else if (stepId === 2) {
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(w / 2 - 6, h / 2 - 40, 12, 80);

        const nutAngle = t * 4;
        ctx.save();
        ctx.translate(w / 2, h / 2 - 40);
        ctx.rotate(nutAngle);
        ctx.fillStyle = '#10b981';
        ctx.fillRect(-10, -5, 20, 10);
        ctx.restore();

        if (Math.floor(t * 5) % 2 === 0) {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(w / 2, h / 2 - 50, 15 + (t % 1) * 20, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.fillStyle = '#f8fafc';
        ctx.font = '600 13px Outfit, sans-serif';
        ctx.fillText('Vídeo Demonstrativo: Desrosquear Porca Presta', 24, 32);
      }
      else if (stepId === 3) {
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(w / 2 - 5, h / 2, 10, 60);

        const pumpY = h / 2 - 70 + Math.min(40, (t * 20) % 60);
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(w / 2 - 18, pumpY, 36, 45);

        const leverAngle = Math.min(Math.PI / 2, (t % 3) * (Math.PI / 2));
        ctx.save();
        ctx.translate(w / 2 + 14, pumpY + 14);
        ctx.rotate(-leverAngle);
        ctx.fillStyle = '#10b981';
        ctx.fillRect(0, -3, 26, 6);
        ctx.restore();

        ctx.fillStyle = '#f8fafc';
        ctx.font = '600 13px Outfit, sans-serif';
        ctx.fillText('Vídeo Demonstrativo: Encaixe do Bico e Trava', 24, 32);
      }
      else if (stepId === 4) {
        const handleY = h / 2 - 60 + Math.sin(t * 4) * 35;
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(w / 2 - 50, handleY, 100, 10);
        ctx.fillRect(w / 2 - 5, handleY + 10, 10, 70);

        const psi = Math.round(20 + Math.abs(Math.sin(t * 0.5)) * 30);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(w - 90, 80, 36, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#10b981';
        ctx.font = '600 16px Outfit, sans-serif';
        ctx.fillText(`${psi} PSI`, w - 90, 85);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '600 13px Outfit, sans-serif';
        ctx.fillText('Vídeo Demonstrativo: Bombeamento e Calibragem', 24, 32);
      }
      else if (stepId === 5) {
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(w / 2 - 5, h / 2 - 20, 10, 60);

        const releaseY = h / 2 - 60 - (t % 2) * 40;
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(w / 2 - 16, releaseY, 32, 38);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '600 13px Outfit, sans-serif';
        ctx.fillText('Vídeo Demonstrativo: Remoção do Bico e Fechamento', 24, 32);
      }
      else {
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 75, 0, Math.PI * 2);
        ctx.stroke();

        const thumbX = w / 2 - 75 + Math.sin(t * 3) * 6;
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(thumbX, h / 2, 16, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#10b981';
        ctx.font = '600 13px Outfit, sans-serif';
        ctx.fillText('Vídeo Demonstrativo: Teste Tátil Concluído', 24, 32);
      }

      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText(`00:0${stepId}:${frameTime.toFixed(1)}s`, 24, h - 16);

      animId = requestAnimationFrame(renderStepAnimation);
    };

    renderStepAnimation();
    return () => cancelAnimationFrame(animId);
  }, [stepId, isPlaying, playbackSpeed]);

  const togglePlay = () => {
    soundFX.playClick();
    setIsPlaying(!isPlaying);
  };

  const restartVideo = () => {
    soundFX.playClick();
    setFrameTime(0);
    setIsPlaying(true);
  };

  return (
    <div className="cyber-panel p-5 flex flex-col gap-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-semibold text-slate-200 font-heading">Vídeo Demonstrativo Visual</h2>
        </div>

        <button
          onClick={() => {
            soundFX.playClick();
            setPlaybackSpeed(prev => (prev === 1 ? 0.5 : prev === 0.5 ? 2 : 1));
          }}
          className="px-2.5 py-1 rounded-lg text-xs font-medium border border-white/10 text-slate-300 hover:bg-slate-800 transition-all"
        >
          Velocidade: {playbackSpeed}x
        </button>
      </div>

      {/* Video Viewport Screen */}
      <div className="relative w-full aspect-video bg-slate-900 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center">
        <canvas 
          ref={canvasRef} 
          width={640} 
          height={360} 
          className="w-full h-full object-cover"
        />

        {/* Video Player Controls */}
        <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={togglePlay}
              className="p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-all"
              title={isPlaying ? "Pausar Vídeo" : "Reproduzir Vídeo"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            <button 
              onClick={restartVideo}
              className="p-1.5 rounded-lg border border-white/5 text-slate-400 hover:text-white transition-all"
              title="Reiniciar Vídeo"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <span className="text-xs font-medium text-slate-200 ml-2 truncate">
              Passo 0{stepId}: {stepTitle}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Animação HD</span>
          </div>
        </div>
      </div>
    </div>
  );
}
