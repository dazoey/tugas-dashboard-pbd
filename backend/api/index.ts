import { handle } from '@hono/node-server/vercel'
import { Hono } from 'hono'
import { jsx } from 'hono/jsx'
import { cors } from 'hono/cors'
import { createClient } from '@supabase/supabase-js'

const app = new Hono().basePath('/api')

// Setup yang sama seperti di src/index.tsx
app.use('/*', cors())

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
)

app.get('/employees', async (c) => {
  const page = parseInt(c.req.query('page') || '1')
  const limit = 20
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, count, error } = await supabase
    .from('employees')
    .select('*', { count: 'exact' })
    .order('emp_no', { ascending: true })
    .range(from, to)

  if (error) return c.json({ error: error.message }, 500)

  return c.json({ data, total: count, page, limit })
})

export default handle(app)
