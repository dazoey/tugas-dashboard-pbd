import { Hono } from 'hono'
import { supabase } from '../lib/supabase'

const titles = new Hono()

// Ambil log jabatan terbaru dengan paginasi
titles.get('/', async (c) => {
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '50')
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data: titlesData, count, error } = await supabase
    .from('titles')
    .select('emp_no, title, from_date, to_date', { count: 'exact' })
    .order('from_date', { ascending: false })
    .range(from, to)

  if (error) return c.json({ success: false, error: error.message }, 500)
  
  if (!titlesData || titlesData.length === 0) {
    return c.json({ success: true, data: [], meta: { total: count || 0, page, limit } })
  }

  // Fetch related employees manually to bypass schema cache issues
  const empNos = [...new Set(titlesData.map(t => t.emp_no))]
  const { data: employeesData, error: empError } = await supabase
    .from('employees')
    .select('emp_no, first_name, last_name')
    .in('emp_no', empNos)

  if (empError) return c.json({ success: false, error: empError.message }, 500)

  // Flatten response untuk frontend
  const formatted = titlesData.map(t => {
    const emp = employeesData?.find(e => e.emp_no === t.emp_no)
    return {
      emp_no: t.emp_no,
      title: t.title,
      from_date: t.from_date,
      to_date: t.to_date,
      first_name: emp?.first_name,
      last_name: emp?.last_name
    }
  })

  return c.json({ success: true, data: formatted, meta: { total: count, page, limit } })
})

export default titles
