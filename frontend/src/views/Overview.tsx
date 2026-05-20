import React from 'react';
import { Users, Building2, DollarSign, Activity, Clock } from 'lucide-react';
import { StatCard } from '../components/StatCard';

export const Overview: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-white tracking-tight">Executive Overview</h1>
        <p className="text-zinc-500 text-sm">Real-time enterprise metrics and system activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Employees" value="300,024" icon={Users} trend="+12.5%" />
        <StatCard label="Departments" value="9 Active" icon={Building2} />
        <StatCard label="Avg. Salary" value="$67,420" icon={DollarSign} trend="+2.4%" />
        <StatCard label="System Load" value="Normal" icon={Activity} />
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Clock size={20} className="text-zinc-500" /> Recent System Activity
            </h2>
          </div>
          <div className="space-y-6">
            {[
              { time: '14:02', event: 'NEW_TITLE', desc: 'Georgi Facello updated to Senior Engineer', type: 'info' },
              { time: '13:45', event: 'SYSTEM', desc: 'Department "Research" synced successfully', type: 'success' },
              { time: '12:10', event: 'SALARY_MOD', desc: 'Adjusted base pay for Finance department', type: 'warning' },
              { time: '10:00', event: 'BACKUP', desc: 'Full database snapshot completed', type: 'neutral' }
            ].map((log, i) => (
              <div key={i} className="flex gap-4">
                <div className="text-[10px] font-bold text-zinc-600 mt-1">{log.time}</div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-zinc-300 mb-1">{log.event}</div>
                  <div className="text-sm text-zinc-500">{log.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
