'use client'

import React from 'react';
import { Bell, Search } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';

export function Topbar() {
  const { user } = useAuth();

  return (
    <div className="fixed top-0 left-60 right-0 h-16 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] z-10">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)]" size={18} />
            <input
              type="text"
              placeholder="Ara..."
              className="w-full pl-10 pr-4 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-sm text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--purple-primary)]"
            />
          </div>
        </div>

        {/* Notifications & User */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-card)] rounded-lg transition-all">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--red-danger)] rounded-full"></span>
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[var(--purple-primary)] rounded-full flex items-center justify-center text-sm font-bold">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
