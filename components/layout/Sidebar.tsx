'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  TrendingUp, 
  Search, 
  Bell, 
  Settings, 
  LogOut,
  Users
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Sohbet', href: '/chat', icon: MessageSquare },
  { name: 'Raporlar', href: '/reports', icon: FileText },
  { name: 'Rakipler', href: '/competitors', icon: Users },
  { name: 'Anahtar Kelimeler', href: '/keywords', icon: Search },
  { name: 'Uyarılar', href: '/alerts', icon: Bell },
  { name: 'Ayarlar', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <div className="fixed left-0 top-0 h-screen w-60 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[var(--border-color)]">
        <h1 className="text-xl font-bold text-[var(--purple-primary)]">
          Botfusions
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">Marketing Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                isActive
                  ? "bg-[var(--purple-primary)] text-white"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-white"
              )}
            >
              <Icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-[var(--border-color)]">
        <div className="flex items-center gap-3 px-4 py-3 bg-[var(--bg-card)] rounded-lg mb-2">
          <div className="w-8 h-8 bg-[var(--purple-primary)] rounded-full flex items-center justify-center text-sm font-bold">
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.email || 'Kullanıcı'}
            </p>
            <p className="text-xs text-[var(--text-muted)]">Premium Plan</p>
          </div>
        </div>
        
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-4 py-3 text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-[var(--red-danger)] rounded-lg transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Çıkış Yap</span>
        </button>
      </div>
    </div>
  );
}
