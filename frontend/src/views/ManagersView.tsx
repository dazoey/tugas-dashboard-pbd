import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { Manager, PaginationMeta } from '../types';
import { Pagination } from '../components/Pagination';

interface ManagersViewProps {
  managers: Manager[];
  meta: PaginationMeta;
  latency: number;
  page: number;
  setPage: (update: (p: number) => number) => void;
  onFetchDetail: (id: number) => void;
}

export const ManagersView: React.FC<ManagersViewProps> = ({ 
  managers, meta, latency, page, setPage, onFetchDetail 
}) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-white tracking-tight">Managers Report</h1>
          <p className="text-zinc-500 text-sm">Historical and current department managers.</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest border border-emerald-900/50 bg-emerald-900/20 px-3 py-1 rounded-full">
            Query Latency: {latency || 0} ms
          </div>
          <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest border border-zinc-800 px-3 py-1 rounded-full">
            Total Records: {meta.total}
          </div>
        </div>
      </div>

      <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-zinc-900/50 border-b border-zinc-800">
                <th className="px-6 py-4 font-semibold text-zinc-400">ID</th>
                <th className="px-6 py-4 font-semibold text-zinc-400">Manager Identity</th>
                <th className="px-6 py-4 font-semibold text-zinc-400">Department</th>
                <th className="px-6 py-4 font-semibold text-zinc-400">Tenure Period</th>
                <th className="px-6 py-4 font-semibold text-zinc-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {managers.map((mgr: any, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 text-zinc-500 font-medium">{mgr.emp_no}</td>
                  <td className="px-6 py-4 text-white font-medium">{mgr.first_name} {mgr.last_name}</td>
                  <td className="px-6 py-4">
                    <span className="bg-zinc-800 text-zinc-200 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                      {mgr.dept_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-400 font-mono text-xs">
                    {mgr.from_date} <ArrowRight size={10} className="inline mx-1" /> {mgr.to_date === '9999-01-01' ? 'Current' : mgr.to_date}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => onFetchDetail(mgr.emp_no)}
                      className="text-xs font-bold bg-zinc-800 text-white px-3 py-1 rounded-lg hover:bg-white hover:text-black transition-all"
                    >Profile</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} meta={meta} setPage={setPage} />
      </div>
    </div>
  );
};
