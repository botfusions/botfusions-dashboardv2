'use client'

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FloatingChatButton } from '@/components/chat/FloatingChatButton';
import { Bell, Mail, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Ayarlar</h1>
          <p className="text-[var(--text-secondary)]">Hesap ve bildirim tercihleri</p>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Bildirim Tercihleri</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--purple-primary)]/20 rounded-lg flex items-center justify-center">
                  <Mail size={20} className="text-[var(--purple-primary)]" />
                </div>
                <div>
                  <p className="font-medium text-white">Email Bildirimleri</p>
                  <p className="text-sm text-[var(--text-muted)]">Raporlar ve uyarılar için email al</p>
                </div>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <span className="absolute inset-0 bg-[var(--border-color)] rounded-full peer-checked:bg-[var(--purple-primary)] transition-colors cursor-pointer"></span>
                <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-transform"></span>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--blue-primary)]/20 rounded-lg flex items-center justify-center">
                  <MessageSquare size={20} className="text-[var(--blue-primary)]" />
                </div>
                <div>
                  <p className="font-medium text-white">Telegram Bildirimleri</p>
                  <p className="text-sm text-[var(--text-muted)]">Telegram bot üzerinden bildirim al</p>
                </div>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input type="checkbox" className="sr-only peer" />
                <span className="absolute inset-0 bg-[var(--border-color)] rounded-full peer-checked:bg-[var(--purple-primary)] transition-colors cursor-pointer"></span>
                <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-transform"></span>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--green-success)]/20 rounded-lg flex items-center justify-center">
                  <Bell size={20} className="text-[var(--green-success)]" />
                </div>
                <div>
                  <p className="font-medium text-white">Anlık Uyarılar</p>
                  <p className="text-sm text-[var(--text-muted)]">Kritik değişiklikler için anlık bildirim</p>
                </div>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <span className="absolute inset-0 bg-[var(--border-color)] rounded-full peer-checked:bg-[var(--purple-primary)] transition-colors cursor-pointer"></span>
                <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-transform"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <FloatingChatButton />
    </DashboardLayout>
  );
}
