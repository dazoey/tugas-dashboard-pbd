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
