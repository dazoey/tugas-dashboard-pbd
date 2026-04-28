import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import employeeRoutes from './routes/employees'
import departmentRoutes from './routes/departments'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('/api/*', cors())

// API Routes
app.route('/api/employees', employeeRoutes)
app.route('/api/departments', departmentRoutes)

// Dashboard HTML (Root)
app.get('/', (c) => {
  return c.html(
    <html>
      <head>
        <title>Employee Management API</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-100 p-10 font-sans">
        <div class="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
          <h1 class="text-3xl font-extrabold text-blue-600 mb-4">API Documentation</h1>
          <p class="text-gray-600 mb-8">Backend tersinkronasi dengan Supabase. Gunakan endpoint di bawah untuk mengambil data.</p>
          
          <div class="space-y-4">
            <div class="p-4 border rounded-lg bg-blue-50">
              <span class="font-bold text-blue-700">GET /api/employees</span>
              <p class="text-sm text-gray-500">Daftar karyawan (Paginasi tersedia)</p>
            </div>
            <div class="p-4 border rounded-lg bg-green-50">
              <span class="font-bold text-green-700">GET /api/employees/:id</span>
              <p class="text-sm text-gray-500">Detail karyawan + Gaji + Jabatan + Dept</p>
            </div>
            <div class="p-4 border rounded-lg bg-purple-50">
              <span class="font-bold text-purple-700">GET /api/departments</span>
              <p class="text-sm text-gray-500">Daftar semua departemen</p>
            </div>
          </div>
          
          <div class="mt-10 text-center">
             <a href="/api/employees" class="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700">Cek API Sekarang</a>
          </div>
        </div>
      </body>
    </html>
  )
})

const port = Number(process.env.PORT) || 3000
console.log(`🚀 Server berjalan di http://localhost:${port}`)

serve({ fetch: app.fetch, port })
