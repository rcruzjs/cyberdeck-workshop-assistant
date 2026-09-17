import React, { useState, useEffect, useCallback } from 'react';
import { PROCEDURES_REGISTRY } from './services/proceduresData';
import { storageService } from './services/storageService';
import { speechService } from './services/speechService';
import { soundFX } from './services/audioFX';
import { HeaderHUD } from './components/HeaderHUD';
import { CameraHUD } from './components/CameraHUD';
import { StepGuide } from './components/StepGuide';
import { VisualGuidePanel } from './components/VisualGuidePanel';
import { HandsFreePanel } from './components/HandsFreePanel';
import { DiagnosticPanel } from './components/DiagnosticPanel';
import { AIChatPanel } from './components/AIChatPanel';
import { YouTubePlayerPanel } from './components/YouTubePlayerPanel';
import { GalleryModal } from './components/GalleryModal';
import { EquipmentProfileModal } from './components/EquipmentProfileModal';
import { indexedDBService } from './services/indexedDBService';
import { FolderCheck, RotateCcw, Sparkles } from 'lucide-react';

export default function App() {
  const [activeProcedureId, setActiveProcedureId] = useState(() => storageService.getActiveProcedureId());
  const [currentStepIndex, setCurrentStepIndex] = useState(() => storageService.getActiveStepIndex());
  const [isMicActive, setIsMicActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(() => storageService.getSoundEnabled());
  const [photos, setPhotos] = useState(() => storageService.getPhotos());
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // IndexedDB Profile state
  const [isProfilesModalOpen, setIsProfilesModalOpen] = useState(false);
  const [activeProfile, setActiveProfile] = useState(null);

  useEffect(() => {
    // Load default or active profile from IndexedDB on startup
    indexedDBService.getAllProfiles().then(profiles => {
      if (profiles && profiles.length > 0) {
        setActiveProfile(profiles[0]);
      }
    }).catch(err => console.warn('Erro ao carregar perfil inicial IndexedDB:', err));
  }, []);

  // Active YouTube Video state recommended by LLM
  const [activeYouTubeVideo, setActiveYouTubeVideo] = useState({
    id: "3_5w5N1oJ4E",
    title: "Tutorial: Como Usar Bombas de Ar em Válvula Presta e Schrader"
  });

  const activeProcedure = PROCEDURES_REGISTRY.find(p => p.id === activeProcedureId) || PROCEDURES_REGISTRY[0];
  const stepsData = activeProcedure.steps;
  const currentStep = stepsData[currentStepIndex] || stepsData[0];

  // Persist State Updates
  useEffect(() => {
    storageService.setActiveProcedureId(activeProcedureId);
  }, [activeProcedureId]);

  useEffect(() => {
    storageService.setActiveStepIndex(currentStepIndex);
  }, [currentStepIndex]);

  useEffect(() => {
    storageService.savePhotos(photos);
  }, [photos]);

  useEffect(() => {
    storageService.setSoundEnabled(soundEnabled);
  }, [soundEnabled]);

  // Procedure Switcher
  const handleSelectProcedure = (newProcedureId) => {
    setActiveProcedureId(newProcedureId);
    setCurrentStepIndex(0);
  };

  // Navigation handlers
  const handleNextStep = useCallback(() => {
    soundFX.playSuccess();
    setCurrentStepIndex(prev => Math.min(prev + 1, stepsData.length - 1));
  }, [stepsData.length]);

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

  const handleSelectYouTubeVideo = (id, title) => {
    setActiveYouTubeVideo({ id, title });
  };

  return (
    <div className="min-h-screen p-3 md:p-6 flex flex-col justify-between relative overflow-hidden selection:bg-emerald-500 selection:text-white">
      {/* Main Container */}
      <div className="max-w-[1600px] w-full mx-auto flex flex-col flex-1 z-10">
        {/* Top Header HUD */}
        <HeaderHUD 
          activeProcedureId={activeProcedureId}
          onSelectProcedure={handleSelectProcedure}
          currentStep={currentStepIndex + 1}
          totalSteps={stepsData.length}
          isMicActive={isMicActive}
          isSpeaking={isSpeaking}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          capturedCount={photos.length}
          activeProfile={activeProfile}
          onOpenProfilesModal={() => setIsProfilesModalOpen(true)}
        />

        {/* Main Workstation Layout */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1">
          {/* Left Column: Camera Feed with Vision AI & Voice Controller (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <CameraHUD 
              arOverlayType={currentStep.arOverlayType}
              currentStepId={currentStep.id}
              onCapturePhoto={handleCapturePhoto}
              isMicActive={isMicActive}
              onAutoAdvanceStep={handleNextStep}
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

            <DiagnosticPanel activeProfile={activeProfile} />
          </div>

          {/* Right Column: Visual Video Guide, YouTube LLM Video Player & AI Chat Panel (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4 justify-between">
            {/* Embedded YouTube Video Panel (Determined by LLM) */}
            {activeYouTubeVideo && activeYouTubeVideo.id && (
              <YouTubePlayerPanel 
                youtubeVideoId={activeYouTubeVideo.id}
                youtubeTitle={activeYouTubeVideo.title}
                onClose={() => setActiveYouTubeVideo({ id: null, title: null })}
              />
            )}

            {/* Visual Step Video Panel */}
            <VisualGuidePanel 
              stepId={currentStep.id} 
              stepTitle={currentStep.title} 
            />

            {/* AI Mechanical Specialist Chat Panel (LLM) */}
            <AIChatPanel 
              isMicActive={isMicActive} 
              onSelectYouTubeVideo={handleSelectYouTubeVideo}
            />

            {/* Step Guide Component */}
            <StepGuide 
              step={currentStep}
              totalSteps={stepsData.length}
              onNext={handleNextStep}
              onPrev={handlePrevStep}
              isSpeaking={isSpeaking}
              setIsSpeaking={setIsSpeaking}
            />

            {/* Bottom Workstation Bar */}
            <div className="cyber-panel p-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsGalleryOpen(true)}
                  className="cyber-btn cyber-btn-secondary text-xs flex items-center gap-1.5"
                >
                  <FolderCheck className="w-4 h-4 text-emerald-400" />
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
                <span>PLATAFORMA MULTI-PROCEDIMENTOS & PERSISTÊNCIA ATIVAS</span>
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

      {/* Equipment Profile Manager Modal (IndexedDB) */}
      <EquipmentProfileModal 
        isOpen={isProfilesModalOpen}
        onClose={() => setIsProfilesModalOpen(false)}
        activeProfileId={activeProfile?.id}
        onSelectProfile={(profile) => setActiveProfile(profile)}
      />
    </div>
  );
}
