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
      setCameraError("Feed simulado de oficina ativo");
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
            const greenVal = Math.min(255, dataArray[i] * 2);
            ctx.fillStyle = `rgba(0, ${greenVal}, 255, 0.8)`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#00f3ff';
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

  // Render AR Overlay graphics on top of video feed for Bike Tire Inflation
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

      // Base Reticle Crosshair
      ctx.strokeStyle = '#00f3ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 40 + Math.sin(now) * 4, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(w / 2 - 60, h / 2);
      ctx.lineTo(w / 2 - 20, h / 2);
      ctx.moveTo(w / 2 + 20, h / 2);
      ctx.lineTo(w / 2 + 60, h / 2);
      ctx.moveTo(w / 2, h / 2 - 60);
      ctx.lineTo(w / 2, h / 2 - 20);
      ctx.moveTo(w / 2, h / 2 + 20);
      ctx.lineTo(w / 2, h / 2 + 60);
      ctx.stroke();

      // Step-Specific AR Overlays
      if (arOverlayType === 'VALVE_SEARCH') {
        // Target circle over bike valve stem
        ctx.strokeStyle = '#00ff66';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2 + 40, 50, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#00ff66';
        ctx.font = '14px Orbitron';
        ctx.fillText('ALVO AR: ENQUADRAR VÁLVULA DA BICICLETA (POSIÇÃO 6H)', w / 2 - 200, h / 2 - 60);
      } 
      else if (arOverlayType === 'VALVE_UNSCREW') {
        // Rotating Arrow indicating unscrewing nut
        ctx.save();
        ctx.translate(w / 2, h / 2);
        ctx.rotate(now * 2);
        ctx.strokeStyle = '#ffb700';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, 45, 0, Math.PI * 1.5);
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = '#ffb700';
        ctx.font = '14px Orbitron';
        ctx.fillText('DESROSQUEAR PORCA PRESTA (DESAPERTO ANTI-HORÁRIO)', w / 2 - 210, h / 2 - 70);
      }
      else if (arOverlayType === 'PUMP_ATTACH') {
        // Downward Arrow for pushing nozzle onto valve stem
        const arrowY = h / 2 - 40 + Math.sin(now * 5) * 10;
        ctx.strokeStyle = '#00f3ff';
        ctx.fillStyle = '#00f3ff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(w / 2, arrowY);
        ctx.lineTo(w / 2, arrowY + 40);
        ctx.lineTo(w / 2 - 15, arrowY + 25);
        ctx.moveTo(w / 2, arrowY + 40);
        ctx.lineTo(w / 2 + 15, arrowY + 25);
        ctx.stroke();

        ctx.font = '14px Orbitron';
        ctx.fillText('PRESSIONAR BICO DA BOMBA ATÉ O FUNDO E LEVANTAR ALAVANCA', w / 2 - 240, h / 2 - 80);
      }
      else if (arOverlayType === 'PSI_GAUGE') {
        // Animated Gauge Dial Arc
        const startAngle = Math.PI * 0.85;
        const endAngle = Math.PI * 2.15;
        const currentAngle = startAngle + (endAngle - startAngle) * (0.5 + Math.sin(now) * 0.2);

        // Track Arc
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.2)';
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 70, startAngle, endAngle);
        ctx.stroke();

        // Filled Pressure Arc
        ctx.strokeStyle = '#00ff66';
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 70, startAngle, currentAngle);
        ctx.stroke();

        const psiVal = Math.round(30 + (currentAngle - startAngle) * 45);
        ctx.fillStyle = '#00ff66';
        ctx.font = '22px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillText(`${psiVal} PSI`, w / 2, h / 2 + 8);
        ctx.font = '12px Share Tech Mono';
        ctx.fillText('MONITORANDO PRESSÃO DE AR', w / 2, h / 2 + 30);
        ctx.textAlign = 'left';
      }
      else if (arOverlayType === 'VALVE_LOCK' || arOverlayType === 'TIRE_CHECK') {
        // Green Check Ring around wheel
        ctx.strokeStyle = '#00ff66';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 80, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#00ff66';
        ctx.font = '16px Orbitron';
        ctx.fillText('✓ VEDAÇÃO E PRESSÃO DO PNEU CONFIRMADAS', w / 2 - 180, h / 2 - 90);
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
      // Draw simulated camera view
      ctx.fillStyle = '#0a1128';
      ctx.fillRect(0, 0, 640, 360);
      ctx.fillStyle = '#00f3ff';
      ctx.font = '20px Orbitron';
      ctx.fillText('CYBERDECK BIKE WORKSHOP SNAPSHOT', 100, 160);
      ctx.fillStyle = '#00ff66';
      ctx.fillText(`Passo AR: ${arOverlayType}`, 180, 200);
      ctx.font = '14px Share Tech Mono';
      ctx.fillText(`DATA: ${new Date().toLocaleString()}`, 200, 240);
    }

    const dataUrl = canvas.toDataURL('image/png');
    setLastSnap(dataUrl);
    if (onCapturePhoto) {
      onCapturePhoto(dataUrl);
    }
  };

  return (
    <div className="cyber-panel p-4 flex flex-col gap-3 relative">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-cyan-400 glow-cyan" />
          <h2 className="text-sm font-bold tracking-wider text-cyan-400">FEED DA CÂMERA & OVERLAY AR DA VÁLVULA</h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle AR Overlays */}
          <button 
            onClick={() => setShowAROverlay(!showAROverlay)}
            className={`px-2 py-1 rounded text-xs font-mono border flex items-center gap-1 transition-all ${
              showAROverlay ? 'border-cyan-400 text-cyan-300 bg-cyan-950/60' : 'border-slate-700 text-slate-500'
            }`}
          >
            {showAROverlay ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>OVERLAY AR</span>
          </button>

          {/* Camera Refresh */}
          <button 
            onClick={startCamera}
            className="p-1.5 rounded border border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-500 transition-all"
            title="Reiniciar Câmera"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Camera Viewport with AR Layer */}
      <div className="relative w-full aspect-video bg-slate-950 rounded border border-cyan-500/30 overflow-hidden flex items-center justify-center">
        {/* Flash Effect on capture */}
        {flashEffect && (
          <div className="absolute inset-0 bg-white z-50 animate-ping opacity-80" />
        )}

        {/* Real Video Stream */}
        {hasCamera ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover"
          />
        ) : (
          /* Simulated Feed Fallback */
          <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 scanline-overlay" />
            <div className="w-32 h-32 rounded-full border border-cyan-500/30 flex items-center justify-center radar-spinner mb-4">
              <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
            </div>
            <p className="text-cyan-400 font-heading text-sm mb-1 glow-cyan">MODO OFICINA BIKE - CÂMERA SIMULADA</p>
            <p className="text-xs text-slate-400 font-mono">{cameraError || 'Aguardando inicialização do sensor...'}</p>
          </div>
        )}

        {/* AR Canvas Overlay Layer */}
        <canvas 
          ref={canvasRef} 
          width={640} 
          height={360} 
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />

        {/* Mic Audio Spectrum Overlay Bar */}
        <div className="absolute bottom-2 left-2 z-20 bg-slate-950/80 px-3 py-1.5 rounded border border-cyan-500/30 flex items-center gap-2">
          <span className="text-[10px] font-mono text-cyan-400">SPECTRUM MIC:</span>
          <canvas ref={micCanvasRef} width={120} height={20} className="w-28 h-5" />
        </div>

        {/* Snapshot Quick Trigger Button */}
        <button
          onClick={captureSnapshot}
          className="absolute bottom-3 right-3 z-20 cyber-btn cyber-btn-green py-2 px-3 text-xs shadow-[0_0_15px_rgba(0,255,102,0.4)]"
          title="Tirar Foto da Válvula/Pneu (Voz: 'CAPTURAR')"
        >
          <Aperture className="w-4 h-4 animate-spin-slow" />
          <span>CAPTURAR FOTO</span>
        </button>
      </div>

      {/* Snapshot Preview Thumbnail if taken */}
      {lastSnap && (
        <div className="flex items-center gap-3 bg-slate-950/60 p-2 rounded border border-emerald-500/30">
          <img src={lastSnap} alt="Snapshot" className="w-16 h-10 object-cover rounded border border-emerald-400" />
          <div>
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> REGISTRO DE CALIBRAGEM SALVO!
            </div>
            <div className="text-[10px] text-slate-400 font-mono">Incluso no Relatório da Bicicleta</div>
          </div>
        </div>
      )}
    </div>
  );
}
