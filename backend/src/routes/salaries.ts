import { Hono } from 'hono'
import { supabase } from '../lib/supabase'

const salaries = new Hono()

// Ambil log gaji terbaru dengan paginasi
salaries.get('/', async (c) => {
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '50')
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data: salariesData, count, error } = await supabase
    .from('salaries')
    .select('emp_no, salary, from_date, to_date', { count: 'exact' })
    .order('from_date', { ascending: false })
    .range(from, to)

  if (error) return c.json({ success: false, error: error.message }, 500)
  
  if (!salariesData || salariesData.length === 0) {
    return c.json({ success: true, data: [], meta: { total: count || 0, page, limit } })
  }

  // Fetch related employees manually to bypass schema cache issues
  const empNos = [...new Set(salariesData.map(s => s.emp_no))]
  const { data: employeesData, error: empError } = await supabase
    .from('employees')
    .select('emp_no, first_name, last_name')
    .in('emp_no', empNos)

  if (empError) return c.json({ success: false, error: empError.message }, 500)

  // Flatten response untuk frontend
  const formatted = salariesData.map(s => {
    const emp = employeesData?.find(e => e.emp_no === s.emp_no)
    return {
      emp_no: s.emp_no,
      salary: s.salary,
      from_date: s.from_date,
      to_date: s.to_date,
      first_name: emp?.first_name,
      last_name: emp?.last_name
    }
  })

  return c.json({ success: true, data: formatted, meta: { total: count, page, limit } })
})

export default salaries
