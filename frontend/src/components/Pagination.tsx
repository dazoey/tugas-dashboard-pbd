import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PaginationMeta } from '../types';

interface PaginationProps {
  page: number;
  meta: PaginationMeta;
  setPage: (update: (p: number) => number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ page, meta, setPage }) => {
  return (
    <div className="p-4 border-t border-zinc-800 flex justify-between items-center bg-black/20">
      <button 
        disabled={page === 1}
        onClick={() => setPage(p => p - 1)}
        className="p-2 text-zinc-400 hover:text-white disabled:opacity-20 transition-colors"
      >
        <ChevronLeft size={24} />
      </button>
      <div className="text-xs font-bold text-zinc-500 uppercase tracking-[0.3em]">Page {page}</div>
      <button 
        disabled={page * meta.limit >= meta.total}
        onClick={() => setPage(p => p + 1)}
        className="p-2 text-zinc-400 hover:text-white disabled:opacity-20 transition-colors"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};
