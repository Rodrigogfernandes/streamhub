import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'StreamHub — Catálogo',
};

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav className="flex gap-4 p-4 border-b border-gray-800">
        <Link href="/" className="text-gray-400 hover:text-white">Início</Link>
        <Link href="/catalog/live" className="text-gray-400 hover:text-white">Ao Vivo</Link>
        <Link href="/catalog/movies" className="text-gray-400 hover:text-white">Filmes</Link>
        <Link href="/catalog/series" className="text-gray-400 hover:text-white">Séries</Link>
        <Link href="/search" className="text-gray-400 hover:text-white">Buscar</Link>
        <Link href="/admin" className="text-gray-400 hover:text-white ml-auto">Admin</Link>
      </nav>
      {children}
    </div>
  );
}
