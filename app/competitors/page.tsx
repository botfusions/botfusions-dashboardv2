'use client'

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FloatingChatButton } from '@/components/chat/FloatingChatButton';
import { Users, Globe, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const competitors = [
  { id: 1, name: 'Rakip Ajans A', website: 'https://rakip-a.com', status: 'Aktif' },
  { id: 2, name: 'Rakip Ajans B', website: 'https://rakip-b.com', status: 'Aktif' },
];

export default function CompetitorsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Rakip Analizi</h1>
          <p className="text-[var(--text-secondary)]">Rakiplerin izlenmesi ve karşılaştırması</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {competitors.map((competitor, index) => (
            <motion.div
              key={competitor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 card-hover"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{competitor.name}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{competitor.website}</p>
                </div>
                <span className="px-3 py-1 bg-[var(--green-success)]/20 text-[var(--green-success)] text-xs font-medium rounded-full">
                  {competitor.status}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <Globe size={20} className="mx-auto mb-1 text-[var(--purple-primary)]" />
                  <p className="text-xs text-[var(--text-muted)]">Domain</p>
                  <p className="text-sm font-semibold text-white mt-1">85/100</p>
                </div>
                <div className="text-center">
                  <TrendingUp size={20} className="mx-auto mb-1 text-[var(--blue-primary)]" />
                  <p className="text-xs text-[var(--text-muted)]">SEO</p>
                  <p className="text-sm font-semibold text-white mt-1">72/100</p>
                </div>
                <div className="text-center">
                  <Users size={20} className="mx-auto mb-1 text-[var(--green-success)]" />
                  <p className="text-xs text-[var(--text-muted)]">Traffic</p>
                  <p className="text-sm font-semibold text-white mt-1">+12%</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <FloatingChatButton />
    </DashboardLayout>
  );
}
