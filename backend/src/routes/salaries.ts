import { Hono } from 'hono'
import { supabase } from '../lib/supabase'

const salaries = new Hono()

// Ambil top 50 log gaji terbaru beserta nama karyawannya
salaries.get('/', async (c) => {
  const { data: salariesData, error } = await supabase
    .from('salaries')
    .select('emp_no, salary, from_date, to_date')
    .limit(50)

  if (error) return c.json({ success: false, error: error.message }, 500)
  
  if (!salariesData || salariesData.length === 0) {
    return c.json({ success: true, data: [] })
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

  return c.json({ success: true, data: formatted })
})

export default salaries