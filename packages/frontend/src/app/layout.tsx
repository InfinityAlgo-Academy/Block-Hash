import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LayoutDashboard, Wallet, Zap, Settings, Bell, Search, TrendingUp, Radar, AlertTriangle, ChevronDown } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Block-Hash | On-Chain Intelligence",
  description: "Multi-chain indexing and AI-driven analytics dashboard",
};

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "#", active: true },
  { icon: TrendingUp, label: "Smart Money", href: "#", active: false },
  { icon: Radar, label: "Whale Tracker", href: "#", active: false },
  { icon: Zap, label: "Live Feed", href: "#", active: false },
  { icon: AlertTriangle, label: "Alerts", href: "#", active: false },
  { icon: Wallet, label: "Portfolio", href: "#", active: false },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-slate-100 flex h-screen overflow-hidden`}>

        {/* Sidebar */}
        <aside className="w-64 glass-panel-strong border-r border-white/[0.04] hidden md:flex flex-col relative z-30 shrink-0">
          {/* Logo */}
          <div className="h-16 flex items-center px-5 border-b border-white/[0.04]">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center mr-3 shadow-lg shadow-primary/30">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white">Block-Hash</span>
              <p className="text-[10px] text-slate-500 tracking-widest uppercase">Intelligence</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                  item.active
                    ? "bg-primary/10 text-primary border border-primary/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                <item.icon className={`w-4.5 h-4.5 mr-3 ${item.active ? "text-primary" : "text-slate-500 group-hover:text-slate-300"}`} strokeWidth={1.8} />
                <span className="text-sm font-medium">{item.label}</span>
                {item.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(59,130,246,0.6)]" />}
              </a>
            ))}
          </nav>

          {/* Bottom */}
          <div className="p-3 border-t border-white/[0.04]">
            <a href="#" className="flex items-center px-3 py-2.5 text-slate-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all duration-200 border border-transparent">
              <Settings className="w-4.5 h-4.5 mr-3 text-slate-500" strokeWidth={1.8} />
              <span className="text-sm font-medium">Settings</span>
            </a>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative z-10 overflow-hidden">

          {/* Top Header */}
          <header className="h-16 glass-panel-strong border-b border-white/[0.04] flex items-center justify-between px-6 z-20 shrink-0">
            <div className="flex items-center gap-4">
              {/* Mobile menu toggle */}
              <button className="md:hidden p-2 text-slate-400 hover:text-white">
                <Zap className="w-5 h-5" />
              </button>

              <div className="hidden sm:flex items-center w-80 bg-background border border-white/[0.06] rounded-xl px-4 py-2 focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                <Search className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search tx, address, block..."
                  className="bg-transparent border-none outline-none text-sm text-slate-200 w-full placeholder-slate-600"
                />
                <kbd className="hidden sm:inline-block text-[10px] text-slate-600 border border-white/[0.06] rounded px-1.5 py-0.5 ml-2">⌘K</kbd>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Network indicator */}
              <div className="hidden lg:flex items-center gap-2 bg-background border border-white/[0.06] rounded-xl px-3.5 py-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-slate-400 font-medium">Ethereum</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </div>

              <button className="relative p-2.5 text-slate-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all">
                <Bell className="w-4.5 h-4.5" strokeWidth={1.8} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full shadow-[0_0_6px_rgba(239,68,68,0.6)]" />
              </button>

              <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-secondary to-primary p-[1.5px] shadow-lg shadow-primary/20">
                <div className="w-full h-full bg-background rounded-[10px] flex items-center justify-center">
                  <span className="text-xs font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">BH</span>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-glass-gradient">
            {children}
          </main>

        </div>

      </body>
    </html>
  );
}
