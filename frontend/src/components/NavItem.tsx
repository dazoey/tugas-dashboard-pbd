import React from 'react';
import type { LucideIcon } from 'lucide-react';
import type { PaginationMeta } from '../types';

interface NavItemProps {
  id: string;
  icon: LucideIcon;
  label: string;
  activeView: string;
  setView: (id: string) => void;
  setSelectedItem: (item: any) => void;
  setPage: (page: number) => void;
  setMeta: (meta: PaginationMeta) => void;
}

export const NavItem: React.FC<NavItemProps> = ({ 
  id, icon: Icon, label, activeView, setView, setSelectedItem, setPage, setMeta 
}) => (
  <button
    onClick={() => { 
      setView(id); 
      setSelectedItem(null); 
      setPage(1);
      setMeta({ total: 0, limit: 15 });
    }}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
      ${activeView === id 
        ? 'bg-white text-black shadow-lg shadow-white/10' 
        : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
  >
    <Icon size={18} />
    <span>{label}</span>
  </button>
);
