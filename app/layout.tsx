import './globals.css';

export const metadata = {
  title: 'Diretor Comercial IA | Probel',
  description: 'Inteligência comercial para parceiros, produtos, vendedores e campanhas.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}