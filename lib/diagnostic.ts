export type DiagnosisInput = {
  sleepPosition: 'side' | 'back' | 'stomach' | 'mixed';
  firmnessChoice: 'soft' | 'medium' | 'firm';
  usage: 'daily' | 'guest';
  sleepsWithPartner: boolean;
  heatSensitivity: 'low' | 'medium' | 'high';
  painComplaint?: string;
};

export type DiagnosisResult = {
  profile: string;
  recommendation: string;
  rationale: string;
  salesQuestions: string[];
};

export function runSleepDiagnosis(input: DiagnosisInput): DiagnosisResult {
  let support = 0;
  let pressureRelief = 0;
  let cooling = 0;
  let motionIsolation = 0;

  if (input.sleepPosition === 'side') pressureRelief += 3;
  if (input.sleepPosition === 'back') support += 2;
  if (input.sleepPosition === 'stomach') support += 3;
  if (input.sleepPosition === 'mixed') { support += 2; pressureRelief += 2; }

  if (input.firmnessChoice === 'firm') support += 2;
  if (input.firmnessChoice === 'soft') pressureRelief += 2;
  if (input.firmnessChoice === 'medium') { support += 1; pressureRelief += 1; }

  if (input.heatSensitivity === 'high') cooling += 3;
  if (input.heatSensitivity === 'medium') cooling += 1;
  if (input.sleepsWithPartner) motionIsolation += 3;
  if (input.painComplaint?.trim()) support += 1;

  const needs = [
    ['suporte', support],
    ['alívio de pressão', pressureRelief],
    ['controle térmico', cooling],
    ['isolamento de movimento', motionIsolation],
  ].sort((a, b) => Number(b[1]) - Number(a[1]));

  const top = needs.slice(0, 2).map(([name]) => name).join(' + ');
  const profile = `Prioridade: ${top}`;

  let recommendation = 'Conforto intermediário com suporte equilibrado';
  if (cooling >= 3 && support >= 3) recommendation = 'Modelo firme/intermediário com tecnologia de controle térmico';
  else if (pressureRelief >= 4) recommendation = 'Modelo de conforto intermediário a macio, com boa adaptação aos pontos de pressão';
  else if (support >= 4) recommendation = 'Modelo de maior sustentação, mantendo conforto de superfície';
  else if (motionIsolation >= 3) recommendation = 'Modelo com boa independência de lados e estabilidade para casal';

  const rationale = `A recomendação foi baseada no modo de dormir, preferência de conforto e condições de uso. O vendedor deve confirmar a sensação do cliente no teste do colchão; o diagnóstico orienta a conversa, mas não substitui avaliação profissional de saúde.`;

  return {
    profile,
    recommendation,
    rationale,
    salesQuestions: [
      'O que fez você decidir trocar seu colchão agora?',
      'O que mais incomoda no colchão atual?',
      'Você prefere sentir o colchão acolhendo o corpo ou sustentando com mais firmeza?',
      'Você costuma sentir calor durante a noite?',
      input.sleepsWithPartner ? 'Quando a outra pessoa se mexe, isso costuma atrapalhar seu sono?' : 'Esse colchão será usado só por você?',
    ],
  };
}
