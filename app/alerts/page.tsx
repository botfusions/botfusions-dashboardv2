'use client'

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FloatingChatButton } from '@/components/chat/FloatingChatButton';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const alerts = [
  {
    id: 1,
    severity: 'high',
    title: 'SEO Sıralaması Düşüşü',
    message: '"dijital pazarlama" kelimesi 5 sıra geriledi',
    time: '2 saat önce'
  },
  {
    id: 2,
    severity: 'medium',
    title: 'Rakip Fiyat Değişikliği',
    message: 'Rakip Ajans A fiyatlarını %15 düşürdü',
    time: '5 saat önce'
  },
];

export default function AlertsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Uyarılar</h1>
          <p className="text-[var(--text-secondary)]">Önemli değişiklikler ve bildirimler</p>
        </div>

        <div className="space-y-4">
          {alerts.map((alert, index) => {
            const severityConfig = {
              high: { bg: 'bg-[var(--red-danger)]/10', border: 'border-[var(--red-danger)]/20', text: 'text-[var(--red-danger)]', icon: AlertTriangle },
              medium: { bg: 'bg-[var(--yellow-warning)]/10', border: 'border-[var(--yellow-warning)]/20', text: 'text-[var(--yellow-warning)]', icon: AlertCircle },
              low: { bg: 'bg-[var(--blue-primary)]/10', border: 'border-[var(--blue-primary)]/20', text: 'text-[var(--blue-primary)]', icon: Info },
            };
            
            const config = severityConfig[alert.severity as keyof typeof severityConfig];
            const Icon = config.icon;

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-xl border ${config.bg} ${config.border}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${config.bg}`}>
                    <Icon size={24} className={config.text} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-1 ${config.text}`}>{alert.title}</h3>
                    <p className="text-white text-sm mb-2">{alert.message}</p>
                    <p className="text-xs text-[var(--text-muted)]">{alert.time}</p>
                  </div>
                  <button className="px-4 py-2 bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-white border border-[var(--border-color)] rounded-lg text-sm transition-all">
                    İşaretle
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <FloatingChatButton />
    </DashboardLayout>
  );
}
