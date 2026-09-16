// Cyberdeck AI Mechanical Specialist Knowledge Base & Response Engine with YouTube Video Mapping

const BIKE_KNOWLEDGE_BASE = [
  {
    keywords: ["tubular", "tubulares", "pneu tubular", "tubular tire"],
    title: "Calibragem para Pneus Tubulares",
    response: "Pneus tubulares (colados diretamente no aro) operam entre 110 PSI e 160 PSI (7.5 a 11 BAR), dependendo do peso e da pista. Por não possuírem câmara solta, suportam alta pressão sem furos por impacto.",
    youtubeVideoId: "xndX18Xm0tI",
    youtubeTitle: "Tutorial: Como Montar e Calibrar Pneu Tubular"
  },
  {
    keywords: ["bomba", "bombas", "tipo de bomba", "qual bomba", "bomba de ar"],
    title: "Tipos de Bombas de Ar para Bicicleta",
    response: "Existem 4 tipos de bombas: 1. Bomba de Pé (Oficina); 2. Bomba de Mão Portátil; 3. Aplicador de CO2 (recarrega em 2s); 4. Bomba Elétrica Portátil USB.",
    youtubeVideoId: "3_5w5N1oJ4E",
    youtubeTitle: "Guia Completo: Como Escolher e Usar Bombas de Ar para Bike"
  },
  {
    keywords: ["tubeless", "sem camara", "selante", "macarrão", "plug"],
    title: "Calibragem e Cuidados com Pneus Tubeless",
    response: "Pneus Tubeless operam com menor pressão: 22 a 35 PSI no MTB e 65 a 85 PSI na estrada. O selante líquido veda furos de até 6mm automaticamente enquanto você roda!",
    youtubeVideoId: "GZ1H_C6v64g",
    youtubeTitle: "Como Instalar e Manter Pneus Tubeless"
  },
  {
    keywords: ["presta", "schrader", "valvula", "válvula", "bico"],
    title: "Diferença entre Válvula Presta e Schrader",
    response: "• Válvula Presta (Fina/Francesa): Possui porca de trava no topo. Desrosqueie o pino antes de calibrar.\n• Válvula Schrader (Grossa/Automotiva): Mesma usada em carros e motos, com pino mola central.",
    youtubeVideoId: "1Zt07TId8w8",
    youtubeTitle: "Como Usar a Bomba em Válvula Presta e Schrader"
  },
  {
    keywords: ["pressao", "pressão", "psi", "bar", "calibrar", "tabela", "peso"],
    title: "Tabela Geral de Calibragem por Categoria",
    response: "Diretrizes de Pressão (~75kg):\n• MTB (Com câmara): 35 - 45 PSI\n• MTB (Tubeless): 25 - 35 PSI\n• Estrada (Speed): 90 - 110 PSI\n• Urbana/Gravel: 45 - 65 PSI",
    youtubeVideoId: "eqrN-m-V81g",
    youtubeTitle: "Como Achar a Pressão Certa do Pneu da Bike"
  }
];

export async function askCyberdeckAI(userQuery) {
  // Simulate network latency for AI thinking feel
  await new Promise(resolve => setTimeout(resolve, 700));

  if (!userQuery || userQuery.trim() === '') {
    return {
      text: "Por favor, digite ou fale uma dúvida sobre mecânica, calibragem ou equipamentos de bicicleta.",
      youtubeVideoId: null,
      youtubeTitle: null
    };
  }

  const queryLower = userQuery.toLowerCase().trim();

  // Search Knowledge Base matches
  for (const item of BIKE_KNOWLEDGE_BASE) {
    if (item.keywords.some(kw => queryLower.includes(kw))) {
      return {
        text: item.response,
        youtubeVideoId: item.youtubeVideoId,
        youtubeTitle: item.youtubeTitle
      };
    }
  }

  // Fallback intelligent response for general bike mechanical inquiries
  return {
    text: `Analisando a dúvida: "${userQuery}"...\n\nRecomendação da Oficina: Para garantir desempenho e segurança, verifique o limite máximo de PSI gravado na lateral de borracha do pneu. Se usar bombas portáteis na estrada, carregue um adaptador Presta/Schrader.`,
    youtubeVideoId: "3_5w5N1oJ4E",
    youtubeTitle: "Tutorial Recomendado pela IA"
  };
}
