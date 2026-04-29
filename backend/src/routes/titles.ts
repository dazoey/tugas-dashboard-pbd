import { Hono } from 'hono'
import { supabase } from '../lib/supabase'

const titles = new Hono()

// Ambil top 50 log jabatan terbaru beserta nama karyawannya
titles.get('/', async (c) => {
  const { data: titlesData, error } = await supabase
    .from('titles')
    .select('emp_no, title, from_date, to_date')
    .limit(50)

  if (error) return c.json({ success: false, error: error.message }, 500)
  
  if (!titlesData || titlesData.length === 0) {
    return c.json({ success: true, data: [] })
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

  return c.json({ success: true, data: formatted })
})

export default titles
