'use client'

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FloatingChatButton } from '@/components/chat/FloatingChatButton';
import { supabase } from '@/lib/supabase';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function KeywordsPage() {
  const [keywords, setKeywords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadKeywords() {
      try {
        const { data, error } = await supabase
          .from('keywords')
          .select('*')
          .eq('tenant_id', '11111111-1111-1111-1111-111111111111')
          .order('current_position', { ascending: true });

        if (error) throw error;
        setKeywords(data || []);
      } catch (error) {
        console.error('Keywords error:', error);
      } finally {
        setLoading(false);
      }
    }

    loadKeywords();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-[var(--text-secondary)]">Yükleniyor...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Anahtar Kelimeler</h1>
          <p className="text-[var(--text-secondary)]">SEO keyword performans takibi</p>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase">Anahtar Kelime</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase">Mevcut Sıra</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase">Değişim</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase">Gösterim</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase">Tıklama</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase">CTR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {keywords.map((keyword, index) => (
                  <motion.tr
                    key={keyword.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-[var(--bg-secondary)] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-white">{keyword.keyword}</p>
                        <p className="text-xs text-[var(--text-muted)] truncate max-w-xs">{keyword.url}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--purple-primary)]/20 text-[var(--purple-primary)]">
                        #{keyword.current_position || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {keyword.position_change !== null && keyword.position_change !== 0 ? (
                        <div className="flex items-center gap-1">
                          {keyword.position_change > 0 ? (
                            <>
                              <TrendingUp size={16} className="text-[var(--green-success)]" />
                              <span className="text-sm font-semibold text-[var(--green-success)]">
                                +{keyword.position_change}
                              </span>
                            </>
                          ) : (
                            <>
                              <TrendingDown size={16} className="text-[var(--red-danger)]" />
                              <span className="text-sm font-semibold text-[var(--red-danger)]">
                                {keyword.position_change}
                              </span>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-[var(--text-muted)]">
                          <Minus size={16} />
                          <span className="text-sm">0</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {keyword.impressions?.toLocaleString('tr-TR') || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {keyword.clicks?.toLocaleString('tr-TR') || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {keyword.ctr ? `${keyword.ctr.toFixed(1)}%` : '-'}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <FloatingChatButton />
    </DashboardLayout>
  );
}
