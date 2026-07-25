# Diretor Comercial IA — Probel

Central de inteligência comercial para transformar informações de parceiros, produtos, vendedores, visitas e oportunidades em ações práticas.

## O que já existe

- Dashboard executivo conectado ao banco
- Cadastro de parceiros e potencial comercial
- Cadastro de vendedores e meta mensal
- Cadastro de produtos, benefícios e tecnologias
- Registro de oportunidades com prioridade e próxima ação
- Registro de visitas comerciais, treinamentos, showroom e follow-up
- Diagnóstico de Sono consultivo com persistência
- Copiloto de IA comercial
- Seed inicial com parceiros, vendedores, produtos e oportunidades
- Interface responsiva para desktop e celular

## Stack

- Next.js 14
- React 18
- TypeScript
- PostgreSQL
- Prisma ORM
- OpenAI no copiloto comercial

## Configuração

1. Instale Node.js 20+.
2. Execute `npm install`.
3. Copie `.env.example` para `.env.local`.
4. Configure `DATABASE_URL` com uma conexão PostgreSQL.
5. Configure `OPENAI_API_KEY` para habilitar o copiloto.
6. Execute `npm run db:migrate` para criar as tabelas.
7. Execute `npm run db:seed` para inserir a base inicial.
8. Execute `npm run dev`.
9. Abra `http://localhost:3000`.

## Rotas principais

- `/` — Visão Executiva
- `/operacao` — Cadastros, oportunidades e visitas
- `/diagnostico` — Diagnóstico de Sono consultivo

## Modelo comercial

### Parceiros

Guarda potencial, contato, cidade, status, histórico de visitas e oportunidades.

### Vendedores

Guarda região, situação ativa e meta mensal. A próxima evolução será registrar realizado, percentual de meta e ranking.

### Produtos

Guarda categoria, firmeza, tecnologia, benefícios, objeções e perfil ideal de cliente.

### Oportunidades

Cada oportunidade pertence a um parceiro e pode estar ligada a um produto. Ela recebe prioridade, valor potencial, próxima ação e prazo.

### Visitas

Cria memória comercial: o que aconteceu, quem participou e qual é o próximo passo.

### Diagnóstico de Sono

O sistema identifica necessidades de atendimento como suporte, alívio de pressão, controle térmico e independência de movimento. Ele orienta a venda consultiva e não substitui avaliação médica ou profissional de saúde.

## Próximas evoluções

1. Resultado mensal por vendedor e acompanhamento de meta.
2. Histórico de sell-in/sell-out por parceiro e produto.
3. Alertas automáticos de oportunidade parada.
4. Recomendação de produto baseada no catálogo real.
5. Treinamentos e playbooks por produto.
6. Campanhas e roteiros gerados a partir de objetivos comerciais.
7. Autenticação e perfis de acesso.
8. Integração com WhatsApp/CRM quando definida a plataforma oficial.

## Princípio central

A IA não deve apenas gerar conteúdo. Ela deve ajudar o gestor a decidir onde agir, quem desenvolver, qual parceiro priorizar, qual produto posicionar e qual ação comercial executar em seguida.
