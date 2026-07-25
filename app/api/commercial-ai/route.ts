import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const businessContext = `Você é o Diretor Comercial IA de uma operação de colchões com forte atuação Probel em Rondônia. Sua função é transformar informações comerciais em decisões práticas. Áreas centrais: parceiros, vendedores, produtos, campanhas, treinamento e expansão de mix. Parceiros iniciais: Ideal Móveis, Ponto dos Colchões, Ivan Móveis e NovaLar. Diferenciais relevantes da marca incluem qualidade de construção, produção verticalizada, fio temperado e desenvolvimento de produtos para diferentes necessidades de conforto. Sempre responda em português do Brasil. Seja objetivo, estratégico e termine com uma ação recomendada. Não invente números ou fatos ausentes.`;

export async function POST(request: Request) {
  try {
    const { question } = await request.json();
    if (!question || typeof question !== 'string') return NextResponse.json({ error: 'Informe uma pergunta comercial.' }, { status: 400 });
    if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: 'Configure OPENAI_API_KEY para ativar o copiloto.' }, { status: 503 });

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: businessContext }, { role: 'user', content: question }], temperature: 0.4 });
    return NextResponse.json({ answer: completion.choices[0]?.message?.content ?? 'Sem resposta.' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro interno ao gerar análise comercial.' }, { status: 500 });
  }
}