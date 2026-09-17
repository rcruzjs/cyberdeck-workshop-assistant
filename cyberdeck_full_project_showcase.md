# ⚡ Cyberdeck Workshop Assistant // Artifact Showcase & Manual Técnico

> [!NOTE]
> O **Cyberdeck Workshop Assistant** é uma plataforma de orientação técnica mãos-livres (*hands-free first*) do estado da arte, desenvolvida com React 19, Vite 8, Visão Computacional Multimodal (Google Gemini 1.5 Flash), PWA Offline e Banco de Dados Local IndexedDB.

---

## 🎠 Carrossel Visual dos Módulos do Sistema

````carousel
# 🎙️ Módulo 1: Central Viva-Voz (Hands-Free) & Narração TTS
- Reconhecimento contínuo de fala em Português (`Web Speech API`).
- Comandos reconhecidos: `"PRÓXIMO"`, `"VOLTAR"`, `"CAPTURAR"`, `"REPETIR"`, `"AJUDA"`, `"REINICIAR"`.
- Controle deslizante de velocidade da narração viva-voz (0.7x a 1.5x) com botão de teste de áudio.

<!-- slide -->
# 👁️ Módulo 2: Visão Computacional IA & Avanço Automático
- Scanner multimodal de câmera em tempo real alimentado pela API do **Gemini 1.5 Flash**.
- Fallback resiliente com analisador local de densidade de pixels e contraste no Canvas 2D.
- Retículos AR dinamicos com ponteiro focal de alta precisão na válvula (`📍 VÁLVULA`).
- Avanço automático de etapa assim que a IA confirma a conclusão da ação do operador.

<!-- slide -->
# 📐 Módulo 3: Visualizador 3D Interativo 360° (WebGL Engine)
- Inspeção tridimensional em 360° com órbita por clique/arraste do mouse e controle de zoom.
- Modelos 3D de alta fidelidade: Válvula Presta/Schrader de Bicicleta e Cartões SSD M.2 NVMe.
- Alternância de auto-rotação e legenda técnica de componentes.

<!-- slide -->
# 📄 Módulo 4: Gerador de Relatórios Técnicos PDF & Auditoria
- Emissão de laudo técnico impresso oficial no formato PDF (`window.print()`).
- Inclui ID único do documento, data/hora, perfil ativo do IndexedDB (PSI/BAR e Válvula).
- Tabela de passos auditados, galeria de imagens capturadas e campos de assinatura técnica.

<!-- slide -->
# 📱 Módulo 5: Arquitetura PWA Offline & IndexedDB
- Cache inteligente Stale-While-Revalidate com Service Worker (`sw.js`) e manifesto (`manifest.json`).
- Armazenamento nativo IndexedDB via `indexedDBService.js` para perfis de bicicletas e histórico.
- Importação e exportação de procedimentos em arquivos `.json` estruturados.
````

---

## 🛠️ Destaques da Engenharia de Software

> [!TIP]
> **Zero Overhead de Dependências**: O sistema aproveita 7 APIs nativas do navegador (`WebRTC`, `Web Speech`, `Web Audio`, `MediaRecorder`, `IndexedDB`, `ServiceWorker`, `Canvas/WebGL`), mantendo o pacote de produção ultra-leve (~319 KB).

> [!IMPORTANT]
> **Resiliência a Falhas de Conexão**: O aplicativo alterna automaticamente entre chamadas da API Gemini e detectores locais de imagem, garantindo que o mecânico nunca fique sem assistência em garagens ou locais remotos sem internet.

---

## 📊 Arquitetura de Módulos & Estrutura de Arquivos

### 💻 Componentes Visuais (`src/components/`)
- [`HeaderHUD.jsx`](file:///c:/Users/rcruz/Downloads/cyberdeck/src/components/HeaderHUD.jsx): Barra superior com seletor de procedimentos, relógio digital, indicador `OFFLINE READY ⚡` e botões JSON.
- [`CameraHUD.jsx`](file:///c:/Users/rcruz/Downloads/cyberdeck/src/components/CameraHUD.jsx): Feed de câmera WebRTC, overlays AR, botão de gravação `🔴 REC VÍDEO` (WebM) e fotos.
- [`HandsFreePanel.jsx`](file:///c:/Users/rcruz/Downloads/cyberdeck/src/components/HandsFreePanel.jsx): Escuta de microfone, log de voz, timer automático e controle de velocidade TTS.
- [`VisualGuidePanel.jsx`](file:///c:/Users/rcruz/Downloads/cyberdeck/src/components/VisualGuidePanel.jsx): Animações vetoriais HD com câmeras lentas e atalho para inspeção 3D.
- [`DiagnosticPanel.jsx`](file:///c:/Users/rcruz/Downloads/cyberdeck/src/components/DiagnosticPanel.jsx): Manômetro de PSI/BAR sincronizado com o perfil ativo do IndexedDB.
- [`TechnicalReportModal.jsx`](file:///c:/Users/rcruz/Downloads/cyberdeck/src/components/TechnicalReportModal.jsx): Relatório técnico impresso para PDF com laudo oficial.
- [`Component3DViewerModal.jsx`](file:///c:/Users/rcruz/Downloads/cyberdeck/src/components/Component3DViewerModal.jsx): Renderizador 3D em 360° em Canvas/WebGL.
- [`AnalyticsModal.jsx`](file:///c:/Users/rcruz/Downloads/cyberdeck/src/components/AnalyticsModal.jsx): Dashboard de métricas e histórico de sessões salvas no IndexedDB.
- [`EquipmentProfileModal.jsx`](file:///c:/Users/rcruz/Downloads/cyberdeck/src/components/EquipmentProfileModal.jsx): Gerenciador de perfis de bicicletas e hardwares no IndexedDB.

### ⚙️ Motores e Serviços (`src/services/`)
- [`geminiVisionService.js`](file:///c:/Users/rcruz/Downloads/cyberdeck/src/services/geminiVisionService.js): Analisador multimodal Gemini 1.5 Flash e processador local de imagem.
- [`speechService.js`](file:///c:/Users/rcruz/Downloads/cyberdeck/src/services/speechService.js): Controlador de voz e síntese viva-voz.
- [`indexedDBService.js`](file:///c:/Users/rcruz/Downloads/cyberdeck/src/services/indexedDBService.js): Banco de dados local nativo IndexedDB.
- [`procedureImporter.js`](file:///c:/Users/rcruz/Downloads/cyberdeck/src/services/procedureImporter.js): Parser e validador de esquemas de manuais JSON.
- [`audioFX.js`](file:///c:/Users/rcruz/Downloads/cyberdeck/src/services/audioFX.js): Sintetizador de efeitos sonoros HUD via Web Audio API.

---

## 🚀 Repositório GitHub

> [!NOTE]
> O código-fonte completo está sincronizado na branch `main`:
> [https://github.com/rcruzjs/cyberdeck-workshop-assistant](https://github.com/rcruzjs/cyberdeck-workshop-assistant)
