import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Tv, Film, Maximize2, Sparkles, Volume2 } from 'lucide-react';
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

      // Cyberdeck Grid Background
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(0, 243, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Render Animated Procedural Video for each step
      if (stepId === 1) {
        // Step 1: Wheel Valve Identification Video
        // Draw Wheel Rim
        ctx.strokeStyle = '#00f3ff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2 + 60, 110, Math.PI, Math.PI * 2);
        ctx.stroke();

        // Tire Outer Rubber
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 20;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2 + 60, 125, Math.PI, Math.PI * 2);
        ctx.stroke();

        // Valve Stem at top of rim
        ctx.fillStyle = '#ffb700';
        ctx.fillRect(w / 2 - 6, h / 2 - 40, 12, 40);

        // Animated Cap Removal
        const capY = h / 2 - 60 - Math.abs(Math.sin(t * 2)) * 30;
        ctx.fillStyle = '#00ff66';
        ctx.fillRect(w / 2 - 8, capY, 16, 15);

        ctx.fillStyle = '#00f3ff';
        ctx.font = '13px Orbitron';
        ctx.fillText('VÍDEO: REMOÇÃO DA TAMPA E IDENTIFICAÇÃO DA VÁLVULA', 20, 30);
      }
      else if (stepId === 2) {
        // Step 2: Unscrewing Presta Nut Video
        ctx.fillStyle = '#ffb700';
        ctx.fillRect(w / 2 - 8, h / 2 - 40, 16, 80);

        // Presta Top Nut
        const nutAngle = t * 4;
        ctx.save();
        ctx.translate(w / 2, h / 2 - 40);
        ctx.rotate(nutAngle);
        ctx.fillStyle = '#00ff66';
        ctx.fillRect(-12, -6, 24, 12);
        ctx.restore();

        // Air Hiss Particles
        if (Math.floor(t * 5) % 2 === 0) {
          ctx.strokeStyle = '#00f3ff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(w / 2, h / 2 - 50, 15 + (t % 1) * 20, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.fillStyle = '#00f3ff';
        ctx.font = '13px Orbitron';
        ctx.fillText('VÍDEO: DESROSQUEAR PORCA PRESTA E PRESSIONAR PINO', 20, 30);
      }
      else if (stepId === 3) {
        // Step 3: Attaching Pump Nozzle & Locking Lever Video
        // Valve
        ctx.fillStyle = '#ffb700';
        ctx.fillRect(w / 2 - 6, h / 2, 12, 60);

        // Descending Pump Head
        const pumpY = h / 2 - 70 + Math.min(40, (t * 20) % 60);
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(w / 2 - 20, pumpY, 40, 50);

        // Lever Locking Action
        const leverAngle = Math.min(Math.PI / 2, (t % 3) * (Math.PI / 2));
        ctx.save();
        ctx.translate(w / 2 + 15, pumpY + 15);
        ctx.rotate(-leverAngle);
        ctx.fillStyle = '#00ff66';
        ctx.fillRect(0, -4, 30, 8);
        ctx.restore();

        ctx.fillStyle = '#00f3ff';
        ctx.font = '13px Orbitron';
        ctx.fillText('VÍDEO: ENCAIXE E TRAVA DA ALAVANCA DO BICO DA BOMBA', 20, 30);
      }
      else if (stepId === 4) {
        // Step 4: Air Pumping & PSI Gauge Rising Video
        // Pump Handle Animation
        const handleY = h / 2 - 60 + Math.sin(t * 4) * 35;
        ctx.fillStyle = '#00f3ff';
        ctx.fillRect(w / 2 - 60, handleY, 120, 12);
        ctx.fillRect(w / 2 - 6, handleY + 12, 12, 70);

        // Gauge Dial Arc
        const psi = Math.round(20 + Math.abs(Math.sin(t * 0.5)) * 30);
        ctx.strokeStyle = '#00ff66';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(w - 90, 80, 40, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#00ff66';
        ctx.font = '16px Orbitron';
        ctx.fillText(`${psi} PSI`, w - 90, 85);

        ctx.fillStyle = '#00f3ff';
        ctx.font = '13px Orbitron';
        ctx.fillText('VÍDEO: BOMBEAMENTO E MONITORAMENTO DE PRESSÃO', 20, 30);
      }
      else if (stepId === 5) {
        // Step 5: Quick Detach & Tightening Video
        ctx.fillStyle = '#ffb700';
        ctx.fillRect(w / 2 - 6, h / 2 - 20, 12, 60);

        // Quick Release Motion
        const releaseY = h / 2 - 60 - (t % 2) * 40;
        ctx.fillStyle = '#00f3ff';
        ctx.fillRect(w / 2 - 18, releaseY, 36, 40);

        ctx.fillStyle = '#00f3ff';
        ctx.font = '13px Orbitron';
        ctx.fillText('VÍDEO: REMOÇÃO RÁPIDA E FECHAMENTO DA VÁLVULA', 20, 30);
      }
      else {
        // Step 6: Tire Firmness Check Video
        ctx.strokeStyle = '#00ff66';
        ctx.lineWidth = 16;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 80, 0, Math.PI * 2);
        ctx.stroke();

        // Squeezing thumb
        const thumbX = w / 2 - 80 + Math.sin(t * 3) * 8;
        ctx.fillStyle = '#ffb700';
        ctx.beginPath();
        ctx.arc(thumbX, h / 2, 18, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#00ff66';
        ctx.font = '13px Orbitron';
        ctx.fillText('VÍDEO: TESTE TÁTIL DE FIRMEZA E CONCLUÍDO!', 20, 30);
      }

      // HUD Overlay Timecode & Controls
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px Share Tech Mono';
      ctx.fillText(`TIMECODE: 00:0${stepId}:${frameTime.toFixed(1)}s`, 20, h - 15);
      ctx.fillText(`STATUS: VÍDEO EXPLICATIVO EM LOOP (${playbackSpeed}x)`, w - 240, h - 15);

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
    <div className="cyber-panel p-4 flex flex-col gap-3 relative">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
        <div className="flex items-center gap-2">
          <Film className="w-5 h-5 text-cyan-400 glow-cyan" />
          <h2 className="text-sm font-bold tracking-wider text-cyan-400">VÍDEO EXPLICATIVO DA ETAPA (DESENHO ANAMÓRFICO AR)</h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Speed Selector */}
          <button
            onClick={() => {
              soundFX.playClick();
              setPlaybackSpeed(prev => (prev === 1 ? 0.5 : prev === 0.5 ? 2 : 1));
            }}
            className="px-2 py-1 rounded text-xs font-mono border border-slate-700 text-slate-300 hover:border-cyan-400 transition-all"
          >
            VELOCIDADE: {playbackSpeed}x
          </button>
        </div>
      </div>

      {/* Video Viewport Screen */}
      <div className="relative w-full aspect-video bg-slate-950 rounded border border-cyan-500/30 overflow-hidden flex items-center justify-center">
        <canvas 
          ref={canvasRef} 
          width={640} 
          height={360} 
          className="w-full h-full object-cover"
        />

        {/* Video Player Control Bar Overlay */}
        <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur-sm px-3 py-2 rounded border border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={togglePlay}
              className="p-1.5 rounded bg-cyan-950 border border-cyan-400 text-cyan-300 hover:bg-cyan-900 transition-all"
              title={isPlaying ? "Pausar Vídeo" : "Reproduzir Vídeo"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button 
              onClick={restartVideo}
              className="p-1.5 rounded border border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-500 transition-all"
              title="Reiniciar Vídeo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono text-cyan-300 ml-2 truncate">
              VÍDEO PASSO 0{stepId}: {stepTitle}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden sm:inline">ANIMAÇÃO TÉCNICA HD</span>
          </div>
        </div>
      </div>
    </div>
  );
}
