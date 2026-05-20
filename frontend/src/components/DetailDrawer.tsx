import React from 'react';
import { X, Building2, ShieldCheck, TrendingUp } from 'lucide-react';
import type { Employee } from '../types';

interface DetailDrawerProps {
  selectedItem: Employee | null;
  onClose: () => void;
}

export const DetailDrawer: React.FC<DetailDrawerProps> = ({ selectedItem, onClose }) => {
  if (!selectedItem) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Drawer Content */}
      <div className="relative w-full max-w-xl bg-zinc-950 h-full border-l border-zinc-800 p-8 md:p-12 overflow-y-auto shadow-2xl transition-transform transform translate-x-0">
        <div className="flex justify-between items-start mb-16">
          <div>
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">Employee Dossier // {selectedItem.emp_no}</div>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tighter leading-tight">
              {selectedItem.first_name}<br/>{selectedItem.last_name}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors">
            <X size={32} />
          </button>
        </div>

        <div className="space-y-12">
          <section className="grid grid-cols-2 gap-8 border-y border-zinc-800 py-8">
            <div>
              <h4 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Birth Date</h4>
              <p className="text-lg font-medium text-zinc-300">{selectedItem.birth_date}</p>
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Gender Class</h4>
              <p className="text-lg font-medium text-zinc-300">{selectedItem.gender}</p>
            </div>
          </section>

          {selectedItem.dept_emp && selectedItem.dept_emp.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Building2 size={18} className="text-zinc-500" />
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Department Assignment</h3>
              </div>
              <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                <span className="font-bold text-zinc-200">
                  {selectedItem.dept_emp[0]?.departments?.dept_name}
                </span>
              </div>
            </section>
          )}

          <section>
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck size={18} className="text-zinc-500" />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Rank History</h3>
            </div>
            <div className="space-y-3">
              {selectedItem.titles?.map((t: any, i: number) => (
                <div key={i} className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl flex justify-between items-center">
                  <span className="font-bold text-zinc-200">{t.title}</span>
                  <span className="text-[10px] font-medium text-zinc-500">
                    {t.from_date} — {t.to_date === '9999-01-01' ? 'Current' : t.to_date}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp size={18} className="text-zinc-500" />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Compensation Logs</h3>
            </div>
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-zinc-800/50">
                  {selectedItem.salaries?.map((s: any, i: number) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 pl-6 text-xl font-bold text-white">${s.salary.toLocaleString()}</td>
                      <td className="p-4 text-right pr-6 text-xs text-zinc-500 font-medium">{s.from_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
