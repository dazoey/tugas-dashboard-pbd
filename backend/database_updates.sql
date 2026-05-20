-- ==============================================================================
-- TUGAS A: VIEW - Profil Manajer di Perusahaan
-- View ini menyajikan profil manajer (identitas, departemen, dan masa jabatan).
-- Menyertakan seluruh riwayat manajer yang tercatat dalam database.
-- ==============================================================================

CREATE OR REPLACE VIEW manager_profiles AS
SELECT 
    e.emp_no,
    e.first_name,
    e.last_name,
    d.dept_name,
    dm.from_date,
    dm.to_date
FROM dept_manager dm
JOIN employees e ON dm.emp_no = e.emp_no
JOIN departments d ON dm.dept_no = d.dept_no
ORDER BY dm.from_date DESC;


-- ==============================================================================
-- TUGAS B: INDEX - Optimalisasi Pencarian berdasarkan Nama Belakang
-- Index ini ditambahkan pada kolom last_name di tabel employees untuk mencegah
-- terjadinya Full Table Scan saat melakukan filter nama belakang.
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_employees_last_name ON employees(last_name);


-- ------------------------------------------------------------------------------
-- PANDUAN PENGUJIAN EXPLAIN (Sesuai Tugas B.b):
-- Jalankan perintah ini di SQL Editor untuk membandingkan sebelum dan sesudah index:
--
-- Sebelum membuat Index (Full Table Scan):
-- EXPLAIN ANALYZE SELECT * FROM employees WHERE last_name = 'Smith';
-- 
-- Setelah membuat Index (Index Scan):
-- EXPLAIN ANALYZE SELECT * FROM employees WHERE last_name = 'Smith';
-- ------------------------------------------------------------------------------
