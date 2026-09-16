// Cyberdeck AI Mechanical Specialist Knowledge Base & Response Engine

const BIKE_KNOWLEDGE_BASE = [
  {
    keywords: ["tubular", "tubulares", "pneu tubular", "tubular tire"],
    title: "Calibragem para Pneus Tubulares",
    response: "Pneus tubulares (colados diretamente no aro, comuns em ciclismo de estrada profissional e pista) operam com pressões mais altas, variando entre 110 PSI e 160 PSI (7.5 a 11 BAR), dependendo do peso do ciclista e da superfície da pista. Como não possuem câmara tradicional exposta às bordas do aro, eles suportam altíssima pressão com menor risco de furos por impacto."
  },
  {
    keywords: ["bomba", "bombas", "tipo de bomba", "qual bomba", "bomba de ar"],
    title: "Tipos de Bombas de Ar para Bicicleta",
    response: "Existem 4 tipos principais de bombas:\n1. Bomba de Pé (Oficina): Possui manômetro analógico/digital grande, câmara de ar dupla e permite inflar rápido até 160 PSI.\n2. Bomba de Mão Portátil: Leve e fixada no quadro da bike para emergências na estrada.\n3. Aplicador de CO2: Usa cartuchos de gás comprimido de 16g ou 25g para inflar o pneu em 2 segundos durante provas.\n4. Bomba Elétrica Portátil: Recarregável via USB com calibrador automático digital."
  },
  {
    keywords: ["tubeless", "sem camara", "selante", "macarrão", "plug"],
    title: "Calibragem e Cuidados com Pneus Tubeless",
    response: "Pneus Tubeless (sem câmara de ar, utilizando selante líquido interno) devem rodar com pressões menores que pneus comuns: geralmente entre 22 PSI e 35 PSI no MTB, e 65 a 85 PSI na estrada. A menor pressão aumenta a aderência no solo e o selante veda furos de até 3mm a 6mm automaticamente enquanto você roda!"
  },
  {
    keywords: ["presta", "schrader", "valvula", "válvula", "bico"],
    title: "Diferença entre Válvula Presta e Schrader",
    response: "• Válvula Presta (Fina/Francesa): Possui porca de trava no topo. Muito usada em bicicletas de estrada e MTB modernas. Requer desrosquear o pino antes de calibrar.\n• Válvula Schrader (Grossa/Automotiva): Mesma válvula usada em carros e motos. Possui pino mola central interno e é mais resistente."
  },
  {
    keywords: ["pressao", "pressão", "psi", "bar", "calibrar", "tabela", "peso"],
    title: "Tabela Geral de Calibragem por Categoria",
    response: "Diretrizes de Pressão (para ciclista de ~75kg):\n• Mountain Bike (Com câmara): 35 - 45 PSI\n• Mountain Bike (Tubeless): 25 - 35 PSI\n• Ciclismo de Estrada (Speed): 90 - 110 PSI\n• Gravel / Urbana: 45 - 65 PSI\n• E-Bike (Elétrica): 45 - 55 PSI (devido ao peso extra do motor/bateria)."
  }
];

export async function askCyberdeckAI(userQuery) {
  // Simulate network latency for AI thinking feel
  await new Promise(resolve => setTimeout(resolve, 800));

  if (!userQuery || userQuery.trim() === '') {
    return "Por favor, digite ou fale uma dúvida sobre mecânica, calibragem ou equipamentos de bicicleta.";
  }

  const queryLower = userQuery.toLowerCase().trim();

  // Search Knowledge Base matches
  for (const item of BIKE_KNOWLEDGE_BASE) {
    if (item.keywords.some(kw => queryLower.includes(kw))) {
      return item.response;
    }
  }

  // Fallback intelligent response for general bike mechanical inquiries
  return `Analisando a dúvida: "${userQuery}"...\n\nRecomendação da Oficina Cyberdeck: Para garantir o desempenho ideal e segurança, verifique sempre o limite máximo de PSI gravado na lateral de borracha do pneu. Se for utilizar bombas portáteis na estrada, certifique-se de carregar um adaptador de válvula Presta/Schrader. Deseja detalhes sobre calibragem Tubeless, Tubulares ou tipos de manômetro?`;
}
