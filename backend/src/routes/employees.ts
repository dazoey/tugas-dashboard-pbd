import { Hono } from 'hono'
import { supabase } from '../lib/supabase'

const employees = new Hono()

// Ambil daftar karyawan dengan paginasi
employees.get('/', async (c) => {
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
  return c.json({ success: true, data, meta: { total: count, page, limit } })
})

// Ambil detail lengkap satu karyawan (Gaji, Jabatan, Departemen)
employees.get('/:id', async (c) => {
  const emp_no = c.req.param('id')

  const { data: employee, error: empErr } = await supabase
    .from('employees')
    .select(`
      *,
      salaries (salary, from_date, to_date),
      titles (title, from_date, to_date),
      dept_emp (
        from_date,
        departments (dept_name)
      )
    `)
    .eq('emp_no', emp_no)
    .single()

  if (empErr) return c.json({ success: false, error: empErr.message }, 404)
  return c.json({ success: true, data: employee })
})

export default employees
