'use client'

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatNumber, formatPercent, formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';

type MetricCardProps = {
  title: string;
  value: number;
  previous?: number;
  change?: number;
  format?: 'number' | 'currency' | 'percent';
  icon?: React.ReactNode;
};

export function MetricCard({ title, value, previous, change, format = 'number', icon }: MetricCardProps) {
  const formattedValue = 
    format === 'currency' ? formatCurrency(value) :
    format === 'percent' ? `${value.toFixed(1)}%` :
    formatNumber(value);

  const deltaPercent = change !== undefined ? change :
    previous ? ((value - previous) / previous * 100) : 0;

  const isPositive = deltaPercent >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 card-hover"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-[var(--text-secondary)] font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-white mt-2">{formattedValue}</h3>
        </div>
        {icon && (
          <div className="w-12 h-12 bg-[var(--purple-primary)]/20 rounded-lg flex items-center justify-center text-[var(--purple-primary)]">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {isPositive ? (
          <TrendingUp size={16} className="text-[var(--green-success)]" />
        ) : (
          <TrendingDown size={16} className="text-[var(--red-danger)]" />
        )}
        <span className={`text-sm font-semibold ${isPositive ? 'text-[var(--green-success)]' : 'text-[var(--red-danger)]'}`}>
          {formatPercent(deltaPercent)}
        </span>
        <span className="text-xs text-[var(--text-muted)]">önceki döneme göre</span>
      </div>

      {/* Sparkline placeholder */}
      <div className="mt-4 h-12 bg-[var(--bg-secondary)]/50 rounded flex items-end gap-1 px-2 py-2">
        {Array.from({ length: 12 }).map((_, i) => {
          const height = Math.random() * 100;
          return (
            <div
              key={i}
              className="flex-1 bg-[var(--purple-primary)]/40 rounded-sm"
              style={{ height: `${height}%` }}
            />
          );
        })}
      </div>
    </motion.div>
  );
}
