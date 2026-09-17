import React, { useRef, useEffect, useState } from 'react';
import { X, Box, RotateCcw, ZoomIn, ZoomOut, Play, Pause, Layers } from 'lucide-react';
import { soundFX } from '../services/audioFX';

export function Component3DViewerModal({ isOpen, onClose, componentType = 'VALVE' }) {
  const canvasRef = useRef(null);
  const [modelType, setModelType] = useState(componentType || 'VALVE');
  const [autoRotate, setAutoRotate] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState({ x: 0.3, y: 0.5 });
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setModelType(componentType || 'VALVE');
  }, [componentType]);

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let angleY = rotation.y;

    const render3DModel = () => {
      animId = requestAnimationFrame(render3DModel);
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      if (autoRotate && !isDraggingRef.current) {
        angleY += 0.015;
      }

      const rotX = rotation.x;
      const rotY = isDraggingRef.current ? rotation.y : angleY;

      // 3D Point Projection Helper
      const project = (x, y, z) => {
        // Rotate around Y
        const radY = rotY;
        const x1 = x * Math.cos(radY) + z * Math.sin(radY);
        const z1 = -x * Math.sin(radY) + z * Math.cos(radY);

        // Rotate around X
        const radX = rotX;
        const y2 = y * Math.cos(radX) - z1 * Math.sin(radX);
        const z2 = y * Math.sin(radX) + z1 * Math.cos(radX);

        // Perspective Projection
        const distance = 400;
        const fov = (distance / (distance + z2)) * zoom;
        const projX = w / 2 + x1 * fov;
        const projY = h / 2 + y2 * fov;

        return { x: projX, y: projY, z: z2 };
      };

      if (modelType === 'VALVE') {
        // Draw 3D Presta Valve Cylinder Rings
        const layers = 18;
        const radius = 35;
        const height = 180;

        for (let i = 0; i < layers; i++) {
          const layerY = -height / 2 + (i * height) / layers;
          const isCap = i < 3;
          const isNut = i > 12 && i < 15;
          const layerRadius = isCap ? radius * 0.7 : isNut ? radius * 1.3 : radius;

          ctx.beginPath();
          ctx.strokeStyle = isCap ? '#f59e0b' : isNut ? '#06b6d4' : '#10b981';
          ctx.lineWidth = isCap ? 3 : 2;

          const segments = 16;
          for (let s = 0; s <= segments; s++) {
            const theta = (s * Math.PI * 2) / segments;
            const px = Math.cos(theta) * layerRadius;
            const pz = Math.sin(theta) * layerRadius;
            const pt = project(px, layerY, pz);

            if (s === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          }
          ctx.stroke();
        }

        // Draw Valve Center Core Pin
        ctx.beginPath();
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 3;
        const topPin = project(0, -height / 2 - 25, 0);
        const botPin = project(0, height / 2 + 10, 0);
        ctx.moveTo(topPin.x, topPin.y);
        ctx.lineTo(botPin.x, botPin.y);
        ctx.stroke();

        // Pin Top Bulb
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.arc(topPin.x, topPin.y, 6 * zoom, 0, Math.PI * 2);
        ctx.fill();

      } else {
        // Draw 3D M.2 NVMe SSD Card Wireframe
        const ssdW = 120;
        const ssdH = 220;
        const ssdD = 15;

        // Cube 8 vertices
        const vertices = [
          { x: -ssdW / 2, y: -ssdH / 2, z: -ssdD / 2 },
          { x: ssdW / 2, y: -ssdH / 2, z: -ssdD / 2 },
          { x: ssdW / 2, y: ssdH / 2, z: -ssdD / 2 },
          { x: -ssdW / 2, y: ssdH / 2, z: -ssdD / 2 },
          { x: -ssdW / 2, y: -ssdH / 2, z: ssdD / 2 },
          { x: ssdW / 2, y: -ssdH / 2, z: ssdD / 2 },
          { x: ssdW / 2, y: ssdH / 2, z: ssdD / 2 },
          { x: -ssdW / 2, y: ssdH / 2, z: ssdD / 2 }
        ];

        const projVerts = vertices.map(v => project(v.x, v.y, v.z));
        const edges = [
          [0,1],[1,2],[2,3],[3,0],
          [4,5],[5,6],[6,7],[7,4],
          [0,4],[1,5],[2,6],[3,7]
        ];

        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2;
        edges.forEach(([i, j]) => {
          ctx.beginPath();
          ctx.moveTo(projVerts[i].x, projVerts[i].y);
          ctx.lineTo(projVerts[j].x, projVerts[j].y);
          ctx.stroke();
        });

        // Memory Chips on board
        const chip = project(0, -30, -ssdD / 2 - 8);
        ctx.fillStyle = '#10b981';
        ctx.fillRect(chip.x - 20 * zoom, chip.y - 30 * zoom, 40 * zoom, 60 * zoom);
      }
    };

    render3DModel();

    return () => cancelAnimationFrame(animId);
  }, [isOpen, modelType, autoRotate, zoom, rotation]);

  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;

    setRotation(prev => ({
      x: prev.x + dy * 0.01,
      y: prev.y + dx * 0.01
    }));

    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="cyber-panel w-full max-w-3xl bg-slate-900 border border-emerald-500/40 p-5 rounded-lg shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
          <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-emerald-400 glow-green" />
            <h2 className="text-base font-bold tracking-wider text-emerald-400 uppercase">
              VISUALIZADOR 3D INTERATIVO // WEBGLE ENGINE 360°
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Model Selector Bar */}
        <div className="flex items-center justify-between bg-slate-950 p-2 rounded border border-white/10 text-xs font-mono">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundFX.playClick();
                setModelType('VALVE');
              }}
              className={`px-3 py-1 rounded font-bold transition ${
                modelType === 'VALVE' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              VÁLVULA PRESTA 3D
            </button>

            <button
              onClick={() => {
                soundFX.playClick();
                setModelType('SSD');
              }}
              className={`px-3 py-1 rounded font-bold transition ${
                modelType === 'SSD' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              SSD M.2 HARDWARE 3D
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundFX.playClick();
                setAutoRotate(!autoRotate);
              }}
              className="p-1.5 rounded border border-slate-700 text-slate-300 hover:text-white"
              title={autoRotate ? "Pausar auto-rotação" : "Iniciar auto-rotação"}
            >
              {autoRotate ? <Pause className="w-4 h-4 text-emerald-400" /> : <Play className="w-4 h-4 text-slate-400" />}
            </button>

            <button
              onClick={() => setZoom(prev => Math.min(prev + 0.2, 2.0))}
              className="p-1.5 rounded border border-slate-700 text-slate-300 hover:text-white"
              title="Aumentar Zoom"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.5))}
              className="p-1.5 rounded border border-slate-700 text-slate-300 hover:text-white"
              title="Diminuir Zoom"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3D Viewport Canvas */}
        <div 
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="relative w-full aspect-video bg-black/90 rounded-xl border border-emerald-500/30 overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
        >
          <canvas ref={canvasRef} width={640} height={360} className="w-full h-full" />

          <div className="absolute bottom-3 left-3 text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded border border-white/10">
            🖱️ ARRASTE COM O MOUSE PARA ROTACIONAR EM 360°
          </div>
        </div>

        {/* Info Legend */}
        <div className="text-xs font-mono text-slate-400 bg-slate-950/60 p-3 rounded border border-slate-800">
          {modelType === 'VALVE' ? (
            <p>📍 <strong className="text-emerald-400">Válvula Presta:</strong> Tampa superior (Laranja), Corpo roscado de latão (Verde) e porca de fixação no aro (Ciano).</p>
          ) : (
            <p>💻 <strong className="text-cyan-400">SSD M.2 NVMe:</strong> Placa PCB PCIe (Ciano) e chips NAND Flash de armazenamento acoplados (Verde).</p>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="cyber-btn cyber-btn-green text-xs py-1.5 px-4"
          >
            FECHAR VISUALIZADOR 3D
          </button>
        </div>

      </div>
    </div>
  );
}
