import React, { useRef, useEffect, useState } from 'react';
import { Camera, RefreshCw, Eye, EyeOff, Aperture, CheckCircle2, Sparkles } from 'lucide-react';
import { soundFX } from '../services/audioFX';

export function CameraHUD({ arOverlayType, onCapturePhoto, isMicActive }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const micCanvasRef = useRef(null);
  
  const [stream, setStream] = useState(null);
  const [hasCamera, setHasCamera] = useState(true);
  const [cameraError, setCameraError] = useState(null);
  const [showAROverlay, setShowAROverlay] = useState(true);
  const [flashEffect, setFlashEffect] = useState(false);
  const [lastSnap, setLastSnap] = useState(null);

  // Audio Analyser for Mic Visualizer
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);

  // Start Camera
  const startCamera = async () => {
    setCameraError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setHasCamera(true);
    } catch (err) {
      console.warn("Câmera não encontrada ou acesso negado:", err);
      setHasCamera(false);
      setCameraError("Modo de simulação ativo");
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Setup Microphone Visualizer Spectrum Canvas
  useEffect(() => {
    let micStream = null;

    const setupMicVisualizer = async () => {
      try {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
        analyserRef.current = audioCtxRef.current.createAnalyser();
        analyserRef.current.fftSize = 64;

        const source = audioCtxRef.current.createMediaStreamSource(micStream);
        source.connect(analyserRef.current);

        const canvas = micCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const drawSpectrum = () => {
          animFrameRef.current = requestAnimationFrame(drawSpectrum);
          analyserRef.current.getByteFrequencyData(dataArray);

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const barWidth = (canvas.width / bufferLength) * 1.5;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            const barHeight = (dataArray[i] / 255) * canvas.height;
            ctx.fillStyle = `rgba(16, 185, 129, ${Math.max(0.3, dataArray[i] / 255)})`;
            ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
            x += barWidth;
          }
        };
        drawSpectrum();
      } catch (err) {
        // mic spectrum fallback
      }
    };

    if (isMicActive) {
      setupMicVisualizer();
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
      if (micStream) micStream.getTracks().forEach(t => t.stop());
    };
  }, [isMicActive]);

  // Render Clean AR Overlay graphics
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frameId;

    const drawAR = () => {
      frameId = requestAnimationFrame(drawAR);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!showAROverlay) return;

      const w = canvas.width;
      const h = canvas.height;
      const now = Date.now() * 0.002;

      // Base Reticle Crosshair - Minimalist thin lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 35, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(w / 2 - 45, h / 2);
      ctx.lineTo(w / 2 - 15, h / 2);
      ctx.moveTo(w / 2 + 15, h / 2);
      ctx.lineTo(w / 2 + 45, h / 2);
      ctx.moveTo(w / 2, h / 2 - 45);
      ctx.lineTo(w / 2, h / 2 - 15);
      ctx.moveTo(w / 2, h / 2 + 15);
      ctx.lineTo(w / 2, h / 2 + 45);
      ctx.stroke();

      // Step-Specific AR Overlays
      if (arOverlayType === 'VALVE_SEARCH') {
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2 + 40, 45, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#10b981';
        ctx.font = '500 13px Outfit, sans-serif';
        ctx.fillText('Alvo AR: Enquadrar Válvula', w / 2 - 80, h / 2 - 55);
      } 
      else if (arOverlayType === 'VALVE_UNSCREW') {
        ctx.save();
        ctx.translate(w / 2, h / 2);
        ctx.rotate(now * 2);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 40, 0, Math.PI * 1.5);
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = '#f59e0b';
        ctx.font = '500 13px Outfit, sans-serif';
        ctx.fillText('Desrosquear Porca Presta (Anti-horário)', w / 2 - 110, h / 2 - 60);
      }
      else if (arOverlayType === 'PUMP_ATTACH') {
        const arrowY = h / 2 - 35 + Math.sin(now * 4) * 8;
        ctx.strokeStyle = '#06b6d4';
        ctx.fillStyle = '#06b6d4';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(w / 2, arrowY);
        ctx.lineTo(w / 2, arrowY + 35);
        ctx.lineTo(w / 2 - 12, arrowY + 22);
        ctx.moveTo(w / 2, arrowY + 35);
        ctx.lineTo(w / 2 + 12, arrowY + 22);
        ctx.stroke();

        ctx.font = '500 13px Outfit, sans-serif';
        ctx.fillText('Encaixar Bico da Bomba e Travar Alavanca', w / 2 - 125, h / 2 - 70);
      }
      else if (arOverlayType === 'PSI_GAUGE') {
        const startAngle = Math.PI * 0.85;
        const endAngle = Math.PI * 2.15;
        const currentAngle = startAngle + (endAngle - startAngle) * (0.5 + Math.sin(now) * 0.2);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 60, startAngle, endAngle);
        ctx.stroke();

        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 60, startAngle, currentAngle);
        ctx.stroke();

        const psiVal = Math.round(30 + (currentAngle - startAngle) * 45);
        ctx.fillStyle = '#10b981';
        ctx.font = '600 20px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${psiVal} PSI`, w / 2, h / 2 + 6);
        ctx.textAlign = 'left';
      }
      else if (arOverlayType === 'VALVE_LOCK' || arOverlayType === 'TIRE_CHECK') {
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 70, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#10b981';
        ctx.font = '500 14px Outfit, sans-serif';
        ctx.fillText('✓ Vedação e Pressão Validadas', w / 2 - 95, h / 2 - 80);
      }
    };

    drawAR();

    return () => cancelAnimationFrame(frameId);
  }, [arOverlayType, showAROverlay]);

  // Capture Photo Snapshot
  const captureSnapshot = () => {
    soundFX.playCameraShutter();
    setFlashEffect(true);
    setTimeout(() => setFlashEffect(false), 200);

    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');

    if (hasCamera && videoRef.current) {
      ctx.drawImage(videoRef.current, 0, 0, 640, 360);
    } else {
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, 640, 360);
      ctx.fillStyle = '#10b981';
      ctx.font = '600 18px Outfit, sans-serif';
      ctx.fillText('REGISTRO DE MANUTENÇÃO', 200, 170);
      ctx.font = '14px Inter, sans-serif';
      ctx.fillText(`Passo: ${arOverlayType}`, 240, 205);
    }

    const dataUrl = canvas.toDataURL('image/png');
    setLastSnap(dataUrl);
    if (onCapturePhoto) {
      onCapturePhoto(dataUrl);
    }
  };

  return (
    <div className="cyber-panel p-5 flex flex-col gap-4">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-semibold text-slate-200 font-heading">Visão da Câmera & Retículo AR</h2>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowAROverlay(!showAROverlay)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
              showAROverlay ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-white/5 text-slate-400'
            }`}
          >
            {showAROverlay ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Overlay AR</span>
          </button>

          <button 
            onClick={startCamera}
            className="p-1.5 rounded-lg border border-white/5 text-slate-400 hover:text-white transition-all"
            title="Reiniciar Câmera"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Camera Viewport */}
      <div className="relative w-full aspect-video bg-slate-900 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center">
        {flashEffect && (
          <div className="absolute inset-0 bg-white z-50 animate-ping opacity-80" />
        )}

        {hasCamera ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
            <Sparkles className="w-8 h-8 text-emerald-400 animate-pulse mb-2" />
            <p className="text-slate-200 font-medium text-sm">Câmera Simulada Ativa</p>
            <p className="text-xs text-slate-400 mt-1">{cameraError || 'Aguardando sensor...'}</p>
          </div>
        )}

        <canvas 
          ref={canvasRef} 
          width={640} 
          height={360} 
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />

        {/* Mic Audio Spectrum Overlay Bar */}
        <div className="absolute bottom-3 left-3 z-20 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-medium">Mic:</span>
          <canvas ref={micCanvasRef} width={100} height={16} className="w-24 h-4" />
        </div>

        {/* Snapshot Quick Trigger Button */}
        <button
          onClick={captureSnapshot}
          className="absolute bottom-3 right-3 z-20 cyber-btn cyber-btn-green py-1.5 px-3 text-xs shadow-lg"
          title="Tirar Foto (Voz: 'CAPTURAR')"
        >
          <Aperture className="w-3.5 h-3.5" />
          <span>Capturar Foto</span>
        </button>
      </div>

      {/* Snapshot Preview Thumbnail */}
      {lastSnap && (
        <div className="flex items-center gap-3 bg-slate-900/60 p-2.5 rounded-xl border border-emerald-500/20">
          <img src={lastSnap} alt="Snapshot" className="w-14 h-9 object-cover rounded-lg border border-emerald-500/30" />
          <div>
            <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Foto Salva no Relatório
            </div>
            <div className="text-[11px] text-slate-400">Disponível no Certificado Final</div>
          </div>
        </div>
      )}
    </div>
  );
}
