export const STEPS_DATA = [
  {
    id: 1,
    title: "Passo 1: Inspeção Inicial e Identificação da Válvula",
    subtitle: "Identificação do tipo de válvula (Presta ou Schrader) e remoção da tampa",
    duration: "1 min",
    safetyAlert: "Verifique se o pneu não possui furos grandes ou rasgos nas laterais antes de inflar.",
    narration: "Bem-vindo ao assistente Cyberdeck. Passo 1: Posicione a roda da bicicleta de forma que a válvula fique na parte inferior. Retire a tampa plástica da válvula e identifique se é o modelo Schrader grosso ou Presta fino.",
    voiceCommandHint: "Diga 'PRÓXIMO' para avançar quando a válvula estiver exposta.",
    tools: [
      "Bicicleta com Pneu",
      "Bomba de Ar (com conector compatível Schrader/Presta)",
      "Manômetro de Pressão (Integrado à bomba)"
    ],
    instructions: [
      "Gire a roda da bicicleta até que a válvula de ar fique acessível na posição de 6 horas (embaixo).",
      "Desrosqueie a tampa plástica protetora da válvula com os dedos.",
      "Identifique o tipo de válvula: Schrader (larga, como de carro) ou Presta (fina com porca de trava no topo).",
      "Inspecione a banda de rodagem do pneu buscando farpas ou pregos antes de calibrar."
    ],
    arOverlayType: "VALVE_SEARCH",
    tip: "A maioria das bombas de piso modernas possui cabeça dupla ou bico reversível que atende válvulas Schrader e Presta!"
  },
  {
    id: 2,
    title: "Passo 2: Liberação e Preparação da Válvula",
    subtitle: "Destravamento do pino de vedação (Válvula Presta) ou teste do pino",
    duration: "1 min",
    safetyAlert: "Em válvulas Presta, não desrosqueie a porca da ponta totalmente até sair.",
    narration: "Passo 2: Se a bicicleta utiliza válvula Presta fina, desrosqueie a porca da ponta no sentido anti-horário e dê um leve toque com o dedo para soltar um sopro de ar.",
    voiceCommandHint: "Diga 'PRÓXIMO' após liberar o pino da válvula.",
    tools: [
      "Válvula Presta / Schrader"
    ],
    instructions: [
      "Em válvula Presta: desrosqueie a porquinha serrilhada no topo da haste metálica.",
      "Pressione levemente o pino com a ponta do dedo por 1 segundo até ouvir um escape rápido de ar ('psst'). Isso libera a vedação interna.",
      "Em válvula Schrader: apenas confirme que o pino interno está limpo e sem poeira."
    ],
    arOverlayType: "VALVE_UNSCREW",
    tip: "Se você não dar o toque no pino da válvula Presta antes de encaixar a bomba, o ar pode não entrar!"
  },
  {
    id: 3,
    title: "Passo 3: Encaixe do Bico da Bomba e Trava",
    subtitle: "Conexão hermética da cabeça da bomba com alavanca de retenção",
    duration: "2 min",
    safetyAlert: "Pressione o bico reto sem dobrar a haste fina da válvula.",
    narration: "Passo 3: Empurre o bico da bomba firmemente reto sobre a válvula até o fundo. Em seguida, levante ou empurre a alavanca de trava para selar a saída de ar.",
    voiceCommandHint: "Diga 'PRÓXIMO' assim que a bomba estiver travada.",
    tools: [
      "Bomba de Pé ou de Mão",
      "Alavanca de Trava do Bico"
    ],
    instructions: [
      "Alinhe o bico da bomba perfeitamente paralelo à haste da válvula.",
      "Pressione com firmeza para baixo até que o bico engate profundamente na válvula.",
      "Acione a alavanca de trava do bico (na maioria das bombas de pé, puxa-se a alavanca para cima a 90°).",
      "Dê uma leve puxada para confirmar que o bico não vai escapulir durante o bombeamento."
    ],
    arOverlayType: "PUMP_ATTACH",
    tip: "Se ouvir ar vazando continuamente ao encaixar, solte a trava, empurre o bico um pouco mais fundo e trave novamente."
  },
  {
    id: 4,
    title: "Passo 4: Bombeamento e Calibragem de Pressão (PSI)",
    subtitle: "Inflagem contínua monitorando a pressão recomendada no manômetro",
    duration: "3 min",
    safetyAlert: "Nunca ultrapasse o PSI máximo impresso na lateral de borracha do pneu.",
    narration: "Passo 4: Bombeie o ar continuamente observando o manômetro. Para pneus MTB use entre 30 e 45 PSI. Para pneus de estrada insuflar entre 80 e 110 PSI.",
    voiceCommandHint: "Diga 'CAPTURAR' para registrar a foto da pressão ou 'PRÓXIMO' ao atingir o PSI ideal.",
    tools: [
      "Bomba de Ar",
      "Manômetro Dial / Digital em PSI e BAR"
    ],
    instructions: [
      "Leia a indicação de pressão máxima (ex: MAX 65 PSI ou 4.5 BAR) estampada na lateral do pneu.",
      "Opere a bomba com movimentos longos e constantes de cima para baixo.",
      "Monitore o ponteiro do manômetro subir gradativamente.",
      "Para MTB / Urbana: Acalibre entre 30 a 50 PSI. Para Road/Speed: 80 a 110 PSI."
    ],
    arOverlayType: "PSI_GAUGE",
    tip: "Pneus mais murchos dão mais conforto porém aumentam o risco de furar por impacto (mordida de cobra); pneus mais cheios rolam mais rápido no asfalto!"
  },
  {
    id: 5,
    title: "Passo 5: Remoção Rápida da Bomba e Aperto da Válvula",
    subtitle: "Desconectar o bico sem perder pressão e reapertar porca Presta",
    duration: "1 min",
    safetyAlert: "Abra a alavanca de trava antes de puxar o bico da bomba.",
    narration: "Passo 5: Destrave a alavanca da bomba e puxe o bico rapidamente para fora. Se a válvula for Presta, reaperte a porquinha no topo no sentido horário.",
    voiceCommandHint: "Diga 'PRÓXIMO' para fazer a checagem de vedação final.",
    tools: [
      "Válvula da Bicicleta"
    ],
    instructions: [
      "Abaixe a alavanca de trava da cabeça da bomba.",
      "Puxe o bico com um movimento rápido e reto em direção oposta à roda.",
      "Se for válvula Presta: rosquie a porca de trava no topo da haste até ficar firme (sentido horário).",
      "Confirme que não há som de assobio de escape de ar."
    ],
    arOverlayType: "VALVE_LOCK",
    tip: "Um pequeno espirro de ar ao retirar o bico é normal — é apenas o ar acumulado dentro da mangueira da bomba saindo!"
  },
  {
    id: 6,
    title: "Passo 6: Recolocação da Tampa e Teste de Firmeza ao Toque",
    subtitle: "Proteção contra poeira e inspeção tátil do pneu",
    duration: "1 min",
    safetyAlert: "Pneu calibrado! Teste o freio e verifique se o pneu assentou no aro.",
    narration: "Parabéns! Passo 6 concluído. Rosqueie a tampa plástica da válvula e apalpe o pneu com os dedos para sentir a firmeza. Sua bicicleta está pronta para rodar!",
    voiceCommandHint: "Diga 'REPETIR' para ouvir a conclusão ou 'REINICIAR' para outro pneu.",
    tools: [
      "Tampa da Válvula",
      "Inspeção Tátil"
    ],
    instructions: [
      "Rosqueie a tampinha de plástico preta/transparente de volta na válvula.",
      "Aperte as laterais do pneu com o polegar: o pneu deve estar bem firme com pouca deformação.",
      "Gire a roda e certifique-se de que o pneu está perfeitamente assentado dentro da borda do aro sem deformidades.",
      "Instalação e enchimento do pneu concluídos com sucesso!"
    ],
    arOverlayType: "TIRE_CHECK",
    tip: "Verifique a pressão dos pneus a cada 1 a 2 semanas, pois as câmaras de ar de bicicleta perdem cerca de 1 a 3 PSI naturalmente por semana!"
  }
];
