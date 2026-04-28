# Panduan API Employee Management Dashboard

Dokumentasi ini berisi daftar endpoint API yang tersedia untuk diakses oleh Frontend. Semua endpoint API mengembalikan data dalam format JSON.

**Base URL:** `http://localhost:3000/api`

---

## 1. Modul Karyawan (Employees)

### a. Ambil Daftar Karyawan
Mengambil daftar karyawan dengan dukungan paginasi.
- **Endpoint:** `GET /employees`
- **Query Parameters:**
  - `page` (opsional): Nomor halaman (Default: 1)
  - `limit` (opsional): Jumlah data per halaman (Default: 20)
- **Contoh Request:** `GET /api/employees?page=1&limit=10`
- **Respons Sukses:**
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "total": 300024,
    "page": 1,
    "limit": 10
  }
}
```

### b. Ambil Detail Karyawan Lengkap
Mengambil data detail satu karyawan termasuk riwayat gaji, jabatan, dan departemen.
- **Endpoint:** `GET /employees/:id`
- **Contoh Request:** `GET /api/employees/10001`
- **Respons Sukses:**
```json
{
  "success": true,
  "data": {
    "emp_no": 10001,
    "first_name": "Georgi",
    "last_name": "Facello",
    "salaries": [...],
    "titles": [...],
    "dept_emp": [
      {
        "from_date": "1986-06-26",
        "departments": { "dept_name": "Development" }
      }
    ]
  }
}
```

---

## 2. Modul Departemen (Departments)

### a. Daftar Semua Departemen
- **Endpoint:** `GET /departments`
- **Respons Sukses:**
```json
{
  "success": true,
  "data": [
    { "dept_no": "d001", "dept_name": "Marketing" },
    { "dept_no": "d002", "dept_name": "Finance" }
  ]
}
```

### b. Daftar Karyawan per Departemen
Mengambil daftar karyawan yang bekerja di departemen tertentu.
- **Endpoint:** `GET /departments/:dept_no/employees`
- **Contoh Request:** `GET /api/departments/d005/employees`
- **Respons Sukses:**
```json
{
  "success": true,
  "data": [
    {
      "emp_no": 10001,
      "employees": { "first_name": "Georgi", "last_name": "Facello" }
    }
  ]
}
```

---

## Konfigurasi Teknis
- **CORS:** Diaktifkan untuk semua origin (`*`). Frontend dapat melakukan fetch dari localhost maupun domain produksi.
- **Error Handling:** Jika terjadi kesalahan, API akan mengembalikan status code 4xx atau 5xx dengan format:
```json
{
  "success": false,
  "error": "Pesan error detail di sini"
}
```

## Tips untuk Frontend
Gunakan library seperti `axios` atau bawaan `fetch` untuk mengambil data:
```javascript
const response = await fetch('http://localhost:3000/api/employees?page=1');
const result = await response.json();
console.log(result.data); // Array data karyawan
```
