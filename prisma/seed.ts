import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const partners = [
    { name: 'Ideal Móveis', status: 'ACTIVE' as const, potential: 5, notes: 'Parceiro estratégico para showroom, treinamento e expansão de mix.' },
    { name: 'Ponto dos Colchões', city: 'Porto Velho', status: 'ACTIVE' as const, potential: 5, notes: 'Rede especializada com oportunidade de ampliar mix e giro.' },
    { name: 'Ivan Móveis', status: 'ACTIVE' as const, potential: 4, notes: 'Parceiro com novos produtos introduzidos.' },
    { name: 'NovaLar', city: 'Porto Velho', status: 'ACTIVE' as const, potential: 4, notes: 'Foco em campanhas, capacitação e conversão.' },
  ];

  for (const partner of partners) {
    await prisma.partner.upsert({ where: { name: partner.name }, update: partner, create: partner });
  }

  for (const seller of [
    { name: 'Maique', region: 'Rondônia' },
    { name: 'Jean Lewinsky', region: 'Rondônia' },
  ]) {
    await prisma.seller.upsert({ where: { name: seller.name }, update: seller, create: seller });
  }

  const products = [
    { name: 'Sofia', category: 'Colchão', firmness: 3, idealFor: 'Clientes que buscam equilíbrio entre conforto e valor.' },
    { name: 'Extreme Resistência', category: 'Espuma', firmness: 5, technology: 'Tecido Pro Ice', benefits: 'Firmeza, conforto e auxílio no controle da sensação térmica.', idealFor: 'Clientes que preferem colchão firme.' },
    { name: 'Aurora', category: 'Colchão', firmness: 3, idealFor: 'Uso diário com conforto equilibrado.' },
    { name: 'Vegas', category: 'Colchão', firmness: 3, idealFor: 'Clientes que buscam conforto e bom posicionamento de valor.' },
  ];

  for (const product of products) {
    await prisma.product.upsert({ where: { name: product.name }, update: product, create: product });
  }

  const ideal = await prisma.partner.findUnique({ where: { name: 'Ideal Móveis' } });
  const ponto = await prisma.partner.findUnique({ where: { name: 'Ponto dos Colchões' } });
  const extreme = await prisma.product.findUnique({ where: { name: 'Extreme Resistência' } });

  if (ideal && (await prisma.opportunity.count({ where: { partnerId: ideal.id, title: 'Expandir mix estratégico' } })) === 0) {
    await prisma.opportunity.create({ data: { title: 'Expandir mix estratégico', partnerId: ideal.id, priority: 5, nextAction: 'Revisar giro atual e selecionar produtos para próxima introdução.' } });
  }

  if (ponto && extreme && (await prisma.opportunity.count({ where: { partnerId: ponto.id, title: 'Treinamento Extreme Resistência' } })) === 0) {
    await prisma.opportunity.create({ data: { title: 'Treinamento Extreme Resistência', partnerId: ponto.id, productId: extreme.id, priority: 4, nextAction: 'Agendar treinamento de argumentos, diagnóstico e objeções.' } });
  }
}

main().finally(async () => prisma.$disconnect());
