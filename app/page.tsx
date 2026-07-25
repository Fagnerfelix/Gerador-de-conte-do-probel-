'use client';

import { useState } from 'react';

const partners = [
  ['Ideal Móveis', 'Parceiro estratégico'],
  ['Ponto dos Colchões', 'Expansão de mix'],
  ['Ivan Móveis', 'Novos produtos'],
  ['NovaLar', 'Campanhas e conversão'],
];

export default function Home() {
  const [question, setQuestion] = useState('Qual parceiro merece mais atenção comercial esta semana?');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  async function askAI() {
    setLoading(true);
    setAnswer('');
    try {
      const response = await fetch('/api/commercial-ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question }) });
      const data = await response.json();
      setAnswer(data.answer || data.error || 'Não foi possível gerar a análise.');
    } catch {
      setAnswer('Erro ao conectar com o Diretor Comercial IA.');
    } finally { setLoading(false); }
  }

  return <div className="shell">
    <aside className="sidebar"><div className="brand">DIRETOR COMERCIAL IA<span>Inteligência Probel</span></div><nav className="nav"><a href="#">Visão Executiva</a><a href="#partners">Parceiros</a><a href="#">Produtos</a><a href="#ai">IA Comercial</a></nav></aside>
    <main className="main">
      <header className="header"><div className="eyebrow">Central de inteligência comercial</div><h1>Bom dia. Onde devemos agir?</h1><p>Uma visão única para transformar dados de parceiros, produtos, vendedores e mercado em decisões comerciais práticas.</p></header>
      <section className="grid"><div className="card"><div className="label">Parceiros ativos</div><div className="metric">4</div></div><div className="card"><div className="label">Oportunidades abertas</div><div className="metric">8</div></div><div className="card"><div className="label">Produtos estratégicos</div><div className="metric">12</div></div><div className="card"><div className="label">Prioridade</div><div className="metric">Crescer</div></div></section>
      <section className="content"><div className="panel" id="partners"><h2>Parceiros estratégicos</h2><div className="partners">{partners.map(([name, action]) => <div className="partner" key={name}><strong>{name}</strong><span className="status">{action}</span></div>)}</div></div>
      <div className="panel ai" id="ai"><div className="eyebrow">Copiloto executivo</div><h2>Converse com seu Diretor Comercial IA</h2><textarea value={question} onChange={e => setQuestion(e.target.value)} /><button onClick={askAI} disabled={loading || !question.trim()}>{loading ? 'Analisando...' : 'Gerar recomendação'}</button>{answer && <div className="answer">{answer}</div>}</div></section>
    </main>
  </div>;
}