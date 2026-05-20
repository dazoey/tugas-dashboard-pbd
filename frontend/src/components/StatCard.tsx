import React from 'react';
import { TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, trend }) => (
  <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl hover:bg-zinc-800/50 transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-zinc-800 rounded-lg group-hover:bg-white group-hover:text-black transition-colors">
        <Icon size={20} />
      </div>
      {trend && (
        <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
          <TrendingUp size={12} /> {trend}
        </span>
      )}
    </div>
    <div className="text-sm font-medium text-zinc-500 mb-1">{label}</div>
    <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
  </div>
);
