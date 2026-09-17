// Service to Validate, Import and Export Custom Workshop Procedures in JSON

const STORAGE_CUSTOM_KEY = 'cyberdeck_custom_procedures_v1';

export function getCustomProcedures() {
  try {
    const raw = localStorage.getItem(STORAGE_CUSTOM_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Erro ao ler procedimentos customizados:', e);
    return [];
  }
}

export function saveCustomProcedure(procedure) {
  const existing = getCustomProcedures();
  const updated = [...existing.filter(p => p.id !== procedure.id), procedure];
  localStorage.setItem(STORAGE_CUSTOM_KEY, JSON.stringify(updated));
  return updated;
}

export function validateProcedureSchema(jsonObj) {
  if (!jsonObj || typeof jsonObj !== 'object') {
    throw new Error('Arquivo JSON inválido ou corrompido.');
  }

  if (!jsonObj.title || typeof jsonObj.title !== 'string') {
    throw new Error('O campo "title" é obrigatório.');
  }

  if (!Array.isArray(jsonObj.steps) || jsonObj.steps.length === 0) {
    throw new Error('O procedimento deve conter uma lista "steps" com pelo menos 1 passo.');
  }

  // Validate each step
  jsonObj.steps.forEach((step, idx) => {
    if (!step.id || !step.title || !step.text) {
      throw new Error(`O passo #${idx + 1} está sem "id", "title" ou "text".`);
    }
  });

  const formattedId = jsonObj.id || `custom-${Date.now()}`;
  return {
    id: formattedId,
    title: jsonObj.title,
    category: jsonObj.category || 'CUSTOM',
    description: jsonObj.description || 'Manual customizado importado via JSON.',
    steps: jsonObj.steps.map((s, index) => ({
      id: s.id || index + 1,
      title: s.title,
      text: s.text,
      narration: s.narration || s.text,
      tip: s.tip || 'Siga os procedimentos de segurança de oficina.',
      arOverlayType: s.arOverlayType || 'FOCUS_RETICLE'
    }))
  };
}

export function exportProcedureAsJSON(procedure) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(procedure, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `manual_${procedure.id || 'procedimento'}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function getSampleProcedureJSON() {
  return {
    id: "sangria-freio-shimano",
    title: "Sangria de Freio Hidráulico Shimano MTB",
    category: "BICICLETA",
    description: "Guia passo a passo para substituição de fluido mineral e eliminação de bolhas de ar nos freios.",
    steps: [
      {
        id: 1,
        title: "Preparação e Fixação do Copo de Sangria",
        text: "Fixe a bicicleta no suporte, posicione a manete de freio na horizontal e rosqueie o copo de sangria com óleo mineral no manete.",
        narration: "Ajuste o manete de freio na horizontal e conecte o copo de sangria Shimano.",
        tip: "Utilize luvas de nitrilo e evite respingos de óleo nos discos de freio.",
        arOverlayType: "VALVE_ALIGNMENT"
      },
      {
        id: 2,
        title: "Injeção de Óleo Mineral na Pinça",
        text: "Conecte a seringa com óleo novo na válvula de sangria da pinça traseira. Abra a válvula 1/4 de volta e injete o fluido lentamente.",
        narration: "Abra a válvula da pinça e injete o fluido até que as bolhas subam pelo copo do manete.",
        tip: "Bata levemente na mangueira com uma chave allen para desprender bolhas presas.",
        arOverlayType: "TORQUE_GAUGE"
      },
      {
        id: 3,
        title: "Fechamento e Teste de Pressionamento",
        text: "Feche a válvula da pinça com torque de 4Nm, remova a seringa, sele o copo com a trava e teste a firmeza do manete.",
        narration: "Feche a válvula de sangria e pressione a manete para verificar a rigidez da frenagem.",
        tip: "Limpe eventuais resíduos de óleo com álcool isopropílico 99%.",
        arOverlayType: "CHECKMARK_SUCCESS"
      }
    ]
  };
}
