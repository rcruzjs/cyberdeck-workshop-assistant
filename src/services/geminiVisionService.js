// Real-time Vision AI Analysis & Correction Service (Gemini Multimodal Engine)

// Simulated Vision Analysis Scenario Datasets for dynamic live testing
const VISION_SCENARIOS = [
  {
    status: 'NOMINAL',
    detectedObjects: ['VÁLVULA_PRESTA', "BICO_BOMBA_ALINHADO", 'RODA_BICICLETA'],
    confidence: 0.98,
    alignmentAngle: 90,
    correctionRequired: false,
    instruction: "Alinhamento excelente! A válvula Presta está solta e o bico da bomba está perfeitamente a 90 graus.",
    boundingBox: { x: 260, y: 110, width: 140, height: 140 }
  },
  {
    status: 'WARNING_NUT_LOCKED',
    detectedObjects: ['VÁLVULA_PRESTA_TRAVADA', 'BICO_BOMBA'],
    confidence: 0.96,
    alignmentAngle: 88,
    correctionRequired: true,
    instruction: "Atenção: A porca da válvula Presta ainda está apertada! Desrosqueie no sentido anti-horário antes de encaixar o bico.",
    boundingBox: { x: 270, y: 130, width: 120, height: 120 }
  },
  {
    status: 'WARNING_NOZZLE_TILTED',
    detectedObjects: ['VÁLVULA_SCHRADER', 'BICO_BOMBA_INCLINADO'],
    confidence: 0.94,
    alignmentAngle: 58,
    correctionRequired: true,
    instruction: "Alerta: O bico da bomba está inclinado a 58 graus! Re-alinhe verticalmente a 90 graus para evitar vazamento de ar e danos na haste.",
    boundingBox: { x: 230, y: 100, width: 180, height: 160 }
  },
  {
    status: 'NOMINAL_PUMPING',
    detectedObjects: ['HASTE_BOMBA_MOVIMENTO', 'MANÔMETRO_38_PSI'],
    confidence: 0.99,
    alignmentAngle: 90,
    correctionRequired: false,
    instruction: "Bombeamento detectado! Pressão em 38 PSI. Continue até atingir a calibragem recomendada.",
    boundingBox: { x: 220, y: 80, width: 200, height: 200 }
  }
];

let scenarioIdx = 0;

export async function analyzeLiveVisionFrame(canvasFrameDataUrl, currentStepId) {
  // Simulate network latency for Vision AI processing
  await new Promise(resolve => setTimeout(resolve, 600));

  // Rotate or select scenario based on step context
  if (currentStepId === 2) {
    // Step 2 focus: Presta nut status
    const current = VISION_SCENARIOS[1];
    return { ...current, timestamp: new Date().toLocaleTimeString() };
  } else if (currentStepId === 3) {
    // Step 3 focus: Nozzle alignment
    const current = VISION_SCENARIOS[2];
    return { ...current, timestamp: new Date().toLocaleTimeString() };
  } else if (currentStepId === 4) {
    // Step 4 focus: Pumping action
    const current = VISION_SCENARIOS[3];
    return { ...current, timestamp: new Date().toLocaleTimeString() };
  }

  // Default nominal view
  const result = VISION_SCENARIOS[scenarioIdx % VISION_SCENARIOS.length];
  scenarioIdx++;
  return { ...result, timestamp: new Date().toLocaleTimeString() };
}
