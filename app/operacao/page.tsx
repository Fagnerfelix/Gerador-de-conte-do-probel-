'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Partner = { id: string; name: string; city?: string; potential: number; _count?: { opportunities: number; visits: number } };
type Seller = { id: string; name: string; region?: string; monthlyGoal?: string | number | null };
type Product = { id: string; name: string; category?: string; technology?: string };
type Opportunity = { id: string; title: string; priority: number; nextAction?: string; partner: Partner; product?: Product };

export default function OperacaoPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [message, setMessage] = useState('');

  async function load() {
    const [p, s, pr, o] = await Promise.all(['partners','sellers','products','opportunities'].map(resource => fetch(`/api/commercial-data?resource=${resource}`).then(r => r.json())));
    if (Array.isArray(p)) setPartners(p);
    if (Array.isArray(s)) setSellers(s);
    if (Array.isArray(pr)) setProducts(pr);
    if (Array.isArray(o)) setOpportunities(o);
  }

  useEffect(() => { load(); }, []);

  async function save(resource: string, data: Record<string, unknown>, form?: HTMLFormElement) {
    setMessage('Salvando...');
    const response = await fetch(`/api/commercial-data?resource=${resource}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const result = await response.json();
    setMessage(response.ok ? 'Salvo com sucesso.' : result.error || 'Erro ao salvar.');
    if (response.ok) { form?.reset(); await load(); }
  }

  return <main className="main page">
    <div className="topbar"><Link href="/">← Visão Executiva</Link><Link href="/diagnostico">Diagnóstico de Sono</Link></div>
    <header className="header"><div className="eyebrow">Base comercial</div><h1>Operação Comercial</h1><p>Cadastre parceiros, vendedores, produtos, oportunidades e visitas. Esses dados serão a memória do Diretor Comercial IA.</p></header>
    {message && <div className="flash">{message}</div>}

    <section className="three-columns">
      <form className="panel compact-form" onSubmit={e => { e.preventDefault(); const f = new FormData(e.currentTarget); save('partners', Object.fromEntries(f), e.currentTarget); }}>
        <h2>Novo parceiro</h2><input name="name" placeholder="Nome da empresa" required /><input name="city" placeholder="Cidade" /><input name="contactName" placeholder="Contato principal" /><input name="phone" placeholder="Telefone" /><select name="potential" defaultValue="3"><option value="3">Potencial médio</option><option value="4">Potencial alto</option><option value="5">Potencial estratégico</option></select><textarea name="notes" placeholder="Contexto, oportunidades, observações" /><button>Salvar parceiro</button>
      </form>

      <form className="panel compact-form" onSubmit={e => { e.preventDefault(); const f = new FormData(e.currentTarget); save('sellers', Object.fromEntries(f), e.currentTarget); }}>
        <h2>Novo vendedor</h2><input name="name" placeholder="Nome" required /><input name="region" placeholder="Região" /><input name="monthlyGoal" type="number" min="0" step="0.01" placeholder="Meta mensal em R$" /><button>Salvar vendedor</button>
      </form>

      <form className="panel compact-form" onSubmit={e => { e.preventDefault(); const f = new FormData(e.currentTarget); save('products', Object.fromEntries(f), e.currentTarget); }}>
        <h2>Novo produto</h2><input name="name" placeholder="Nome do produto" required /><input name="category" placeholder="Categoria" /><select name="firmness" defaultValue="3"><option value="2">Mais macio</option><option value="3">Intermediário</option><option value="4">Firme</option><option value="5">Muito firme</option></select><input name="technology" placeholder="Tecnologia / diferencial" /><textarea name="benefits" placeholder="Benefícios" /><textarea name="idealFor" placeholder="Perfil ideal de cliente" /><button>Salvar produto</button>
      </form>
    </section>

    <section className="content section-gap">
      <form className="panel compact-form" onSubmit={e => { e.preventDefault(); const f = new FormData(e.currentTarget); save('opportunities', Object.fromEntries(f), e.currentTarget); }}>
        <h2>Nova oportunidade</h2><input name="title" placeholder="Ex.: Introduzir novo produto" required /><select name="partnerId" required defaultValue=""><option value="" disabled>Selecione o parceiro</option>{partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select><select name="productId" defaultValue=""><option value="">Produto opcional</option>{products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select><select name="priority" defaultValue="3"><option value="3">Prioridade média</option><option value="4">Prioridade alta</option><option value="5">Prioridade crítica</option></select><input name="value" type="number" min="0" step="0.01" placeholder="Valor potencial em R$" /><textarea name="nextAction" placeholder="Qual é o próximo passo concreto?" /><button>Salvar oportunidade</button>
      </form>

      <form className="panel compact-form" onSubmit={e => { e.preventDefault(); const f = new FormData(e.currentTarget); save('visits', Object.fromEntries(f), e.currentTarget); }}>
        <h2>Registrar visita</h2><select name="partnerId" required defaultValue=""><option value="" disabled>Parceiro visitado</option>{partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select><select name="sellerId" defaultValue=""><option value="">Vendedor responsável</option>{sellers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select><select name="type" defaultValue="COMMERCIAL"><option value="COMMERCIAL">Comercial</option><option value="TRAINING">Treinamento</option><option value="SHOWROOM">Showroom</option><option value="FOLLOW_UP">Acompanhamento</option></select><textarea name="summary" required placeholder="O que aconteceu na visita?" /><textarea name="nextStep" placeholder="Próximo passo" /><button>Registrar visita</button>
      </form>
    </section>

    <section className="content section-gap">
      <div className="panel"><h2>Parceiros</h2><div className="partners">{partners.map(p => <div className="partner" key={p.id}><div><strong>{p.name}</strong><div className="muted">{p.city || 'Cidade não informada'} · Potencial {p.potential}/5</div></div><span className="status">{p._count?.opportunities || 0} oportunidades</span></div>)}</div></div>
      <div className="panel"><h2>Prioridades abertas</h2><div className="partners">{opportunities.map(o => <div className="partner" key={o.id}><div><strong>{o.title}</strong><div className="muted">{o.partner.name}{o.product ? ` · ${o.product.name}` : ''}</div></div><span className="priority">P{o.priority}</span></div>)}</div></div>
    </section>
  </main>;
}
