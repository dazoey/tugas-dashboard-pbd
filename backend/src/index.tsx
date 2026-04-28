import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { jsx } from 'hono/jsx'
import { cors } from 'hono/cors'
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const app = new Hono()

// CORS configuration for frontend integration
app.use('/api/*', cors())

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

// Dashboard Layout (Shared)
const Layout = (props: { children: any; title: string }) => (
  <html>
    <head>
      <title>{props.title}</title>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-slate-50 text-slate-900 font-sans">
      <nav class="bg-indigo-700 p-4 text-white shadow-lg sticky top-0 z-10">
        <div class="container mx-auto flex justify-between items-center">
          <h1 class="text-2xl font-extrabold tracking-tight">Kelompok 6</h1>
          <div class="space-x-4">
            <a href="/" class="hover:text-indigo-200 transition">Dashboard</a>
            <a href="/api/employees" class="bg-indigo-600 px-3 py-1 rounded text-sm hover:bg-indigo-500">JSON API</a>
          </div>
        </div>
      </nav>
      <main class="container mx-auto py-10 px-4">
        {props.children}
      </main>
    </body>
  </html>
)

// Main Dashboard Route
app.get('/', async (c) => {
  const page = parseInt(c.req.query('page') || '1')
  const limit = 20
  const from = (page - 1) * limit
  const to = from + limit - 1

  // Fetch data from Supabase
  const { data: employees, count, error } = await supabase
    .from('employees')
    .select('*', { count: 'exact' })
    .order('emp_no', { ascending: true })
    .range(from, to)

  if (error) {
    console.error('Supabase Error:', error)
    return c.text(`Supabase Error: ${error.message}`, 500)
  }

  console.log(`Fetched ${employees?.length} employees from total ${count}`)

  const total = count || 0
  const totalPages = Math.ceil(total / limit)

  return c.html(
    <Layout title="Dashboard - Employee List">
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <div>
            <h2 class="text-xl font-bold text-slate-800">Daftar Karyawan</h2>
            <p class="text-sm text-slate-500">Menampilkan data dari database Supabase Cloud</p>
          </div>
          <div class="text-right">
            <span class="block text-2xl font-bold text-indigo-600">{total.toLocaleString()}</span>
            <span class="text-xs uppercase tracking-wider text-slate-400 font-semibold">Total Karyawan</span>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 text-slate-600">
                <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider border-b">ID</th>
                <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider border-b">Nama Depan</th>
                <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider border-b">Nama Belakang</th>
                <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider border-b">Gender</th>
                <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider border-b">Tanggal Masuk</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              {employees?.map((emp: any) => (
                <tr key={emp.emp_no} class="hover:bg-slate-50 transition-colors">
                  <td class="px-6 py-4 font-mono text-indigo-600 font-medium">{emp.emp_no}</td>
                  <td class="px-6 py-4">{emp.first_name}</td>
                  <td class="px-6 py-4">{emp.last_name}</td>
                  <td class="px-6 py-4">
                    <span class={`px-2 py-1 rounded-full text-xs font-bold ${emp.gender === 'M' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                      {emp.gender === 'M' ? 'Pria' : 'Wanita'}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-slate-500">{new Date(emp.hire_date).toLocaleDateString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div class="p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <p class="text-sm text-slate-600 font-medium">
            Halaman <span class="text-indigo-600">{page}</span> dari <span class="text-indigo-600">{totalPages.toLocaleString()}</span>
          </p>
          <div class="flex gap-2">
            {page > 1 && (
              <a href={`/?page=${page - 1}`} class="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition">
                Sebelumnya
              </a>
            )}
            {page < totalPages && (
              <a href={`/?page=${page + 1}`} class="px-4 py-2 bg-indigo-600 rounded-md text-sm font-semibold text-white hover:bg-indigo-700 shadow-sm transition">
                Berikutnya
              </a>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
})

// Debug Route: Test Departments
app.get('/api/test-departments', async (c) => {
  const { data, error } = await supabase
    .from('departments')
    .select('*')

  if (error) {
    console.error('Supabase Departments Error:', error)
    return c.json({ success: false, error: error.message }, 500)
  }

  return c.json({ success: true, count: data.length, data })
})

// API Endpoint for Frontend Developers
app.get('/api/employees', async (c) => {
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '20')
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, count, error } = await supabase
    .from('employees')
    .select('*', { count: 'exact' })
    .order('emp_no', { ascending: true })
    .range(from, to)

  if (error) return c.json({ success: false, error: error.message }, 500)

  return c.json({
    success: true,
    data,
    meta: {
      total: count,
      page,
      limit,
      totalPages: count ? Math.ceil(count / limit) : 0
    }
  })
})

const port = Number(process.env.PORT) || 3000
console.log(`🚀 Backend ready on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
