import React, { useRef, useEffect, useState } from 'react';
import { Camera, RefreshCw, Eye, EyeOff, Aperture, CheckCircle2, Sparkles, Scan, AlertTriangle, Cpu } from 'lucide-react';
import { soundFX } from '../services/audioFX';
import { analyzeLiveVisionFrame } from '../services/geminiVisionService';
import { speechService } from '../services/speechService';

export function CameraHUD({ arOverlayType, currentStepId, onCapturePhoto, isMicActive }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const micCanvasRef = useRef(null);
  
  const [stream, setStream] = useState(null);
  const [hasCamera, setHasCamera] = useState(true);
  const [cameraError, setCameraError] = useState(null);
  const [showAROverlay, setShowAROverlay] = useState(true);
  const [isVisionAIScanning, setIsVisionAIScanning] = useState(true);
  const [visionAnalysis, setVisionAnalysis] = useState(null);
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

  const lastSpokenInstructionRef = useRef('');

  // Reset last spoken instruction when step changes
  useEffect(() => {
    lastSpokenInstructionRef.current = '';
  }, [currentStepId]);

  // Continuous Live Vision AI Scanner (Runs every 3.5 seconds)
  useEffect(() => {
    let timer = null;

    const runVisionScan = async () => {
      if (!isVisionAIScanning) return;

      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 360;
      const ctx = canvas.getContext('2d');

      if (hasCamera && videoRef.current) {
        ctx.drawImage(videoRef.current, 0, 0, 640, 360);
      } else {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, 640, 360);
      }

      const frameDataUrl = canvas.toDataURL('image/jpeg', 0.7);
      const analysis = await analyzeLiveVisionFrame(frameDataUrl, currentStepId);
      setVisionAnalysis(analysis);

      // Only speak if correction is required AND it hasn't been spoken yet for this alert!
      if (analysis && analysis.correctionRequired && analysis.instruction !== lastSpokenInstructionRef.current) {
        lastSpokenInstructionRef.current = analysis.instruction;
        soundFX.playAlert();
        speechService.speak(analysis.instruction);
      }
    };

    if (isVisionAIScanning) {
      runVisionScan();
      timer = setInterval(runVisionScan, 3500);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isVisionAIScanning, currentStepId, hasCamera]);

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

  // Render Clean AR Overlay graphics + Vision AI Bounding Box
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

      // Render Dynamic Vision AI Bounding Box & Status Overlay
      if (visionAnalysis && visionAnalysis.boundingBox) {
        const { x, y, width, height } = visionAnalysis.boundingBox;
        const isError = visionAnalysis.correctionRequired;

        // Bounding Box stroke style based on status
        ctx.strokeStyle = isError ? '#f43f5e' : '#10b981';
        ctx.lineWidth = isError ? 3 : 2;

        if (isError && Math.floor(Date.now() / 300) % 2 === 0) {
          ctx.strokeStyle = '#f59e0b'; // flashing alert
        }

        ctx.strokeRect(x, y, width, height);

        // Bounding Box Label
        ctx.fillStyle = isError ? '#f43f5e' : '#10b981';
        ctx.fillRect(x, y - 24, width, 24);

        ctx.fillStyle = '#ffffff';
        ctx.font = '600 11px Inter, sans-serif';
        const labelText = isError 
          ? `⚠️ CORREÇÃO IA: ${visionAnalysis.status}`
          : `✓ VISÃO IA: ${visionAnalysis.detectedObjects[0] || 'NOMINAL'}`;
        ctx.fillText(labelText, x + 6, y - 8);
      }
    };

    drawAR();

    return () => cancelAnimationFrame(frameId);
  }, [arOverlayType, showAROverlay, visionAnalysis]);

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
          <h2 className="text-sm font-semibold text-slate-200 font-heading">Visão da Câmera & Scanner IA ao Vivo</h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Vision AI Scanner */}
          <button
            onClick={() => {
              soundFX.playClick();
              setIsVisionAIScanning(!isVisionAIScanning);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
              isVisionAIScanning ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' : 'border-white/5 text-slate-400'
            }`}
          >
            <Scan className={`w-3.5 h-3.5 ${isVisionAIScanning ? 'animate-pulse' : ''}`} />
            <span>{isVisionAIScanning ? 'Scanner IA Ativo' : 'Scanner Pausado'}</span>
          </button>

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

        {/* Live Vision AI Alert Banner Overlay */}
        {visionAnalysis && visionAnalysis.instruction && (
          <div className={`absolute top-3 left-3 right-3 z-30 px-3.5 py-2 rounded-xl backdrop-blur-md border text-xs flex items-center justify-between transition-all ${
            visionAnalysis.correctionRequired
              ? 'bg-rose-950/90 border-rose-500/50 text-rose-200 animate-pulse'
              : 'bg-slate-900/90 border-emerald-500/40 text-emerald-300'
          }`}>
            <div className="flex items-center gap-2">
              {visionAnalysis.correctionRequired ? (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              ) : (
                <Cpu className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <span className="font-medium">{visionAnalysis.instruction}</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-2">
              {Math.round(visionAnalysis.confidence * 100)}% Conf.
            </span>
          </div>
        )}

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
