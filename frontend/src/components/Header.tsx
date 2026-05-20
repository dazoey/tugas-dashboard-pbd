import React from 'react';
import { Search, RefreshCcw } from 'lucide-react';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSearch: (term: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ searchTerm, setSearchTerm, onSearch }) => {
  return (
    <header className="h-20 border-b border-zinc-800 px-8 flex items-center justify-between bg-black/20 backdrop-blur-md sticky top-0 z-10">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
        <input 
          type="text" 
          value={searchTerm}
          placeholder="Search database (press Enter)..." 
          className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-zinc-700 transition-all"
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSearch(searchTerm);
          }}
        />
      </div>
      
      <div className="flex items-center gap-4">
        <button onClick={() => window.location.reload()} className="p-2 text-zinc-400 hover:text-white transition-colors">
          <RefreshCcw size={20} />
        </button>
      </div>
    </header>
  );
};
