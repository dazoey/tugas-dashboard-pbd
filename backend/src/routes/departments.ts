import { Hono } from 'hono'
import { supabase } from '../lib/supabase'

const departments = new Hono()

// Daftar semua departemen
departments.get('/', async (c) => {
  const { data, error } = await supabase.from('departments').select('*')
  if (error) return c.json({ success: false, error: error.message }, 500)
  return c.json({ success: true, data })
})

// Daftar karyawan di departemen tertentu
departments.get('/:dept_no/employees', async (c) => {
  const dept_no = c.req.param('dept_no')
  
  const { data, error } = await supabase
    .from('dept_emp')
    .select(`
      emp_no,
      employees (first_name, last_name, gender)
    `)
    .eq('dept_no', dept_no)
    .limit(50)

  if (error) return c.json({ success: false, error: error.message }, 500)
  return c.json({ success: true, data })
})

export default departments

// ... kode sebelumnya ...

departments.get('/managers/active', async (c) => {
  // Ambil manajer yang statusnya masih aktif (to_date = 9999-01-01)
  const { data, error } = await supabase
    .from('dept_manager')
    .select(`
      emp_no,
      dept_no,
      from_date,
      to_date,
      employees (first_name, last_name),
      departments (dept_name)
    `)
    .eq('to_date', '9999-01-01')

  if (error) return c.json({ success: false, error: error.message }, 500)
  
  const formatted = data.map(m => ({
    emp_no: m.emp_no,
    dept_name: m.departments?.dept_name,
    full_name: `${m.employees?.first_name} ${m.employees?.last_name}`,
    from_date: m.from_date
  }))

  return c.json({ success: true, data: formatted })
})
