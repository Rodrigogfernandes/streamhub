import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'StreamHub — Plataforma de Streaming',
  description: 'Plataforma de streaming inteligente com classificação automática por IA',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-gray-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
