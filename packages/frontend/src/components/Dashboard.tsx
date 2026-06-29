'use client';

import React, { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';
import { Chain, NormalizedTransaction } from '@block-hash/common';
import {
  Activity, Zap, AlertTriangle, ArrowRight, TrendingUp, ShieldCheck,
  Database, DollarSign, BarChart3, ExternalLink, Clock, ArrowUpRight,
  ArrowDownRight, Hash, Wallet, Flame, Gauge, LineChart
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const volumeData = Array.from({ length: 24 }, (_, i) => ({
  name: `${i.toString().padStart(2, '0')}:00`,
  volume: Math.floor(Math.random() * 8000) + 2000,
  txs: Math.floor(Math.random() * 400) + 100,
}));

const chainData = Array.from({ length: 7 }, (_, i) => ({
  name: ['ETH', 'BNB', 'SOL', 'ARB', 'BASE', 'MATIC', 'AVAX'][i],
  value: Math.floor(Math.random() * 40) + 10,
  change: (Math.random() * 10 - 3).toFixed(1),
}));

const stats = [
  { label: 'Total Value Analyzed', value: '$847.2M', change: '+12.5%', icon: DollarSign, color: 'primary', up: true },
  { label: 'Active Whales', value: '1,847', change: '+23', icon: Flame, color: 'warning', up: true },
  { label: 'Smart Money Flows', value: '$124.3M', change: '-8.2%', icon: TrendingUp, color: 'accent', up: false },
  { label: 'Contracts Tracked', value: '12.4K', change: '+342', icon: ShieldCheck, color: 'secondary', up: true },
];

const iconBgMap: Record<string, string> = {
  primary: 'bg-primary/10 border-primary/20',
  warning: 'bg-warning/10 border-warning/20',
  accent: 'bg-accent/10 border-accent/20',
  secondary: 'bg-secondary/10 border-secondary/20',
};
const iconColorMap: Record<string, string> = {
  primary: 'text-primary',
  warning: 'text-warning',
  accent: 'text-accent',
  secondary: 'text-secondary',
};

function StatCard({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const Icon = stat.icon;
  return (
    <div
      className="glass-panel rounded-2xl p-5 card-hover slide-up relative overflow-hidden group"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="absolute top-3 right-3 opacity-[0.04] group-hover:opacity-[0.08] transition-all duration-500">
        <Icon className="w-20 h-20" />
      </div>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${iconBgMap[stat.color]} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${iconColorMap[stat.color]}`} strokeWidth={1.8} />
        </div>
        <span className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
          stat.up ? 'text-accent bg-accent/10' : 'text-danger bg-danger/10'
        }`}>
          {stat.up ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
          {stat.change}
        </span>
      </div>
      <p className="stat-label mb-1">{stat.label}</p>
      <p className="stat-value">{stat.value}</p>
    </div>
  );
}

export function Dashboard() {
  const [chain, setChain] = useState<Chain>(Chain.ETHEREUM);
  const [liveTxs, setLiveTxs] = useState<NormalizedTransaction[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [chartMetric, setChartMetric] = useState<'volume' | 'txs'>('volume');

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('subscribe_chain', chain);
      socket.emit('subscribe_alerts');
    });

    socket.on('disconnect', () => setIsConnected(false));

    socket.on('new_transaction', (tx: NormalizedTransaction) => {
      setLiveTxs(prev => {
        const updated = [tx, ...prev];
        return updated.slice(0, 15);
      });
    });

    socket.on('whale_alert', (alert: any) => {
      setAlerts(prev => [alert, ...prev].slice(0, 8));
    });

    return () => {
      socket.disconnect();
    };
  }, [chain]);

  const handleChainChange = (newChain: Chain) => {
    socket.emit('subscribe_chain', newChain);
    setChain(newChain);
    setLiveTxs([]);
  };

  const truncate = (s: string, n: number) => s ? `${s.substring(0, n)}...` : '-';

  return (
    <div className="space-y-6">

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => <StatCard key={s.label} stat={s} index={i} />)}
      </div>

      {/* Middle Section: Chart + Chain Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Volume Chart */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 fade-scale">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-white flex items-center">
              <BarChart3 className="w-4.5 h-4.5 mr-2 text-primary" />
              Network Activity
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex bg-background rounded-lg border border-white/[0.06] p-0.5 text-xs">
                <button
                  onClick={() => setChartMetric('volume')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                    chartMetric === 'volume' ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >Volume</button>
                <button
                  onClick={() => setChartMetric('txs')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                    chartMetric === 'txs' ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >Transactions</button>
              </div>
              <select
                value={chain}
                onChange={(e) => handleChainChange(e.target.value as Chain)}
                className="bg-background border border-white/[0.06] rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:ring-2 focus:ring-primary/30 outline-none"
              >
                {Object.values(Chain).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff06" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff25" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff25" fontSize={11} tickLine={false} axisLine={false}
                  tickFormatter={(val) => chartMetric === 'volume' ? `$${(val/1000).toFixed(0)}k` : `${val}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#151A23', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#94A3B8', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey={chartMetric === 'volume' ? 'volume' : 'txs'} stroke="#3B82F6" strokeWidth={2.5} fillOpacity={1} fill="url(#volumeGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chain Distribution */}
        <div className="glass-panel rounded-2xl p-6 fade-scale" style={{ animationDelay: '100ms' }}>
          <h2 className="text-base font-bold text-white flex items-center mb-6">
            <Gauge className="w-4.5 h-4.5 mr-2 text-secondary" />
            Chain Activity
          </h2>
          <div className="space-y-4">
            {chainData.map((c) => (
              <div key={c.name} className="group">
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-background border border-white/[0.06] flex items-center justify-center">
                      <span className="text-[10px] font-bold text-slate-300">{c.name}</span>
                    </div>
                    <span className="font-medium text-slate-300">{c.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">{c.value}%</span>
                    <span className={`text-xs font-medium ${Number(c.change) >= 0 ? 'text-accent' : 'text-danger'}`}>
                      {c.change}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                    style={{ width: `${c.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Mempool + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Live Mempool Feed */}
        <div className="lg:col-span-2 glass-panel rounded-2xl overflow-hidden fade-scale" style={{ animationDelay: '200ms' }}>
          <div className="p-6 pb-4 border-b border-white/[0.04]">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center">
                <Zap className="w-4.5 h-4.5 mr-2 text-primary" />
                Live Mempool
              </h2>
              <div className="flex items-center gap-3">
                <div className="badge-accent flex items-center gap-1.5 text-[10px]">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  {liveTxs.length} new
                </div>
                <span className="text-xs text-slate-600 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  Real-time
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500 border-b border-white/[0.03]">
                  <th className="text-left font-medium px-6 py-3.5">Transaction</th>
                  <th className="text-left font-medium px-4 py-3.5">From</th>
                  <th className="text-left font-medium px-4 py-3.5">To</th>
                  <th className="text-right font-medium px-6 py-3.5">Value</th>
                  <th className="text-right font-medium px-4 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {liveTxs.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="flex flex-col items-center justify-center py-16 text-slate-600">
                        <Activity className="w-8 h-8 mb-3 text-slate-700" />
                        <p className="text-sm">Waiting for transactions on <span className="text-primary font-medium">{chain}</span></p>
                        <p className="text-xs mt-1">Connect to a WebSocket-enabled RPC to start streaming</p>
                      </div>
                    </td>
                  </tr>
                ) : liveTxs.map((tx, i) => (
                  <tr key={tx.hash || i} className="table-row slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent/60" />
                        <span className="text-primary font-mono text-xs bg-primary/5 px-2 py-0.5 rounded-md">
                          {truncate(tx.hash, 12)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-slate-400 font-mono text-xs flex items-center gap-1.5">
                        <Wallet className="w-3 h-3 text-slate-600" />
                        {tx.from ? truncate(tx.from, 8) : '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-slate-400 font-mono text-xs flex items-center gap-1.5">
                        <ArrowRight className="w-3 h-3 text-slate-600" />
                        {tx.to ? truncate(tx.to, 8) : <span className="text-secondary">Contract</span>}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <span className="font-semibold text-white text-xs">{(Number(tx.value) / 1e18).toFixed(4)}</span>
                      <span className="text-slate-500 text-[10px] ml-1">ETH</span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {tx.status === 1 ? (
                        <span className="badge-accent text-[10px]">Success</span>
                      ) : tx.status === 0 ? (
                        <span className="badge-danger text-[10px]">Failed</span>
                      ) : (
                        <span className="badge-warning text-[10px]">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alerts Sidebar */}
        <div className="glass-panel rounded-2xl overflow-hidden fade-scale" style={{ animationDelay: '300ms' }}>
          <div className="p-6 pb-4 border-b border-white/[0.04]">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center">
                <AlertTriangle className="w-4.5 h-4.5 mr-2 text-warning" />
                Smart Alerts
              </h2>
              <span className="badge-warning text-[10px]">AI Powered</span>
            </div>
          </div>

          <div className="p-4 space-y-3 max-h-[480px] overflow-y-auto">
            {alerts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-14 h-14 rounded-2xl bg-warning/5 border border-warning/10 mx-auto flex items-center justify-center mb-3">
                  <AlertTriangle className="w-6 h-6 text-warning/40" />
                </div>
                <p className="text-sm text-slate-500 font-medium">No active alerts</p>
                <p className="text-xs text-slate-600 mt-1">Monitoring all chains for anomalies</p>
              </div>
            ) : alerts.map((alert, i) => (
              <div key={i} className="relative bg-background rounded-xl border border-white/[0.04] p-4 hover:border-warning/20 transition-all slide-up group" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="glow-line rounded-l" />
                <div className="flex items-start justify-between mb-2 pl-4">
                  <div>
                    <span className="text-xs font-bold text-warning">{alert.alertType?.replace(/_/g, ' ') || 'Alert'}</span>
                    <p className="text-lg font-bold text-white mt-0.5 tracking-tight">
                      ${typeof alert.amountUsd === 'number' ? alert.amountUsd.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '—'}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-600 bg-background border border-white/[0.04] px-2 py-1 rounded-lg shrink-0">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="pl-4 flex items-center justify-between mt-1.5">
                  <div className="flex items-center gap-2">
                    <Hash className="w-3 h-3 text-slate-600" />
                    <span className="text-[10px] text-slate-500 font-mono">
                      {alert.transactionHash ? truncate(alert.transactionHash, 10) : ''}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-danger bg-danger/5 px-2 py-0.5 rounded-md">HIGH</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-white/[0.04]">
            <button className="w-full py-2.5 rounded-xl bg-background border border-white/[0.06] text-xs font-medium text-slate-400 hover:text-white hover:border-primary/30 hover:bg-primary/[0.03] transition-all flex items-center justify-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              View All Alerts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
