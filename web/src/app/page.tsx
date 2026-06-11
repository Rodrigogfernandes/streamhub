import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'StreamHub — Início',
  description: 'Assista canais, filmes e séries',
};

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold mb-4">StreamHub</h1>
        <p className="text-gray-400">Web app inicializado com sucesso</p>
      </div>
    </main>
  );
}
