"use client";
import React, { useState, useEffect } from 'react';
import { 
  Users, Building2, Briefcase, DollarSign, ShieldCheck, 
  Search, RefreshCcw, ArrowRight, ChevronLeft, ChevronRight, X,
  Activity, LayoutDashboard, Database, TrendingUp, Clock
} from 'lucide-react';

const API_BASE = 'http://localhost:3000/api';

export default function PremiumProfessionalDashboard() {
  const [view, setView] = useState('OVERVIEW');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Data States
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [titles, setTitles] = useState([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, limit: 15 });

  // Fetch Logic
  const fetchEmployees = async (p = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/employees?page=${p}&limit=${meta.limit}`);
      const json = await res.json();
      if (json.data) {
        setEmployees(json.data);
        setMeta({ total: json.total || 0, limit: json.limit || 15 });
      }
    } catch (e) { console.error("ERR_FETCH_EMP", e); }
    setLoading(false);
  };

  const fetchEmployeeDetail = async (id: number) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/employees/${id}`);
      const json = await res.json();
      if (json.success) setSelectedItem(json.data);
    } catch (e) { console.error("ERR_FETCH_DETAIL", e); }
    setLoading(false);
  };

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/departments`);
      const json = await res.json();
      if (json.success) setDepartments(json.data);
    } catch (e) { console.error("ERR_FETCH_DEPT", e); }
    setLoading(false);
  };

  const fetchSalaries = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/salaries`);
      const json = await res.json();
      if (json.success) setSalaries(json.data);
    } catch (e) { console.error("ERR_FETCH_SALARIES", e); }
    setLoading(false);
  };

  const fetchTitles = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/titles`);
      const json = await res.json();
      if (json.success) setTitles(json.data);
    } catch (e) { console.error("ERR_FETCH_TITLES", e); }
    setLoading(false);
  };

  useEffect(() => {
    if (view === 'EMPLOYEES') fetchEmployees(page);
    if (view === 'DEPARTMENTS') fetchDepartments();
    if (view === 'SALARIES') fetchSalaries();
    if (view === 'TITLES') fetchTitles();
  }, [view, page]);

  // UI Components
  const StatCard = ({ label, value, icon: Icon, trend }) => (
    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl hover:bg-zinc-800/50 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-zinc-800 rounded-lg group-hover:bg-white group-hover:text-black transition-colors">
          <Icon size={20} />
        </div>
        {trend && (
          <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
            <TrendingUp size={12} /> {trend}
          </span>
        )}
      </div>
      <div className="text-sm font-medium text-zinc-500 mb-1">{label}</div>
      <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
    </div>
  );

  const NavItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => { setView(id); setSelectedItem(null); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
        ${view === id 
          ? 'bg-white text-black shadow-lg shadow-white/10' 
          : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-white selection:text-black flex">
      
      {/* SIDEBAR */}
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
          <NavItem id="OVERVIEW" icon={LayoutDashboard} label="Dashboard" />
          <NavItem id="EMPLOYEES" icon={Users} label="Employees" />
          <NavItem id="DEPARTMENTS" icon={Building2} label="Departments" />
          
          <div className="pt-8 pb-4">
            <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-4 mb-4">Financials</div>
            <NavItem id="SALARIES" icon={DollarSign} label="Payroll Logs" />
            <NavItem id="TITLES" icon={Briefcase} label="Rank Registry" />
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

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 bg-zinc-950">
        
        {/* HEADER */}
        <header className="h-20 border-b border-zinc-800 px-8 flex items-center justify-between bg-black/20 backdrop-blur-md sticky top-0 z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input 
              type="text" 
              placeholder="Search database..." 
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-zinc-700 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={() => window.location.reload()} className="p-2 text-zinc-400 hover:text-white transition-colors">
              <RefreshCcw size={20} />
            </button>
            <div className="h-8 w-[1px] bg-zinc-800 mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <div className="text-xs font-bold text-white">ADMIN_ROOT</div>
                <div className="text-[10px] text-zinc-500">System Administrator</div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-tr from-zinc-800 to-zinc-700 rounded-full border border-zinc-700" />
            </div>
          </div>
        </header>

        {/* VIEWPORT */}
        <div className="p-8">
          
          {/* VIEW: OVERVIEW */}
          {view === 'OVERVIEW' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-white tracking-tight">Executive Overview</h1>
                <p className="text-zinc-500 text-sm">Real-time enterprise metrics and system activity.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total Employees" value="300,024" icon={Users} trend="+12.5%" />
                <StatCard label="Departments" value="9 Active" icon={Building2} />
                <StatCard label="Avg. Salary" value="$67,420" icon={DollarSign} trend="+2.4%" />
                <StatCard label="System Load" value="Normal" icon={Activity} />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-zinc-900/30 border border-zinc-800 rounded-2xl p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Clock size={20} className="text-zinc-500" /> Recent System Activity
                    </h2>
                    <button className="text-xs font-bold text-zinc-500 hover:text-white transition-colors">View All</button>
                  </div>
                  <div className="space-y-6">
                    {[
                      { time: '14:02', event: 'NEW_TITLE', desc: 'Georgi Facello updated to Senior Engineer', type: 'info' },
                      { time: '13:45', event: 'SYSTEM', desc: 'Department "Research" synced successfully', type: 'success' },
                      { time: '12:10', event: 'SALARY_MOD', desc: 'Adjusted base pay for Finance department', type: 'warning' },
                      { time: '10:00', event: 'BACKUP', desc: 'Full database snapshot completed', type: 'neutral' }
                    ].map((log, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="text-[10px] font-bold text-zinc-600 mt-1">{log.time}</div>
                        <div className="flex-1">
                          <div className="text-xs font-bold text-zinc-300 mb-1">{log.event}</div>
                          <div className="text-sm text-zinc-500">{log.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 text-black">
                  <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
                  <div className="space-y-3">
                    <button className="w-full bg-black text-white py-4 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
                      Add New Employee
                    </button>
                    <button className="w-full border-2 border-black py-4 rounded-xl font-bold text-sm hover:bg-black hover:text-white transition-all">
                      Export Report
                    </button>
                    <button className="w-full text-zinc-500 py-2 font-bold text-xs hover:text-black transition-colors">
                      System Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: TABLES (Shared Style) */}
          {(view === 'EMPLOYEES' || view === 'SALARIES' || view === 'TITLES') && (
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
                {view === 'EMPLOYEES' && (
                  <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest border border-zinc-800 px-3 py-1 rounded-full">
                    Total Records: {meta.total}
                  </div>
                )}
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
                      {view === 'EMPLOYEES' && employees.map((emp: any) => (
                        <tr key={emp.emp_no} className="hover:bg-white/5 transition-colors group">
                          <td className="px-6 py-4 text-zinc-500 font-medium">{emp.emp_no}</td>
                          <td className="px-6 py-4 text-white font-medium">{emp.first_name} {emp.last_name}</td>
                          <td className="px-6 py-4 text-zinc-400">{emp.gender}</td>
                          <td className="px-6 py-4 text-zinc-400">{emp.hire_date}</td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => fetchEmployeeDetail(emp.emp_no)}
                              className="text-xs font-bold bg-zinc-800 text-white px-3 py-1 rounded-lg hover:bg-white hover:text-black transition-all"
                            >
                              Profile
                            </button>
                          </td>
                        </tr>
                      ))}
                      {view === 'SALARIES' && salaries.map((s: any, i) => (
                        <tr key={i} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="text-white font-medium">{s.first_name} {s.last_name}</div>
                            <div className="text-[10px] text-zinc-500">ID: {s.emp_no}</div>
                          </td>
                          <td className="px-6 py-4 text-white font-bold">${s.salary?.toLocaleString()}</td>
                          <td className="px-6 py-4 text-zinc-400">{s.from_date}</td>
                        </tr>
                      ))}
                      {view === 'TITLES' && titles.map((t: any, i) => (
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

                {view === 'EMPLOYEES' && (
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
                      onClick={() => setPage(p => p + 1)}
                      className="p-2 text-zinc-400 hover:text-white transition-colors"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW: DEPARTMENTS */}
          {view === 'DEPARTMENTS' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-white tracking-tight">Organization Structure</h1>
                <p className="text-zinc-500 text-sm">Current active departments and business units.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map((dept: any) => (
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
          )}
        </div>
      </main>

      {/* DETAIL DRAWER */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 flex justify-end">
          <div className="w-full max-w-xl bg-zinc-950 h-full border-l border-zinc-800 p-12 overflow-y-auto animate-in slide-in-from-right duration-500 shadow-2xl">
            <div className="flex justify-between items-start mb-16">
              <div>
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">Employee Dossier // {selectedItem.emp_no}</div>
                <h2 className="text-5xl font-bold text-white tracking-tighter leading-tight">
                  {selectedItem.first_name}<br/>{selectedItem.last_name}
                </h2>
              </div>
              <button onClick={() => setSelectedItem(null)} className="p-2 text-zinc-500 hover:text-white transition-colors">
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
      )}
    </div>
  );
}