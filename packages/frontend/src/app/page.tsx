import { Dashboard } from '@/components/Dashboard';

export default function Home() {
  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time cross-chain intelligence & anomaly detection</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="badge-accent flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Live
          </div>
          <span className="text-xs text-slate-600">Last updated: just now</span>
        </div>
      </div>
      <Dashboard />
    </div>
  );
}
