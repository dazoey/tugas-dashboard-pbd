import React from 'react';
import { Building2, Users } from 'lucide-react';
import type { Department } from '../types';

interface DepartmentsViewProps {
  departments: Department[];
}

export const DepartmentsView: React.FC<DepartmentsViewProps> = ({ departments }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-white tracking-tight">Organization Structure</h1>
        <p className="text-zinc-500 text-sm">Current active departments and business units.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept: Department) => (
          <div key={dept.dept_no} className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-8 hover:bg-zinc-800/50 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-zinc-800 rounded-xl group-hover:bg-white group-hover:text-black transition-all">
                <Building2 size={24} />
              </div>
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{dept.dept_no}</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight mb-2">{dept.dept_name}</h3>
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-medium">
              <Users size={14} /> Active Personnel
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
