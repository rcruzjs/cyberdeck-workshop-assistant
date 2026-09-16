// Web Speech API Voice Controller (Hands-Free Speech Recognition & Synthesis)

class SpeechService {
  constructor() {
    this.recognition = null;
    this.synth = window.speechSynthesis || null;
    this.isListening = false;
    this.isSpeaking = false;
    this.lang = 'pt-BR';
    this.onCommandCallback = null;
    this.onTranscriptCallback = null;
    this.onListeningChangeCallback = null;
    this.onSpeakingChangeCallback = null;
  }

  // Initialize SpeechRecognition
  initRecognition(onCommand, onTranscript, onListeningStatus) {
    this.onCommandCallback = onCommand;
    this.onTranscriptCallback = onTranscript;
    this.onListeningChangeCallback = onListeningStatus;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition API não suportada neste navegador.");
      return false;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = this.lang;

      this.recognition.onstart = () => {
        this.isListening = true;
        if (this.onListeningChangeCallback) this.onListeningChangeCallback(true);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (this.onListeningChangeCallback) this.onListeningChangeCallback(false);
        // Auto-restart if intended to keep hands-free active
        if (this.shouldAutoRestart) {
          setTimeout(() => this.startListening(), 500);
        }
      };

      this.recognition.onerror = (event) => {
        console.warn("Erro no reconhecimento de voz:", event.error);
        if (event.error === 'no-speech' || event.error === 'network') {
          // silent recover
        }
      };

      this.recognition.onresult = (event) => {
        let transcriptStr = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const text = event.results[i][0].transcript.toLowerCase().trim();
          transcriptStr += text + ' ';
          
          if (event.results[i].isFinal) {
            this.processVoiceCommand(text);
          }
        }
        if (this.onTranscriptCallback) {
          this.onTranscriptCallback(transcriptStr);
        }
      };

      return true;
    } catch (e) {
      console.error("Falha ao inicializar o reconhecimento de voz:", e);
      return false;
    }
  }

  startListening() {
    if (this.recognition && !this.isListening) {
      this.shouldAutoRestart = true;
      try {
        this.recognition.start();
      } catch (e) {
        // Already started or busy
      }
    }
  }

  stopListening() {
    this.shouldAutoRestart = false;
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
  }

  // Parse voice keywords
  processVoiceCommand(text) {
    if (!text) return;
    const clean = text.toLowerCase();

    if (clean.includes('próximo') || clean.includes('proximo') || clean.includes('avançar') || clean.includes('avancar') || clean.includes('seguir')) {
      if (this.onCommandCallback) this.onCommandCallback('NEXT', text);
    } else if (clean.includes('voltar') || clean.includes('anterior') || clean.includes('atrás')) {
      if (this.onCommandCallback) this.onCommandCallback('PREV', text);
    } else if (clean.includes('repetir') || clean.includes('falar de novo') || clean.includes('instrução')) {
      if (this.onCommandCallback) this.onCommandCallback('REPEAT', text);
    } else if (clean.includes('capturar') || clean.includes('foto') || clean.includes('tirar foto') || clean.includes('snap')) {
      if (this.onCommandCallback) this.onCommandCallback('CAPTURE', text);
    } else if (clean.includes('ajuda') || clean.includes('dica') || clean.includes('dicas')) {
      if (this.onCommandCallback) this.onCommandCallback('HELP', text);
    } else if (clean.includes('pausa') || clean.includes('parar') || clean.includes('pausar')) {
      if (this.onCommandCallback) this.onCommandCallback('PAUSE', text);
    } else if (clean.includes('continuar') || clean.includes('retomar')) {
      if (this.onCommandCallback) this.onCommandCallback('RESUME', text);
    } else if (clean.includes('reiniciar') || clean.includes('início') || clean.includes('inicio')) {
      if (this.onCommandCallback) this.onCommandCallback('RESTART', text);
    }
  }

  // Text-To-Speech Narrator
  speak(text, onEnd) {
    if (!this.synth) return;

    // Cancel current speech
    this.synth.cancel();

    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.lang;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Try finding Portuguese voice
    const voices = this.synth.getVoices();
    const ptVoice = voices.find(v => v.lang.includes('pt') || v.lang.includes('PT'));
    if (ptVoice) {
      utterance.voice = ptVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (this.onSpeakingChangeCallback) this.onSpeakingChangeCallback(true);
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (this.onSpeakingChangeCallback) this.onSpeakingChangeCallback(false);
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      if (this.onSpeakingChangeCallback) this.onSpeakingChangeCallback(false);
    };

    this.synth.speak(utterance);
  }

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      if (this.onSpeakingChangeCallback) this.onSpeakingChangeCallback(false);
    }
  }
}

export const speechService = new SpeechService();
