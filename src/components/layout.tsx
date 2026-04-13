import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Activity, Clock, List, Menu, X, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    document.documentElement.style.background = "#030712";
  }, []);

  const navItems = [
    { href: "/", label: "Scanner", icon: <Activity className="w-4 h-4" /> },
    { href: "/patterns", label: "Patterns", icon: <TrendingUp className="w-4 h-4" /> },
    { href: "/watchlist", label: "Watchlist", icon: <List className="w-4 h-4" /> },
    { href: "/history", label: "History", icon: <Clock className="w-4 h-4" /> },
  ];

  return (
    <div className="flex h-screen w-full bg-gray-950 text-gray-100 overflow-hidden font-mono">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-56 border-r border-gray-800 bg-gray-900/70 flex-shrink-0">
        <div className="px-4 py-3 border-b border-gray-800 flex items-center gap-2">
          <span className="text-lg">🇺🇸</span>
          <div>
            <div className="text-sm font-bold text-white leading-tight">US Pre-Market</div>
            <div className="text-xs text-gray-500 leading-tight">Stock Scanner</div>
          </div>
          <span className="ml-auto text-xs px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">NYSE·NASDAQ</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors text-sm",
                location === item.href
                  ? "bg-blue-950 text-blue-300 border border-blue-800"
                  : "text-gray-500 hover:bg-gray-800 hover:text-gray-200"
              )}
              data-testid={`nav-${item.label.toLowerCase()}`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-800 text-xs text-gray-600">
          RSI · MACD · VWAP · EMA · ATR
        </div>
      </aside>

      {/* Mobile Header + Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900/70">
          <div className="flex items-center gap-2">
            <span>🇺🇸</span>
            <span className="text-sm font-bold text-white">US Pre-Market Scanner</span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">NYSE·NASDAQ</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-400 hover:text-white transition-colors"
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {mobileMenuOpen && (
          <nav className="md:hidden p-3 border-b border-gray-800 bg-gray-900 space-y-1 absolute top-[57px] left-0 right-0 z-50 shadow-xl">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2.5 rounded-md transition-colors text-sm",
                  location === item.href
                    ? "bg-blue-950 text-blue-300 border border-blue-800"
                    : "text-gray-500 hover:bg-gray-800 hover:text-gray-200"
                )}
                data-testid={`nav-mobile-${item.label.toLowerCase()}`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        )}

        <main className="flex-1 overflow-auto p-4 md:p-6 bg-gray-950">
          {children}
        </main>
      </div>
    </div>
  );
}
