import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()
const app = new Hono()
app.use('/api/*', cors())

const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_ANON_KEY || '')

const fetchData = async (c: any, tableName: string) => {
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '20')
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase.from(tableName).select('*', { count: 'exact' })
  
  // WAJIB ADA ORDER agar Supabase mau mengirimkan baris data
  if (tableName === 'departments') {
    query = query.order('dept_no', { ascending: true })
  } else {
    query = query.order('emp_no', { ascending: true })
  }

  const { data, count, error } = await query.range(from, to)

  if (error) {
    console.error(`Error dari Supabase (${tableName}):`, error)
    return c.json({ success: false, error: error.message }, 500)
  }
  
  return c.json({ success: true, data, meta: { total: count, page, limit, totalPages: Math.ceil((count || 0) / limit) } })
}

app.get('/api/employees', (c) => fetchData(c, 'employees'))
app.get('/api/departments', (c) => fetchData(c, 'departments'))
app.get('/api/titles', (c) => fetchData(c, 'titles'))
app.get('/api/salaries', (c) => fetchData(c, 'salaries'))

const port = 3000
console.log(`🚀 API Server running on http://localhost:${port}`)
serve({ fetch: app.fetch, port })