'use client';

import { useState } from 'react';

export default function SearchPage() {
  const [query, setQuery] = useState('');

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Buscar</h1>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar canais, filmes, séries..."
        className="w-full max-w-md p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
      />
    </main>
  );
}
