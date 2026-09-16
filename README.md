# 🚲 Cyberdeck Workshop Assistant (Hands-Free Bike Tire Guide & AI Specialist)

Un aplicativo web estilo **Cyberdeck HUD futurista** com **Assistente de Oficina Viva-Voz**, projetado para orientar o usuário passo a passo no procedimento de enchimento e calibragem de pneus de bicicleta, acompanhado por câmera WebRTC com overlays AR, vídeo explicativo anamórfico e **IA Especialista em Mecânica (LLM)**.

---

## 🌟 Funcionalidades Principais

- 🎙️ **Controle Viva-Voz por Voz (`Web Speech API`)**: Comandos de voz em Português (`"PRÓXIMO"`, `"VOLTAR"`, `"CAPTURAR"`, `"REPETIR"`, `"AJUDA"`, `"REINICIAR"`) e Narração TTS audível.
- 📹 **Câmera WebRTC com Overlays AR**: Retículos de mira para válvula Presta/Schrader, alavanca de bomba e **Manômetro Circular Digital de PSI**.
- 🎬 **Painel de Vídeo Explicativo Anamórfico HD**: Animações técnicas vetoriais de cada etapa com suporte a Câmera Lenta (`0.5x`, `1x`, `2x`).
- 🤖 **Assistente IA Especialista de Mecânica (LLM)**: Tire dúvidas sobre calibragem de pneus tubulares (110-160 PSI), tubeless (22-35 PSI), tipos de bombas e manutenção.
- 📊 **Painel de Diagnóstico do Pneu**: Medição de PSI/Bar e teste de taxa de vazamento (`0.0 PSI/min`).
- 📸 **Galeria & Registro Fotográfico**: Emissão de relatório e certificado de manutenção com capturas de tela.

---

## 🛠️ Tecnologias Utilizadas

- **Core**: React + Vite (JavaScript ES6+)
- **Estilização**: Tailwind CSS v4 + Vanilla CSS Cyberpunk Design System
- **Ícones**: Lucide React
- **Nativa Browser APIs**:
  - `Web Speech API` (Reconhecimento de Fala PT-BR & Síntese de Voz TTS)
  - `WebRTC getUserMedia` (Câmera & Microfone)
  - `Web Audio API` (Sintetizador de Efeitos Sonoros HUD)

---

## 🚀 Como Executar Localmente

1. **Clonar o repositório**:
   ```bash
   git clone <URL_DO_SEU_REPOSITORIO>
   cd cyberdeck
   ```

2. **Instalar as dependências**:
   ```bash
   npm install
   ```

3. **Iniciar o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```
   Acesse no navegador: `http://localhost:5173/`

4. **Gerar build de produção**:
   ```bash
   npm run build
   ```
