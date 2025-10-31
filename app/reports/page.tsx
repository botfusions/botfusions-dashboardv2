'use client'

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FloatingChatButton } from '@/components/chat/FloatingChatButton';
import { FileText, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const reports = [
  { id: 1, title: 'Haftalık SEO Raporu', date: '1 Kasım 2025', type: 'SEO' },
  { id: 2, title: 'Aylık Performans Özeti', date: '28 Ekim 2025', type: 'Genel' },
];

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Raporlar</h1>
            <p className="text-[var(--text-secondary)]">Oluşturulan analiz raporları</p>
          </div>
          <button className="px-4 py-2 bg-[var(--purple-primary)] hover:bg-[var(--purple-hover)] text-white rounded-lg transition-all">
            Yeni Rapor Oluştur
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 card-hover"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[var(--purple-primary)]/20 rounded-lg flex items-center justify-center">
                  <FileText size={24} className="text-[var(--purple-primary)]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{report.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-2">{report.date}</p>
                  <span className="inline-block px-2 py-1 bg-[var(--bg-secondary)] text-[var(--text-muted)] text-xs rounded">
                    {report.type}
                  </span>
                </div>
                <button className="p-2 text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-secondary)] rounded-lg transition-all">
                  <Download size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <FloatingChatButton />
    </DashboardLayout>
  );
}
