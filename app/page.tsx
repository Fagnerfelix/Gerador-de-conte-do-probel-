'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Priority = { id: string; title: string; priority: number; nextAction?: string; partner: { name: string }; product?: { name: string } };
type Dashboard = { partners: number; sellers: number; products: number; openOpportunities: number; priorities: Priority[] };

export default function Home() {
  const [question, setQuestion] = useState('Qual parceiro merece mais atenção comercial esta semana?');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState<Dashboard>({ partners: 0, sellers: 0, products: 0, openOpportunities: 0, priorities: [] });
  const [databaseReady, setDatabaseReady] = useState(true);

  useEffect(() => {
    fetch('/api/commercial-data?resource=dashboard').then(async response => {
      const data = await response.json();
      if (response.ok) setDashboard(data); else setDatabaseReady(false);
    }).catch(() => setDatabaseReady(false));
  }, []);

  async function askAI() {
    setLoading(true);
    setAnswer('');
    try {
      const context = dashboard.priorities.map(p => `${p.partner.name}: ${p.title}. Próxima ação: ${p.nextAction || 'não definida'}`).join('\n');
      const response = await fetch('/api/commercial-ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: `${question}\n\nPrioridades atuais do sistema:\n${context || 'Nenhuma prioridade cadastrada.'}` }) });
      const data = await response.json();
      setAnswer(data.answer || data.error || 'Não foi possível gerar a análise.');
    } catch {
      setAnswer('Erro ao conectar com o Diretor Comercial IA.');
    } finally { setLoading(false); }
  }

  return <div className="shell">
    <aside className="sidebar"><div className="brand">DIRETOR COMERCIAL IA<span>Inteligência Probel</span></div><nav className="nav"><Link href="/">Visão Executiva</Link><Link href="/operacao">Operação Comercial</Link><Link href="/diagnostico">Diagnóstico de Sono</Link><a href="#ai">IA Comercial</a></nav></aside>
    <main className="main">
      <header className="header"><div className="eyebrow">Central de inteligência comercial</div><h1>Onde devemos agir agora?</h1><p>Transforme parceiros, produtos, vendedores, visitas e oportunidades em uma rotina comercial orientada por prioridade e próximo passo.</p></header>
      {!databaseReady && <div className="flash warning">Banco ainda não conectado. Configure DATABASE_URL, rode as migrações e a carga inicial para ativar os indicadores.</div>}
      <section className="grid"><div className="card"><div className="label">Parceiros ativos</div><div className="metric">{dashboard.partners}</div></div><div className="card"><div className="label">Oportunidades abertas</div><div className="metric">{dashboard.openOpportunities}</div></div><div className="card"><div className="label">Produtos ativos</div><div className="metric">{dashboard.products}</div></div><div className="card"><div className="label">Vendedores ativos</div><div className="metric">{dashboard.sellers}</div></div></section>
      <section className="content"><div className="panel"><div className="panel-title"><div><div className="eyebrow">Fila de ação</div><h2>Prioridades comerciais</h2></div><Link className="text-link" href="/operacao">Gerenciar →</Link></div><div className="partners">{dashboard.priorities.length === 0 ? <p className="muted">Cadastre oportunidades para formar sua fila de prioridades.</p> : dashboard.priorities.map(item => <div className="partner" key={item.id}><div><strong>{item.title}</strong><div className="muted">{item.partner.name}{item.product ? ` · ${item.product.name}` : ''}</div><div className="next-action">{item.nextAction || 'Próxima ação não definida'}</div></div><span className="priority">P{item.priority}</span></div>)}</div></div>
      <div className="panel ai" id="ai"><div className="eyebrow">Copiloto executivo</div><h2>Converse com seu Diretor Comercial IA</h2><p className="muted">A IA recebe também a fila atual de prioridades para responder com mais contexto.</p><textarea value={question} onChange={e => setQuestion(e.target.value)} /><button onClick={askAI} disabled={loading || !question.trim()}>{loading ? 'Analisando...' : 'Gerar recomendação'}</button>{answer && <div className="answer">{answer}</div>}</div></section>
      <section className="quick-actions"><Link className="action-card" href="/operacao"><strong>Atualizar operação</strong><span>Parceiros, produtos, vendedores, oportunidades e visitas →</span></Link><Link className="action-card" href="/diagnostico"><strong>Fazer diagnóstico</strong><span>Entender primeiro como o cliente dorme →</span></Link></section>
    </main>
  </div>;
}