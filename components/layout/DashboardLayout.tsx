'use client'

import React, { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Sidebar />
      <Topbar />
      
      <main className="ml-60 mt-16 p-6">
        <div className="max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
