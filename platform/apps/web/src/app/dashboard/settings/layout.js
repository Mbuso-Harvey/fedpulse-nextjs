'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, User, CreditCard, Users, Key, Shield } from 'lucide-react';

export default function SettingsLayout({ children }) {
  const pathname = usePathname();
  
  const navItems = [
    { name: 'General', href: '/dashboard/settings', icon: User },
    { name: 'Billing', href: '/dashboard/settings/billing', icon: CreditCard },
    { name: 'Team', href: '/dashboard/settings/team', icon: Users },
    { name: 'API Keys', href: '/dashboard/settings/api', icon: Key },
    { name: 'Security', href: '/dashboard/settings/security', icon: Shield },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20">
          <Settings className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600  ">Workspace Settings</h1>
          <p className="text-gray-500  mt-1">Manage your team, billing, and API preferences.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 flex-shrink-0">
          <nav className="flex flex-col gap-1 sticky top-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-700   font-medium' 
                      : 'text-gray-600 hover:bg-gray-50   hover:text-gray-900 '
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600  rounded-r-full" />
                  )}
                  <Icon size={18} className={`transition-colors ${isActive ? 'text-indigo-600 ' : 'text-gray-400 group-hover:text-gray-600 '}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>
        
        <main className="flex-1 min-w-0 bg-white  rounded-2xl border border-gray-100  shadow-sm overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

