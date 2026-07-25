'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CommandPalette } from '@/components/CommandPalette';
import { useAuth } from '@/lib/auth-context';
import { 
  LayoutDashboard, Bell, TrendingUp, Search, MessageCircleQuestion, Building2, Users, 
  Target, FolderOpen, Network, Bot, Star, GitCompare, ArrowLeftRight, Crosshair, 
  ShieldCheck, DollarSign, FileText, Handshake, Briefcase, BellRing, Eye, Download, 
  Activity, Settings, CreditCard, UsersRound, Key, Shield, BookOpen, DatabaseZap, 
  ScrollText, Lock, ChevronLeft, ChevronRight, Menu
} from 'lucide-react';
import { Radio } from 'lucide-react';

const NAV_GROUPS = [
  {
    label: "CORE INTELLIGENCE",
    items: [
      { id: 'explorer', label: 'Data Explorer', icon: DatabaseZap, href: '/dashboard' },
      { id: 'ai-analyst', label: 'AI Bid Analyst', icon: Bot, href: '/dashboard/ai-analyst' },
      { id: 'ask-fedpulse', label: 'Ask FedPulse', icon: MessageCircleQuestion, href: '/dashboard/ask-fedpulse' }
    ]
  },
  {
    label: "MARKET DATA",
    items: [
      { id: 'departments', label: 'Departments', icon: Building2, href: '/dashboard/departments' },
      { id: 'suppliers', label: 'Incumbent Suppliers', icon: Users, href: '/dashboard/suppliers' }
    ]
  }
];

const SETTINGS_ITEMS = [
  { id: 'pricing', label: 'Pricing & Plans', icon: CreditCard, href: '/pricing' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/dashboard/settings' },
  { id: 'about', label: 'About FedPulse', icon: BookOpen, href: '/about' }
];

export default function DashboardLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  
  const userTier = user?.user_metadata?.subscription_tier || 'starter';

  return (
    <div className="flex h-screen bg-[#f6f9fc] overflow-hidden text-[#0a2540]">
      {/* Command Palette */}
      <CommandPalette />
      
      {/* Sidebar Desktop */}
      <aside className={`hidden md:flex flex-col border-r border-border bg-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
        <div className="h-14 flex items-center border-b border-border px-4 justify-between">
          <div className="font-bold text-lg tracking-tight truncate text-[#0a2540]">
            {isCollapsed ? 'F' : 'FedPulse'}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          {NAV_GROUPS.map((group, i) => (
            <div key={i} className="mb-6 px-2">
              {!isCollapsed && <div className="text-xs font-semibold text-muted-foreground mb-2 px-3">{group.label}</div>}
              <nav className="space-y-1">
                {group.items.map(item => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  const isLocked = item.starterLocked && userTier === 'starter';
                  
                  return (
                    <Link 
                      key={item.id} 
                      href={item.soon ? '#' : item.href}
                      title={isCollapsed ? item.label : undefined}
                      onClick={(e) => {
                        if (item.soon) {
                          e.preventDefault();
                          alert('This Agent Workspace is coming in a future update!');
                        }
                      }}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      } ${isLocked ? 'opacity-70' : ''}`}
                    >
                      <Icon className={`flex-shrink-0 ${isCollapsed ? 'mx-auto h-5 w-5' : 'mr-3 h-4 w-4'}`} />
                      {!isCollapsed && (
                        <span className="flex-1 truncate">{item.label}</span>
                      )}
                      {!isCollapsed && isLocked && <Lock className="ml-2 h-3 w-3 text-muted-foreground" />}
                      {!isCollapsed && item.soon && <span className="ml-2 text-[10px] uppercase font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">SOON</span>}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
          
          <div className="mb-6 px-2 border-t border-border pt-4">
            {!isCollapsed && <div className="text-xs font-semibold text-muted-foreground mb-2 px-3">SYSTEM</div>}
            <nav className="space-y-1">
              {SETTINGS_ITEMS.map(item => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.id} 
                    href={item.href}
                    title={isCollapsed ? item.label : undefined}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <Icon className={`flex-shrink-0 ${isCollapsed ? 'mx-auto h-5 w-5' : 'mr-3 h-4 w-4'}`} />
                    {!isCollapsed && <span className="flex-1 truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="p-2 border-t border-border">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center p-2 text-muted-foreground hover:bg-muted rounded-md transition-colors"
          >
            {isCollapsed ? <ChevronRight size={18} /> : (
              <div className="flex items-center w-full">
                <ChevronLeft size={18} className="mr-2" />
                <span className="text-sm font-medium">Collapse</span>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#f6f9fc]">
        {/* Top Header */}
        <header className="h-14 flex items-center justify-between border-b border-border bg-white px-4 md:px-6 z-10 shrink-0">
          <div className="flex items-center">
            <button className="md:hidden mr-4 text-muted-foreground" onClick={() => setIsMobileOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center text-sm text-muted-foreground border border-border bg-muted/50 rounded-md px-3 py-1.5 cursor-text hover:border-muted-foreground/30 transition-colors w-64 lg:w-96" onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}>
              <Search className="mr-2 h-4 w-4" />
              <span>Search everywhere...</span>
              <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="relative text-muted-foreground hover:text-[#0a2540] transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">3</span>
            </button>
            <div className="flex items-center space-x-2 border-l border-border pl-4 ml-2">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                {user?.user_metadata?.full_name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-[#f6f9fc] p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
