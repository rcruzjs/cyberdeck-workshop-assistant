import { STEPS_DATA as BIKE_TIRE_STEPS } from './stepsData';
import { getCustomProcedures } from './procedureImporter';

const SYSTEM_PROCEDURES = [
  {
    id: 'bike_tire_inflation',
    category: 'BICICLETA',
    title: 'Enchimento e Calibragem de Pneu de Bicicleta',
    description: 'Instrução viva-voz com manômetro digital e enquadramento de válvula Presta/Schrader',
    steps: BIKE_TIRE_STEPS
  },
  {
    id: 'ssd_notebook_mount',
    category: 'ELETRÔNICOS',
    title: 'Montagem de SSD Portátil na Tampa do Notebook',
    description: 'Fixação de SSD M.2 externo com fita Dual-Lock 3M e cabo USB-C angular 90°',
    steps: [
      {
        id: 1,
        title: "Passo 1: Preparação do Material e Limpeza",
        subtitle: "Higienização da superfície com álcool isopropílico 70%",
        duration: "2 min",
        safetyAlert: "Desligue o notebook e desconecte a tomada antes de higienizar a tampa.",
        narration: "Passo 1: Desligue o notebook e limpe a tampa traseira com pano de microfibra e álcool isopropílico para remover poeira e gordura.",
        voiceCommandHint: "Diga 'PRÓXIMO' quando a superfície estiver seca.",
        tools: ["Álcool Isopropílico 70%+", "Pano de Microfibra limpo", "SSD Portátil", "Fita 3M Dual-Lock", "Cabo USB-C 90° curto"],
        instructions: [
          "Desligue o notebook e remova os cabos de energia.",
          "Passe o pano com álcool isopropílico na metade superior da tampa.",
          "Limpe a face posterior do SSD portátil.",
          "Aguarde 30 segundos até evaporar completamente."
        ],
        arOverlayType: "GRID_CLEANING",
        tip: "A limpeza é essencial para ativar a cola do suporte Dual-Lock 3M."
      },
      {
        id: 2,
        title: "Passo 2: Estudo de Posicionamento e Alcance do Cabo",
        subtitle: "Mapeamento da tampa traseira evitando dobradiças",
        duration: "2 min",
        safetyAlert: "Evite a zona da dobradiça e saídas de ar da tela.",
        narration: "Passo 2: Posicione o SSD na tampa sem colar ainda e teste se o cabo USB-C angular de 90 graus alcança a tomada do notebook sem forçar.",
        voiceCommandHint: "Diga 'PRÓXIMO' ao alinhar o cabo.",
        tools: ["SSD Portátil", "Cabo USB-C 90° curto"],
        instructions: [
          "Coloque o SSD sem colar no centro-superior da tampa.",
          "Plugue o cabo no SSD e estenda até a porta USB-C lateral.",
          "Confirme que a tampa abre e fecha sem esticar o cabo."
        ],
        arOverlayType: "ALIGNMENT_CROSSHAIR",
        tip: "O cabo angular de 90° evita que a tomada seja dobrada dentro da mochila."
      },
      {
        id: 3,
        title: "Passo 3: Aplicação da Fita 3M Dual-Lock",
        subtitle: "Fixação dos lados A e B na tampa e no SSD",
        duration: "3 min",
        safetyAlert: "Pressione com firmeza por 30 segundos para curar a cola.",
        narration: "Passo 3: Cole a fita Dual-Lock na tampa e o outro lado no SSD. Pressione firmemente ambos os pontos por trinta segundos.",
        voiceCommandHint: "Diga 'PRÓXIMO' após pressionar o adesivo.",
        tools: ["Fita 3M Dual-Lock"],
        instructions: [
          "Remova a película e cole o lado A na tampa do notebook.",
          "Cole o lado B no verso do SSD portátil.",
          "Pressione com os polegares por 30 segundos seguidos."
        ],
        arOverlayType: "ADHESIVE_TARGET",
        tip: "O Dual-Lock usa cogumelos plásticos intertravados que não balançam."
      },
      {
        id: 4,
        title: "Passo 4: Acoplamento e Conexão do Cabo 90°",
        subtitle: "Encaixe firme do SSD e clipe de retenção de cabo",
        duration: "2 min",
        safetyAlert: "Procedimento de montagem concluído com sucesso!",
        narration: "Passo 4: Pressione o SSD até ouvir o travamento do Dual-Lock e conecte o cabo USB-C. Seu armazenamento portátil está pronto!",
        voiceCommandHint: "Diga 'CAPTURAR' para registrar a foto ou 'REINICIAR' para voltar.",
        tools: ["Clipe adesivo para cabo", "Cabo USB-C 90°"],
        instructions: [
          "Pressione o SSD contra o suporte colado até ouvir o estalo de travamento.",
          "Conecte o cabo USB-C 90° no SSD e na tomada do notebook.",
          "Fixe o clipe de alívio de tensão do cabo na tampa."
        ],
        arOverlayType: "SSD_BOUNDING_BOX",
        tip: "Seu notebook agora possui armazenamento expansível acoplado à carcaça sem cabos pendurados!"
      }
    ]
  },
  {
    id: 'chain_maintenance',
    category: 'BICICLETA',
    title: 'Limpeza e Lubrificação da Corrente de Transmissão',
    description: 'Higienização de elos da corrente com desengraxante e aplicação de lubrificante cera/óleo',
    steps: [
      {
        id: 1,
        title: "Passo 1: Aplicação do Desengraxante",
        subtitle: "Remoção de sujeira e resíduos antigos da corrente",
        duration: "3 min",
        safetyAlert: "Proteja o disco de freio para não contaminar com óleo.",
        narration: "Passo 1: Aplique desengraxante cítrico nos elos da corrente girando o pedivela para trás. Esfregue com escova própria.",
        voiceCommandHint: "Diga 'PRÓXIMO' após escovar a corrente.",
        tools: ["Desengraxante Cítrico", "Escova de Corrente", "Pano limpo"],
        instructions: [
          "Aplique o desengraxante por toda a extensão da corrente.",
          "Gire o pedivela para trás enquanto passa a escova de elos.",
          "Retire a graxa preta acumulada com um pano limpo."
        ],
        arOverlayType: "GRID_CLEANING",
        tip: "Nunca deixe desengraxante nos discos de freio hidráulico!"
      },
      {
        id: 2,
        title: "Passo 2: Aplicação do Lubrificante de Cera",
        subtitle: "Gota a gota no interior de cada pino da corrente",
        duration: "3 min",
        safetyAlert: "Retire o excesso com pano limpo. Não rode com excesso de óleo.",
        narration: "Passo 2: Aplique uma gota de lubrificante em cada pino interno da corrente girando o pedivela. Remova o excesso com pano limpo.",
        voiceCommandHint: "Diga 'PRÓXIMO' para concluir a manutenção.",
        tools: ["Lubrificante de Cera / Óleo Seco"],
        instructions: [
          "Aplique 1 gota no rolete de cada elo interno da corrente.",
          "Gire o pedivela para trás por 10 voltas para penetrar no pino.",
          "Passe o pano levemente nas laterais para tirar o excesso."
        ],
        arOverlayType: "TIRE_CHECK",
        tip: "Lubrificante de cera mantém a corrente limpa sem juntar areia na trilha!"
      }
    ]
  }
];

export function getProceduresRegistry() {
  const custom = getCustomProcedures();
  return [...SYSTEM_PROCEDURES, ...custom];
}

export const PROCEDURES_REGISTRY = getProceduresRegistry();

