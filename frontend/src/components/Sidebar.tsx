import React from 'react';
import { 
  Users, Building2, Briefcase, DollarSign, ShieldCheck, 
  LayoutDashboard, Database 
} from 'lucide-react';
import { NavItem } from './NavItem';
import type { PaginationMeta } from '../types';

interface SidebarProps {
  view: string;
  setView: (id: string) => void;
  setSelectedItem: (item: any) => void;
  setPage: (page: number) => void;
  setMeta: (meta: PaginationMeta) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ view, setView, setSelectedItem, setPage, setMeta }) => {
  return (
    <aside className="w-64 border-r border-zinc-800 flex flex-col sticky top-0 h-screen bg-black/50 backdrop-blur-xl z-20">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Database className="text-black" size={18} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">NEXUS</span>
        </div>
        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Enterprise Core</div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-4 mb-4">Main Menu</div>
        <NavItem id="OVERVIEW" icon={LayoutDashboard} label="Dashboard" activeView={view} setView={setView} setSelectedItem={setSelectedItem} setPage={setPage} setMeta={setMeta} />
        <NavItem id="EMPLOYEES" icon={Users} label="Employees" activeView={view} setView={setView} setSelectedItem={setSelectedItem} setPage={setPage} setMeta={setMeta} />
        <NavItem id="MANAGERS" icon={ShieldCheck} label="Managers Report" activeView={view} setView={setView} setSelectedItem={setSelectedItem} setPage={setPage} setMeta={setMeta} />
        <NavItem id="DEPARTMENTS" icon={Building2} label="Departments" activeView={view} setView={setView} setSelectedItem={setSelectedItem} setPage={setPage} setMeta={setMeta} />
        
        <div className="pt-8 pb-4">
          <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-4 mb-4">Financials</div>
          <NavItem id="SALARIES" icon={DollarSign} label="Payroll Logs" activeView={view} setView={setView} setSelectedItem={setSelectedItem} setPage={setPage} setMeta={setMeta} />
          <NavItem id="TITLES" icon={Briefcase} label="Rank Registry" activeView={view} setView={setView} setSelectedItem={setSelectedItem} setPage={setPage} setMeta={setMeta} />
        </div>
      </nav>

      <div className="p-6 border-t border-zinc-800">
        <div className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-xl border border-zinc-800">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            System Online: 99.9%
          </div>
        </div>
      </div>
    </aside>
  );
};
