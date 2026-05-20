import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DetailDrawer } from './components/DetailDrawer';
import { Overview } from './views/Overview';
import { TableView } from './views/TableView';
import { DepartmentsView } from './views/DepartmentsView';
import { ManagersView } from './views/ManagersView';
import { SearchResultsView } from './views/SearchResultsView';
import { apiService } from './services/api';
import type { 
  Employee, Department, Salary, Title, Manager, PaginationMeta 
} from './types';

export default function PremiumProfessionalDashboard() {
  const [view, setView] = useState('OVERVIEW');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Data States
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [titles, setTitles] = useState<Title[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [searchResults, setSearchResults] = useState<Employee[]>([]);
  const [latency, setLatency] = useState<{managers?: number, search?: number}>({});
  const [selectedItem, setSelectedItem] = useState<Employee | null>(null);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta>({ total: 0, limit: 15 });

  // Fetch Logic
  const fetchEmployees = async (p = 1) => {
    setLoading(true);
    try {
      const json = await apiService.fetchEmployees(p, meta.limit);
      if (json.data) {
        setEmployees(json.data);
        setMeta({ total: json.meta?.total || 0, limit: json.meta?.limit || 15 });
      }
    } catch (e) { console.error("ERR_FETCH_EMP", e); }
    setLoading(false);
  };

  const fetchEmployeeDetail = async (id: number) => {
    setLoading(true);
    try {
      const json = await apiService.fetchEmployeeDetail(id);
      if (json.success && json.data) {
        setSelectedItem(json.data);
      } else {
        alert("Gagal mengambil detail karyawan: " + (json.error || "Unknown Error"));
      }
    } catch (e) { 
      console.error("ERR_FETCH_DETAIL", e);
      alert("Terjadi kesalahan koneksi saat mengambil detail.");
    }
    setLoading(false);
  };

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const json = await apiService.fetchDepartments();
      if (json.success) setDepartments(json.data);
    } catch (e) { console.error("ERR_FETCH_DEPT", e); }
    setLoading(false);
  };

  const fetchSalaries = async (p = 1) => {
    setLoading(true);
    try {
      const json = await apiService.fetchSalaries(p, meta.limit);
      if (json.data) {
        setSalaries(json.data);
        setMeta({ total: json.meta?.total || 0, limit: json.meta?.limit || 15 });
      }
    } catch (e) { console.error("ERR_FETCH_SALARIES", e); }
    setLoading(false);
  };

  const fetchTitles = async (p = 1) => {
    setLoading(true);
    try {
      const json = await apiService.fetchTitles(p, meta.limit);
      if (json.data) {
        setTitles(json.data);
        setMeta({ total: json.meta?.total || 0, limit: json.meta?.limit || 15 });
      }
    } catch (e) { console.error("ERR_FETCH_TITLES", e); }
    setLoading(false);
  };

  const fetchManagers = async (p = 1) => {
    setLoading(true);
    const start = performance.now();
    try {
      const json = await apiService.fetchManagers(p, meta.limit);
      if (json.data) {
        setManagers(json.data);
        setMeta({ total: json.meta?.total || 0, limit: json.meta?.limit || 15 });
      }
    } catch (e) { console.error("ERR_FETCH_MANAGERS", e); }
    const end = performance.now();
    setLatency(prev => ({ ...prev, managers: Math.round(end - start) }));
    setLoading(false);
  };

  const executeSearch = async (term: string) => {
    if (!term) return;
    setLoading(true);
    setView('SEARCH');
    const start = performance.now();
    try {
      const json = await apiService.searchEmployees(term);
      if (json.success) setSearchResults(json.data);
    } catch (e) { console.error("ERR_SEARCH", e); }
    const end = performance.now();
    setLatency(prev => ({ ...prev, search: Math.round(end - start) }));
    setLoading(false);
  };

  useEffect(() => {
    if (view === 'EMPLOYEES') fetchEmployees(page);
    if (view === 'DEPARTMENTS') fetchDepartments();
    if (view === 'SALARIES') fetchSalaries(page);
    if (view === 'TITLES') fetchTitles(page);
    if (view === 'MANAGERS') fetchManagers(page);
  }, [view, page]);

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-white selection:text-black flex">
      
      <Sidebar 
        view={view} 
        setView={setView} 
        setSelectedItem={setSelectedItem} 
        setPage={setPage} 
        setMeta={setMeta} 
      />

      <main className="flex-1 flex flex-col min-w-0 bg-zinc-950">
        <Header 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          onSearch={executeSearch} 
        />

        <div className="p-8">
          {loading && (
            <div className="fixed top-24 right-8 z-50">
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full shadow-xl">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Syncing...</span>
              </div>
            </div>
          )}

          {view === 'OVERVIEW' && <Overview />}
          
          {(view === 'EMPLOYEES' || view === 'SALARIES' || view === 'TITLES') && (
            <TableView 
              view={view as any} 
              data={view === 'EMPLOYEES' ? employees : view === 'SALARIES' ? salaries : titles}
              meta={meta}
              page={page}
              setPage={setPage}
              onFetchDetail={fetchEmployeeDetail}
            />
          )}

          {view === 'DEPARTMENTS' && <DepartmentsView departments={departments} />}
          
          {view === 'MANAGERS' && (
            <ManagersView 
              managers={managers}
              meta={meta}
              latency={latency.managers || 0}
              page={page}
              setPage={setPage}
              onFetchDetail={fetchEmployeeDetail}
            />
          )}

          {view === 'SEARCH' && (
            <SearchResultsView 
              results={searchResults}
              searchTerm={searchTerm}
              latency={latency.search || 0}
              onFetchDetail={fetchEmployeeDetail}
            />
          )}
        </div>
      </main>

      <DetailDrawer 
        selectedItem={selectedItem} 
        onClose={() => setSelectedItem(null)} 
      />
    </div>
  );
}
