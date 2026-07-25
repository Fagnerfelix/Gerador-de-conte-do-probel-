import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const resource = request.nextUrl.searchParams.get('resource');
  try {
    if (resource === 'partners') return NextResponse.json(await prisma.partner.findMany({ orderBy: { name: 'asc' }, include: { _count: { select: { opportunities: true, visits: true } } } }));
    if (resource === 'sellers') return NextResponse.json(await prisma.seller.findMany({ orderBy: { name: 'asc' } }));
    if (resource === 'products') return NextResponse.json(await prisma.product.findMany({ where: { active: true }, orderBy: { name: 'asc' } }));
    if (resource === 'opportunities') return NextResponse.json(await prisma.opportunity.findMany({ orderBy: [{ priority: 'desc' }, { updatedAt: 'desc' }], include: { partner: true, product: true } }));
    if (resource === 'visits') return NextResponse.json(await prisma.visit.findMany({ orderBy: { occurredAt: 'desc' }, take: 50, include: { partner: true, seller: true } }));
    if (resource === 'dashboard') {
      const [partners, sellers, products, openOpportunities, recent] = await Promise.all([
        prisma.partner.count({ where: { status: 'ACTIVE' } }),
        prisma.seller.count({ where: { active: true } }),
        prisma.product.count({ where: { active: true } }),
        prisma.opportunity.count({ where: { status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
        prisma.opportunity.findMany({ where: { status: { in: ['OPEN', 'IN_PROGRESS'] } }, orderBy: [{ priority: 'desc' }, { updatedAt: 'desc' }], take: 5, include: { partner: true, product: true } }),
      ]);
      return NextResponse.json({ partners, sellers, products, openOpportunities, priorities: recent });
    }
    return NextResponse.json({ error: 'Recurso inválido.' }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Banco de dados indisponível. Verifique DATABASE_URL e as migrações.' }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  const resource = request.nextUrl.searchParams.get('resource');
  const body = await request.json();
  try {
    if (resource === 'partners') {
      if (!body.name?.trim()) return NextResponse.json({ error: 'Nome do parceiro é obrigatório.' }, { status: 400 });
      return NextResponse.json(await prisma.partner.create({ data: { name: body.name.trim(), city: body.city || null, state: body.state || 'RO', contactName: body.contactName || null, phone: body.phone || null, potential: Number(body.potential || 3), notes: body.notes || null } }), { status: 201 });
    }
    if (resource === 'sellers') {
      if (!body.name?.trim()) return NextResponse.json({ error: 'Nome do vendedor é obrigatório.' }, { status: 400 });
      return NextResponse.json(await prisma.seller.create({ data: { name: body.name.trim(), region: body.region || null, monthlyGoal: body.monthlyGoal ? Number(body.monthlyGoal) : null } }), { status: 201 });
    }
    if (resource === 'products') {
      if (!body.name?.trim()) return NextResponse.json({ error: 'Nome do produto é obrigatório.' }, { status: 400 });
      return NextResponse.json(await prisma.product.create({ data: { name: body.name.trim(), category: body.category || null, firmness: body.firmness ? Number(body.firmness) : null, technology: body.technology || null, benefits: body.benefits || null, objections: body.objections || null, idealFor: body.idealFor || null } }), { status: 201 });
    }
    if (resource === 'opportunities') {
      if (!body.title?.trim() || !body.partnerId) return NextResponse.json({ error: 'Título e parceiro são obrigatórios.' }, { status: 400 });
      return NextResponse.json(await prisma.opportunity.create({ data: { title: body.title.trim(), partnerId: body.partnerId, productId: body.productId || null, value: body.value ? Number(body.value) : null, priority: Number(body.priority || 3), nextAction: body.nextAction || null, dueDate: body.dueDate ? new Date(body.dueDate) : null } }), { status: 201 });
    }
    if (resource === 'visits') {
      if (!body.partnerId || !body.summary?.trim()) return NextResponse.json({ error: 'Parceiro e resumo são obrigatórios.' }, { status: 400 });
      return NextResponse.json(await prisma.visit.create({ data: { partnerId: body.partnerId, sellerId: body.sellerId || null, summary: body.summary.trim(), nextStep: body.nextStep || null, type: body.type || 'COMMERCIAL', occurredAt: body.occurredAt ? new Date(body.occurredAt) : new Date() } }), { status: 201 });
    }
    return NextResponse.json({ error: 'Recurso inválido.' }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Não foi possível salvar. Verifique dados duplicados e conexão com o banco.' }, { status: 500 });
  }
}
