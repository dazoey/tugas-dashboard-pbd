import { Hono } from 'hono'
import { supabase } from '../lib/supabase'

const managers = new Hono()

// Ambil data profil manajer dari View manager_profiles (Tugas A)
managers.get('/', async (c) => {
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '50')
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, count, error } = await supabase
    .from('manager_profiles')
    .select('*', { count: 'exact' })
    .order('from_date', { ascending: false })
    .range(from, to)

  if (error) return c.json({ success: false, error: error.message }, 500)
  return c.json({ success: true, data, meta: { total: count, page, limit } })
})

export default managers
