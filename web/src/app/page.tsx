import { StreamHubProvider } from '@/components/StreamHubProvider';

export default function Home() {
  return (
    <StreamHubProvider>
      <main className="min-h-screen">
        <h1 className="text-2xl font-bold">StreamHub Web</h1>
        <p className="mt-4 text-gray-400">Em construção</p>
      </main>
    </StreamHubProvider>
  );
}
