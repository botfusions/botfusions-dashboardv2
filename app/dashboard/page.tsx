'use client'

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { FloatingChatButton } from '@/components/chat/FloatingChatButton';
import { supabase } from '@/lib/supabase';
import { DollarSign, Users, Package, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const tenantId = '11111111-1111-1111-1111-111111111111';

        // Get main dashboard data
        const { data, error } = await supabase.functions.invoke('get-dashboard-data', {
          body: { tenant_id: tenantId }
        });

        if (error) throw error;
        setDashboardData(data.data);

        // Get weekly revenue data (last 7 days)
        const { data: weeklyMetrics } = await supabase
          .from('metrics')
          .select('*')
          .eq('tenant_id', tenantId)
          .eq('metric_type', 'revenue')
          .eq('period_type', 'daily')
          .order('period_end', { ascending: true })
          .limit(7);

        if (weeklyMetrics && weeklyMetrics.length > 0) {
          const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
          setWeeklyData(weeklyMetrics.map((m, i) => ({
            name: days[i] || `Gün ${i + 1}`,
            value: m.metric_value
          })));
        } else {
          // Fallback data if no historical data
          setWeeklyData([
            { name: 'Pzt', value: 18000 },
            { name: 'Sal', value: 22000 },
            { name: 'Çar', value: 19000 },
            { name: 'Per', value: 24000 },
            { name: 'Cum', value: 21000 },
            { name: 'Cmt', value: 15000 },
            { name: 'Paz', value: 6000 },
          ]);
        }

        // Get monthly keyword performance (last 6 months)
        const { data: keywordCount } = await supabase
          .from('keywords')
          .select('created_at')
          .eq('tenant_id', tenantId);

        if (keywordCount && keywordCount.length > 0) {
          const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'];
          // Generate sample monthly data based on current keyword count
          const baseCount = keywordCount.length * 10;
          setMonthlyData(months.map((month, i) => ({
            name: month,
            value: baseCount + Math.floor(Math.random() * 20) + i * 3
          })));
        } else {
          setMonthlyData([
            { name: 'Ocak', value: 45 },
            { name: 'Şubat', value: 52 },
            { name: 'Mart', value: 48 },
            { name: 'Nisan', value: 61 },
            { name: 'Mayıs', value: 55 },
            { name: 'Haziran', value: 67 },
          ]);
        }
      } catch (error) {
        console.error('Dashboard data error:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
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

  const metrics = dashboardData?.metrics || {};

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-[var(--text-secondary)]">Hoş geldiniz! İşte bu haftanın genel bakışı.</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Gelir"
            value={metrics.revenue?.value || 0}
            previous={metrics.revenue?.previous}
            change={metrics.revenue?.change}
            format="currency"
            icon={<DollarSign size={24} />}
          />
          <MetricCard
            title="Müşteriler"
            value={metrics.customers?.value || 0}
            previous={metrics.customers?.previous}
            change={metrics.customers?.change}
            format="number"
            icon={<Users size={24} />}
          />
          <MetricCard
            title="SKU"
            value={metrics.sku?.value || 0}
            previous={metrics.sku?.previous}
            change={metrics.sku?.change}
            format="number"
            icon={<Package size={24} />}
          />
          <MetricCard
            title="Kar Marjı"
            value={metrics.margin?.value || 0}
            previous={metrics.margin?.previous}
            change={metrics.margin?.change}
            format="percent"
            icon={<TrendingUp size={24} />}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Haftalık Gelir Trendi"
            data={weeklyData}
            type="area"
            dataKey="value"
            xAxisKey="name"
          />
          <ChartCard
            title="Keyword Performansı"
            data={monthlyData}
            type="bar"
            dataKey="value"
            xAxisKey="name"
          />
        </div>

        {/* Top Keywords */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">En İyi Hareketler (Keywords)</h3>
          <div className="space-y-3">
            {dashboardData?.keywords?.topMovers?.map((keyword: any) => (
              <div key={keyword.id} className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-lg">
                <div>
                  <p className="text-white font-medium">{keyword.keyword}</p>
                  <p className="text-xs text-[var(--text-muted)]">{keyword.url}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${
                    keyword.position_change > 0 
                      ? 'text-[var(--green-success)]' 
                      : keyword.position_change < 0 
                      ? 'text-[var(--red-danger)]' 
                      : 'text-[var(--text-muted)]'
                  }`}>
                    {keyword.position_change > 0 ? '+' : ''}{keyword.position_change} pozisyon
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    Sıra: {keyword.current_position}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <FloatingChatButton />
    </DashboardLayout>
  );
}
