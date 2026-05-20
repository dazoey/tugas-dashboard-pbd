import React from 'react';
import type { Employee } from '../types';

interface SearchResultsViewProps {
  results: Employee[];
  searchTerm: string;
  latency: number;
  onFetchDetail: (id: number) => void;
}

export const SearchResultsView: React.FC<SearchResultsViewProps> = ({ 
  results, searchTerm, latency, onFetchDetail 
}) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-white tracking-tight">Search Results</h1>
          <p className="text-zinc-500 text-sm">Last name search for: "{searchTerm}"</p>
        </div>
        <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest border border-emerald-900/50 bg-emerald-900/20 px-3 py-1 rounded-full">
          Query Latency: {latency || 0} ms
        </div>
      </div>
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-zinc-900/50 border-b border-zinc-800">
                <th className="px-6 py-4 font-semibold text-zinc-400">ID</th>
                <th className="px-6 py-4 font-semibold text-zinc-400">Identity</th>
                <th className="px-6 py-4 font-semibold text-zinc-400">Gender</th>
                <th className="px-6 py-4 font-semibold text-zinc-400">Hire Date</th>
                <th className="px-6 py-4 font-semibold text-zinc-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {results.map((emp: Employee) => (
                <tr key={emp.emp_no} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 text-zinc-500 font-medium">{emp.emp_no}</td>
                  <td className="px-6 py-4 text-white font-medium">{emp.first_name} {emp.last_name}</td>
                  <td className="px-6 py-4 text-zinc-400">{emp.gender}</td>
                  <td className="px-6 py-4 text-zinc-400">{emp.hire_date}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => onFetchDetail(emp.emp_no)}
                      className="text-xs font-bold bg-zinc-800 text-white px-3 py-1 rounded-lg hover:bg-white hover:text-black transition-all"
                    >Profile</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
