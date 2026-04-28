import { useState, useEffect } from 'react'

type TabType = 'employees' | 'departments' | 'salaries' | 'titles'

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('employees')
  const [data, setData] = useState<any[]>([])
  const [meta, setMeta] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50)

  const fetchContent = async () => {
    setLoading(true)
    try {
      const resp = await fetch(`http://localhost:3000/api/${activeTab}?page=${page}&limit=${limit}`)
      if (!resp.ok) throw new Error(`HTTP Error: ${resp.status}`)
      const res = await resp.json()
      setData(res.data || [])
      setMeta(res.meta)
    } catch (e) {
      console.error("SYS_ERR:", e)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchContent() }, [activeTab, page, limit])

  const renderTable = () => {
    if (data.length === 0) {
      return (
        <div className="w-full h-full flex items-center justify-center p-10 font-mono text-sm uppercase tracking-widest text-neutral-400">
          [ NO_DATA_FOUND ]
        </div>
      )
    }
    const keys = Object.keys(data[0])

    return (
      <div className="w-full h-full overflow-auto bg-white relative">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-white z-10">
            <tr>
              <th className="w-12 border-b-2 border-black border-r border-neutral-300 px-4 py-3 bg-neutral-100"></th>
              {keys.map(k => (
                <th key={k} className="px-4 py-3 text-[10px] font-bold text-black uppercase tracking-[0.2em] border-b-2 border-black border-r border-neutral-300 whitespace-nowrap bg-neutral-100">
                  {k.replace(/_/g, ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="font-mono text-[13px]">
            {data.map((item, i) => (
              <tr key={i} className="hover:bg-black hover:text-white transition-none group cursor-crosshair">
                <td className="px-4 py-3 border-b border-r border-neutral-300 text-neutral-400 group-hover:border-black group-hover:text-neutral-500 w-12 text-center text-[10px]">
                  {(page - 1) * limit + i + 1}
                </td>
                {keys.map(k => {
                  let val = item[k]
                  if (val !== null && String(val).includes('T00:00')) {
                    val = new Date(val).toLocaleDateString('en-GB').replace(/\//g, '.')
                  }
                  return (
                    <td key={k} className="px-4 py-3 border-b border-r border-neutral-300 whitespace-nowrap group-hover:border-black">
                      {val !== null ? String(val) : '-'}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const tabs: { id: TabType, label: string, code: string }[] = [
    { id: 'employees', label: 'Employees', code: 'EMP_01' },
    { id: 'departments', label: 'Departments', code: 'DPT_02' },
    { id: 'salaries', label: 'Salaries', code: 'SAL_03' },
    { id: 'titles', label: 'Titles', code: 'TTL_04' },
  ]

  return (
    <div className="flex h-screen w-full bg-white text-black font-sans selection:bg-black selection:text-white overflow-hidden">
      
      {/* SIDEBAR - INDEX / MANIFEST */}
      <aside className="w-72 border-r border-black flex flex-col justify-between shrink-0 bg-white z-20">
        <div>
          <div className="p-6 border-b border-black bg-black text-white">
            <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">SYS.K6</h1>
            <p className="font-mono text-[10px] tracking-widest mt-2 text-neutral-400">DATABASE_MANIFEST // V.1.0.0</p>
          </div>
          <nav className="flex flex-col">
            {tabs.map((item) => (
              <button
                key={item.id}
                onClick={() => { 
                  if(activeTab !== item.id) {
                    setData([]); setMeta(null); setActiveTab(item.id); setPage(1); 
                  }
                }}
                className={`w-full flex items-center justify-between px-6 py-5 border-b border-black uppercase text-sm font-bold tracking-widest transition-none text-left
                  ${activeTab === item.id ? 'bg-black text-white' : 'bg-white text-black hover:bg-neutral-100'}
                `}
              >
                <span>{item.label}</span>
                <span className={`font-mono text-[10px] ${activeTab === item.id ? 'text-neutral-400' : 'text-neutral-500'}`}>[{item.code}]</span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6 font-mono text-[10px] tracking-widest uppercase border-t border-black text-neutral-500">
          STATUS: <span className="text-black font-bold">ONLINE</span><br/>
          HOST: LOCALHOST:3000<br/>
          DB: SUPABASE_CLOUD
        </div>
      </aside>

      {/* MAIN PANEL */}
      <main className="flex-1 flex flex-col overflow-hidden bg-neutral-50 relative">
        
        {/* HEADER */}
        <header className="border-b border-black p-6 md:p-8 bg-white flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
          <div>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">{activeTab}</h2>
            <div className="flex items-center gap-4 mt-4 font-mono text-xs uppercase tracking-widest">
              <span className="bg-black text-white px-2 py-1">INDEX_{activeTab.substring(0, 3)}</span>
              <span className="text-neutral-500">RAW_DATA_VIEW</span>
            </div>
          </div>
          
          <div className="text-right border-l-4 border-black pl-6">
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] mb-1">Total_Records</p>
            <p className="font-mono text-3xl md:text-4xl font-black tracking-tighter leading-none">
              {meta?.total ? new Intl.NumberFormat('en-US').format(meta.total) : '---'}
            </p>
          </div>
        </header>

        {/* DATA CONTAINER */}
        <div className="flex-1 overflow-hidden relative">
          {loading && (
            <div className="absolute inset-0 bg-white/80 z-20 flex items-center justify-center backdrop-blur-[1px]">
               <div className="font-mono text-sm font-bold uppercase tracking-widest bg-black text-white px-6 py-3 animate-pulse">
                 [ EXECUTING_QUERY... ]
               </div>
            </div>
          )}
          {renderTable()}
        </div>

        {/* FOOTER / CONTROL BAR */}
        <div className="border-t border-black bg-white flex flex-col sm:flex-row items-center justify-between shrink-0">
          
          <div className="flex items-center border-b sm:border-b-0 sm:border-r border-black w-full sm:w-auto">
            <div className="px-6 py-4 font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-500 border-r border-black">
              LIMIT
            </div>
            <select 
              value={limit} 
              onChange={e => {setLimit(Number(e.target.value)); setPage(1)}} 
              className="bg-transparent font-mono text-sm font-bold pl-4 pr-8 py-4 outline-none cursor-pointer hover:bg-neutral-100 transition-none appearance-none"
              style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
            >
              {[50, 100, 250, 500].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          <div className="flex items-center w-full sm:w-auto justify-between sm:justify-end">
            <div className="px-6 py-4 font-mono text-xs uppercase tracking-widest text-neutral-500">
              PG <span className="text-black font-bold">{page}</span> / {meta?.totalPages || 1}
            </div>
            <div className="flex border-l border-black h-full">
              <button 
                disabled={page <= 1} 
                onClick={() => setPage(page-1)} 
                className="px-6 py-4 border-r border-black font-mono text-sm font-bold uppercase hover:bg-black hover:text-white disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-black transition-none"
              >
                &#8592;
              </button>
              <button 
                disabled={page >= (meta?.totalPages || 1)} 
                onClick={() => setPage(page+1)} 
                className="px-6 py-4 font-mono text-sm font-bold uppercase hover:bg-black hover:text-white disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-black transition-none"
              >
                &#8594;
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

export default App