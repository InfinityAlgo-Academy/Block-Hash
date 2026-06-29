'use client';

import React, { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';
import { Chain, NormalizedTransaction } from '@block-hash/common';
import { Activity, Zap, AlertTriangle, ArrowRightRight } from 'lucide-react';

export function Dashboard() {
    const [chain, setChain] = useState<Chain>(Chain.ETHEREUM);
    const [liveTxs, setLiveTxs] = useState<NormalizedTransaction[]>([]);
    const [alerts, setAlerts] = useState<any[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        socket.connect();
        
        socket.on('connect', () => {
            setIsConnected(true);
            socket.emit('subscribe_chain', chain);
            socket.emit('subscribe_alerts');
        });

        socket.on('disconnect', () => setIsConnected(false));

        socket.on('new_transaction', (tx: NormalizedTransaction) => {
            setLiveTxs(prev => [tx, ...prev].slice(0, 10)); // Keep last 10
        });

        socket.on('whale_alert', (alert: any) => {
            setAlerts(prev => [alert, ...prev].slice(0, 5));
        });

        return () => {
            socket.disconnect();
        };
    }, [chain]);

    // Handle chain switch
    const handleChainChange = (newChain: Chain) => {
        socket.emit('subscribe_chain', newChain); // Simplified, should unsubscribe old
        setChain(newChain);
        setLiveTxs([]);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Sidebar / Controls */}
            <div className="col-span-1 space-y-6">
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-blue-400" /> 
                        Network Status
                    </h2>
                    <div className="flex items-center space-x-2 mb-4">
                        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-sm text-slate-300">{isConnected ? 'Connected to Stream' : 'Disconnected'}</span>
                    </div>
                    
                    <label className="block text-sm text-slate-400 mb-2">Select Chain</label>
                    <select 
                        value={chain} 
                        onChange={(e) => handleChainChange(e.target.value as Chain)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                    >
                        {Object.values(Chain).map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                {/* Live Alerts */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" /> 
                        Smart Alerts
                    </h2>
                    <div className="space-y-3">
                        {alerts.length === 0 ? (
                            <p className="text-sm text-slate-500 italic">Waiting for alerts...</p>
                        ) : alerts.map((alert, i) => (
                            <div key={i} className="bg-slate-900 p-3 rounded border border-slate-700 text-sm">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-yellow-400">{alert.alertType}</span>
                                    <span className="text-xs text-slate-500">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                                </div>
                                <p className="text-slate-300">
                                    ${alert.amountUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Feed */}
            <div className="col-span-1 md:col-span-2">
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 h-full">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <Zap className="w-5 h-5 mr-2 text-purple-400" /> 
                        Live Transactions
                    </h2>
                    <div className="space-y-2">
                        {liveTxs.length === 0 ? (
                            <div className="flex items-center justify-center h-48 text-slate-500">
                                Listening to {chain} mempool...
                            </div>
                        ) : liveTxs.map((tx, i) => (
                            <div key={tx.hash || i} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                                <div className="flex flex-col max-w-[60%]">
                                    <span className="text-xs text-blue-400 font-mono truncate">{tx.hash}</span>
                                    <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
                                        <span className="truncate w-24">{tx.from}</span>
                                        <ArrowRightRight className="w-3 h-3" />
                                        <span className="truncate w-24">{tx.to || 'Contract'}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-semibold">{(Number(tx.value) / 1e18).toFixed(4)} NATIVE</span>
                                    <span className="text-xs text-slate-500">{tx.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
        </div>
    );
}
