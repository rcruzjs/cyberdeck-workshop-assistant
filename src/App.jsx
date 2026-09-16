import React, { useState, useEffect, useCallback } from 'react';
import { STEPS_DATA } from './services/stepsData';
import { speechService } from './services/speechService';
import { soundFX } from './services/audioFX';
import { HeaderHUD } from './components/HeaderHUD';
import { CameraHUD } from './components/CameraHUD';
import { StepGuide } from './components/StepGuide';
import { VisualGuidePanel } from './components/VisualGuidePanel';
import { HandsFreePanel } from './components/HandsFreePanel';
import { DiagnosticPanel } from './components/DiagnosticPanel';
import { AIChatPanel } from './components/AIChatPanel';
import { GalleryModal } from './components/GalleryModal';
import { FolderCheck, RotateCcw, Sparkles } from 'lucide-react';

export default function App() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [photos, setPhotos] = useState([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const currentStep = STEPS_DATA[currentStepIndex];

  // Navigation handlers
  const handleNextStep = useCallback(() => {
    soundFX.playSuccess();
    setCurrentStepIndex(prev => Math.min(prev + 1, STEPS_DATA.length - 1));
  }, []);

  const handlePrevStep = useCallback(() => {
    soundFX.playClick();
    setCurrentStepIndex(prev => Math.max(prev - 1, 0));
  }, []);

  const handleRepeatStep = useCallback(() => {
    soundFX.playClick();
    speechService.speak(currentStep.narration, () => setIsSpeaking(false));
    setIsSpeaking(true);
  }, [currentStep]);

  const handleCapturePhoto = useCallback((snapData) => {
    soundFX.playCameraShutter();
    if (snapData) {
      setPhotos(prev => [...prev, snapData]);
    }
  }, []);

  // Voice Command dispatcher
  const handleVoiceCommand = useCallback((cmd, fullText) => {
    soundFX.playVoiceConfirm();
    setLastCommand(cmd);

    switch (cmd) {
      case 'NEXT':
        handleNextStep();
        break;
      case 'PREV':
        handlePrevStep();
        break;
      case 'REPEAT':
        handleRepeatStep();
        break;
      case 'CAPTURE':
        const snapBtn = document.querySelector('button[title*="Tirar Foto"]');
        if (snapBtn) snapBtn.click();
        break;
      case 'HELP':
        speechService.speak(`Dica do técnico: ${currentStep.tip}`, () => setIsSpeaking(false));
        setIsSpeaking(true);
        break;
      case 'RESTART':
        soundFX.playAlert();
        setCurrentStepIndex(0);
        break;
      default:
        break;
    }
  }, [handleNextStep, handlePrevStep, handleRepeatStep, currentStep]);

  // Speech Recognition Initialization
  useEffect(() => {
    const success = speechService.initRecognition(
      (cmd, text) => handleVoiceCommand(cmd, text),
      (textStr) => setTranscript(textStr),
      (listeningState) => setIsMicActive(listeningState)
    );

    if (success) {
      speechService.startListening();
    }

    return () => {
      speechService.stopListening();
      speechService.stopSpeaking();
    };
  }, [handleVoiceCommand]);

  const toggleMic = () => {
    if (isMicActive) {
      speechService.stopListening();
    } else {
      speechService.startListening();
    }
  };

  return (
    <div className="min-h-screen p-3 md:p-6 flex flex-col justify-between relative overflow-hidden selection:bg-cyan-500 selection:text-black">
      {/* Background Cyber Scanlines */}
      <div className="scanline-overlay pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-[1600px] w-full mx-auto flex flex-col flex-1 z-10">
        {/* Top Header HUD */}
        <HeaderHUD 
          currentStep={currentStepIndex + 1}
          totalSteps={STEPS_DATA.length}
          isMicActive={isMicActive}
          isSpeaking={isSpeaking}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          capturedCount={photos.length}
        />

        {/* Main Workstation Layout */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1">
          {/* Left Column: Camera Feed & Voice Controller (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <CameraHUD 
              arOverlayType={currentStep.arOverlayType}
              onCapturePhoto={handleCapturePhoto}
              isMicActive={isMicActive}
            />

            <HandsFreePanel 
              isMicActive={isMicActive}
              toggleMic={toggleMic}
              transcript={transcript}
              lastCommand={handleNextStep}
              onNextStep={handleNextStep}
              onPrevStep={handlePrevStep}
              onRepeatStep={handleRepeatStep}
              onCapturePhoto={handleCapturePhoto}
            />

            <DiagnosticPanel />
          </div>

          {/* Right Column: Visual Video Guide, AI Chat Panel & Step Instructions (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4 justify-between">
            {/* Visual Step Video Panel */}
            <VisualGuidePanel 
              stepId={currentStep.id} 
              stepTitle={currentStep.title} 
            />

            {/* AI Mechanical Specialist Chat Panel (LLM) */}
            <AIChatPanel isMicActive={isMicActive} />

            {/* Step Guide Component */}
            <StepGuide 
              step={currentStep}
              totalSteps={STEPS_DATA.length}
              onNext={handleNextStep}
              onPrev={handlePrevStep}
              isSpeaking={isSpeaking}
              setIsSpeaking={setIsSpeaking}
            />

            {/* Bottom Workstation Bar */}
            <div className="cyber-panel p-4 flex flex-wrap items-center justify-between gap-3 border-t border-cyan-500/30">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsGalleryOpen(true)}
                  className="cyber-btn cyber-btn-secondary text-xs flex items-center gap-1.5"
                >
                  <FolderCheck className="w-4 h-4 text-cyan-400" />
                  <span>REGISTRO FOTOGRÁFICO ({photos.length})</span>
                </button>

                <button
                  onClick={() => {
                    soundFX.playAlert();
                    setCurrentStepIndex(0);
                  }}
                  className="cyber-btn cyber-btn-secondary text-xs flex items-center gap-1.5"
                  title="Reiniciar Procedimento"
                >
                  <RotateCcw className="w-4 h-4 text-slate-400" />
                  <span>REINICIAR</span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>ASSISTENTE VIVA-VOZ E IA CONSULTOR ATIVOS</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Photo Gallery & Report Modal */}
      <GalleryModal 
        photos={photos}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />
    </div>
  );
}
