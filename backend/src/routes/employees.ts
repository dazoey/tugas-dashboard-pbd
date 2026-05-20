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

// Pencarian pegawai berdasarkan nama belakang (Tugas B)
employees.get('/search', async (c) => {
  const lastName = c.req.query('last_name')
  
  if (!lastName) {
    return c.json({ success: false, error: 'Parameter last_name dibutuhkan' }, 400)
  }

  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .ilike('last_name', `%${lastName}%`)
    .limit(50)

  if (error) return c.json({ success: false, error: error.message }, 500)
  return c.json({ success: true, data })
})

// Ambil detail lengkap satu karyawan (Gaji, Jabatan, Departemen)
// Dibuat manual fetch karena relasi di database/supabase cache bermasalah
employees.get('/:id', async (c) => {
  const emp_no = c.req.param('id')

  // 1. Ambil data dasar karyawan
  const { data: employee, error: empErr } = await supabase
    .from('employees')
    .select('*')
    .eq('emp_no', emp_no)
    .single()

  if (empErr || !employee) return c.json({ success: false, error: 'Karyawan tidak ditemukan' }, 404)

  // 2. Ambil riwayat gaji
  const { data: salaries } = await supabase
    .from('salaries')
    .select('salary, from_date, to_date')
    .eq('emp_no', emp_no)
    .order('from_date', { ascending: false })

  // 3. Ambil riwayat jabatan
  const { data: titles } = await supabase
    .from('titles')
    .select('title, from_date, to_date')
    .eq('emp_no', emp_no)
    .order('from_date', { ascending: false })

  // 4. Ambil departemen (lewat tabel junction dept_emp)
  const { data: deptEmp } = await supabase
    .from('dept_emp')
    .select('dept_no, from_date')
    .eq('emp_no', emp_no)
  
  let departmentsInfo = []
  if (deptEmp && deptEmp.length > 0) {
    const deptNos = deptEmp.map(d => d.dept_no)
    const { data: depts } = await supabase
      .from('departments')
      .select('dept_no, dept_name')
      .in('dept_no', deptNos)
    
    departmentsInfo = deptEmp.map(de => ({
      from_date: de.from_date,
      departments: depts?.find(d => d.dept_no === de.dept_no)
    }))
  }

  // Gabungkan semua data
  const fullData = {
    ...employee,
    salaries: salaries || [],
    titles: titles || [],
    dept_emp: departmentsInfo
  }

  return c.json({ success: true, data: fullData })
})

export default employees
