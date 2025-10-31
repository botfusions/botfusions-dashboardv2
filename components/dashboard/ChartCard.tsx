'use client'

import React from 'react';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

type ChartCardProps = {
  title: string;
  data: any[];
  type?: 'line' | 'area' | 'bar';
  dataKey?: string;
  xAxisKey?: string;
  children?: React.ReactNode;
};

export function ChartCard({ 
  title, 
  data, 
  type = 'area', 
  dataKey = 'value',
  xAxisKey = 'name',
  children 
}: ChartCardProps) {
  
  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 10, right: 10, left: 0, bottom: 0 }
    };

    switch (type) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey={xAxisKey} stroke="var(--text-muted)" style={{ fontSize: '12px' }} />
            <YAxis stroke="var(--text-muted)" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--bg-card)', 
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'white'
              }} 
            />
            <Line type="monotone" dataKey={dataKey} stroke="var(--purple-primary)" strokeWidth={2} />
          </LineChart>
        );
      
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey={xAxisKey} stroke="var(--text-muted)" style={{ fontSize: '12px' }} />
            <YAxis stroke="var(--text-muted)" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--bg-card)', 
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'white'
              }} 
            />
            <Bar dataKey={dataKey} fill="var(--purple-primary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      
      case 'area':
      default:
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--purple-primary)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--purple-primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey={xAxisKey} stroke="var(--text-muted)" style={{ fontSize: '12px' }} />
            <YAxis stroke="var(--text-muted)" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--bg-card)', 
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'white'
              }} 
            />
            <Area type="monotone" dataKey={dataKey} stroke="var(--purple-primary)" fillOpacity={1} fill="url(#colorGradient)" />
          </AreaChart>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <button className="p-2 text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-secondary)] rounded-lg transition-all">
          <Download size={18} />
        </button>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {children && (
        <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
          {children}
        </div>
      )}
    </motion.div>
  );
}
