import React from 'react';
import type { Employee, Salary, Title, PaginationMeta } from '../types';
import { Pagination } from '../components/Pagination';

interface TableViewProps {
  view: 'EMPLOYEES' | 'SALARIES' | 'TITLES';
  data: any[];
  meta: PaginationMeta;
  page: number;
  setPage: (update: (p: number) => number) => void;
  onFetchDetail: (id: number) => void;
}

export const TableView: React.FC<TableViewProps> = ({ 
  view, data, meta, page, setPage, onFetchDetail 
}) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {view === 'EMPLOYEES' && 'Employee Registry'}
            {view === 'SALARIES' && 'Compensation Logs'}
            {view === 'TITLES' && 'Role Designations'}
          </h1>
          <p className="text-zinc-500 text-sm">Managing enterprise data records.</p>
        </div>
        <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest border border-zinc-800 px-3 py-1 rounded-full">
          Total Records: {meta.total}
        </div>
      </div>

      <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-zinc-900/50 border-b border-zinc-800">
                {view === 'EMPLOYEES' && (
                  <>
                    <th className="px-6 py-4 font-semibold text-zinc-400">ID</th>
                    <th className="px-6 py-4 font-semibold text-zinc-400">Identity</th>
                    <th className="px-6 py-4 font-semibold text-zinc-400">Gender</th>
                    <th className="px-6 py-4 font-semibold text-zinc-400">Hire Date</th>
                    <th className="px-6 py-4 font-semibold text-zinc-400 text-right">Actions</th>
                  </>
                )}
                {view === 'SALARIES' && (
                  <>
                    <th className="px-6 py-4 font-semibold text-zinc-400">Employee</th>
                    <th className="px-6 py-4 font-semibold text-zinc-400">Salary Amount</th>
                    <th className="px-6 py-4 font-semibold text-zinc-400">Effective Date</th>
                  </>
                )}
                {view === 'TITLES' && (
                  <>
                    <th className="px-6 py-4 font-semibold text-zinc-400">Employee</th>
                    <th className="px-6 py-4 font-semibold text-zinc-400">Designation</th>
                    <th className="px-6 py-4 font-semibold text-zinc-400">From Date</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {view === 'EMPLOYEES' && data.map((emp: Employee) => (
                <tr key={emp.emp_no} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 text-zinc-500 font-medium">{emp.emp_no}</td>
                  <td className="px-6 py-4 text-white font-medium">{emp.first_name} {emp.last_name}</td>
                  <td className="px-6 py-4 text-zinc-400">{emp.gender}</td>
                  <td className="px-6 py-4 text-zinc-400">{emp.hire_date}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => onFetchDetail(emp.emp_no)}
                      className="text-xs font-bold bg-zinc-800 text-white px-3 py-1 rounded-lg hover:bg-white hover:text-black transition-all"
                    >
                      Profile
                    </button>
                  </td>
                </tr>
              ))}
              {view === 'SALARIES' && data.map((s: Salary, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-white font-medium">{s.first_name} {s.last_name}</div>
                    <div className="text-[10px] text-zinc-500">ID: {s.emp_no}</div>
                  </td>
                  <td className="px-6 py-4 text-white font-bold">${s.salary?.toLocaleString()}</td>
                  <td className="px-6 py-4 text-zinc-400">{s.from_date}</td>
                </tr>
              ))}
              {view === 'TITLES' && data.map((t: Title, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-white font-medium">{t.first_name} {t.last_name}</div>
                    <div className="text-[10px] text-zinc-500">ID: {t.emp_no}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-zinc-800 text-zinc-200 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                      {t.title}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-400">{t.from_date}</td>
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
