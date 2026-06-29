import { Dashboard } from '@/components/Dashboard';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-8">
      <div className="z-10 w-full max-w-7xl mx-auto items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Block-Hash Intelligence
        </h1>
        <Dashboard />
      </div>
    </main>
  );
}
