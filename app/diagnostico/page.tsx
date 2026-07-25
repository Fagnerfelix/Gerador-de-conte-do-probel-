'use client';

import Link from 'next/link';
import { useState } from 'react';

type Result = { profile: string; recommendation: string; rationale: string; salesQuestions: string[] };

export default function DiagnosticoPage() {
  const [form, setForm] = useState({ customerName: '', sleepPosition: 'side', firmnessChoice: 'medium', usage: 'daily', sleepsWithPartner: false, heatSensitivity: 'medium', painComplaint: '' });
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  function update(name: string, value: string | boolean) { setForm(current => ({ ...current, [name]: value })); }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setResult(null);
    const response = await fetch('/api/diagnostic', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await response.json();
    if (response.ok) setResult(data);
    setLoading(false);
  }

  return <main className="main page">
    <div className="topbar"><Link href="/">← Visão Executiva</Link><Link href="/operacao">Operação Comercial</Link></div>
    <header className="header"><div className="eyebrow">Venda consultiva</div><h1>Diagnóstico de Sono</h1><p>Descubra primeiro como o cliente dorme. Depois, transforme a necessidade em critérios objetivos para orientar o teste e a recomendação do colchão.</p></header>
    <div className="content diagnosis-layout">
      <form className="panel form-grid" onSubmit={submit}>
        <label>Nome do cliente<input value={form.customerName} onChange={e => update('customerName', e.target.value)} placeholder="Opcional" /></label>
        <label>Posição mais comum<select value={form.sleepPosition} onChange={e => update('sleepPosition', e.target.value)}><option value="side">De lado</option><option value="back">De costas</option><option value="stomach">De bruços</option><option value="mixed">Varia bastante</option></select></label>
        <label>Preferência de conforto<select value={form.firmnessChoice} onChange={e => update('firmnessChoice', e.target.value)}><option value="soft">Mais macio</option><option value="medium">Intermediário</option><option value="firm">Mais firme</option></select></label>
        <label>Uso<select value={form.usage} onChange={e => update('usage', e.target.value)}><option value="daily">Uso diário</option><option value="guest">Quarto de visitas</option></select></label>
        <label>Sensibilidade ao calor<select value={form.heatSensitivity} onChange={e => update('heatSensitivity', e.target.value)}><option value="low">Baixa</option><option value="medium">Média</option><option value="high">Alta</option></select></label>
        <label className="check"><input type="checkbox" checked={form.sleepsWithPartner} onChange={e => update('sleepsWithPartner', e.target.checked)} /> Dorme com outra pessoa</label>
        <label className="wide">Algum desconforto relatado?<textarea value={form.painComplaint} onChange={e => update('painComplaint', e.target.value)} placeholder="Registre somente o relato do cliente. Não faça diagnóstico médico." /></label>
        <button className="wide" disabled={loading}>{loading ? 'Analisando...' : 'Gerar perfil consultivo'}</button>
      </form>
      <section className="panel result-card">
        <div className="eyebrow">Resultado</div>
        {!result ? <p className="muted">Preencha o diagnóstico para gerar uma orientação de atendimento.</p> : <><h2>{result.profile}</h2><div className="recommendation">{result.recommendation}</div><p>{result.rationale}</p><h3>Perguntas para aprofundar</h3><ol>{result.salesQuestions.map(q => <li key={q}>{q}</li>)}</ol></>}
      </section>
    </div>
  </main>;
}
