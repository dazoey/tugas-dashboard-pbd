# Struktur Database Employees (Supabase/PostgreSQL)

Gunakan kode SQL di bawah ini pada **SQL Editor** di Dashboard Supabase Anda untuk membuat tabel-tabel tambahan.

## 1. Tabel Departments
```sql
CREATE TABLE departments (
    dept_no CHAR(4) NOT NULL,
    dept_name VARCHAR(40) NOT NULL,
    PRIMARY KEY (dept_no),
    UNIQUE (dept_name)
);

-- Index tambahan untuk pencarian nama departemen yang cepat
CREATE INDEX idx_dept_name ON departments(dept_name);
```

## 2. Tabel Dept_Emp (Relasi Karyawan & Departemen)
```sql
CREATE TABLE dept_emp (
    emp_no INT NOT NULL,
    dept_no CHAR(4) NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    PRIMARY KEY (emp_no, dept_no),
    FOREIGN KEY (emp_no) REFERENCES employees(emp_no) ON DELETE CASCADE,
    FOREIGN KEY (dept_no) REFERENCES departments(dept_no) ON DELETE CASCADE
);

-- Indexes untuk optimasi query
CREATE INDEX idx_dept_emp_emp_no ON dept_emp(emp_no);
CREATE INDEX idx_dept_emp_dept_no ON dept_emp(dept_no);
```

## 3. Tabel Dept_Manager (Manajer Departemen)
```sql
CREATE TABLE dept_manager (
    dept_no CHAR(4) NOT NULL,
    emp_no INT NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    PRIMARY KEY (dept_no, emp_no),
    FOREIGN KEY (emp_no) REFERENCES employees(emp_no) ON DELETE CASCADE,
    FOREIGN KEY (dept_no) REFERENCES departments(dept_no) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_dept_manager_emp_no ON dept_manager(emp_no);
CREATE INDEX idx_dept_manager_dept_no ON dept_manager(dept_no);
```

## 4. Tabel Salaries (Gaji Karyawan)
```sql
CREATE TABLE salaries (
    emp_no INT NOT NULL,
    salary INT NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    PRIMARY KEY (emp_no, from_date),
    FOREIGN KEY (emp_no) REFERENCES employees(emp_no) ON DELETE CASCADE
);

-- Index
CREATE INDEX idx_salaries_emp_no ON salaries(emp_no);
```

## 5. Tabel Titles (Jabatan Karyawan)
```sql
CREATE TABLE titles (
    emp_no INT NOT NULL,
    title VARCHAR(50) NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    PRIMARY KEY (emp_no, title, from_date),
    FOREIGN KEY (emp_no) REFERENCES employees(emp_no) ON DELETE CASCADE
);

-- Index
CREATE INDEX idx_titles_emp_no ON titles(emp_no);
```

---

### Cara Penggunaan:
1. Copy kode di atas.
2. Buka Dashboard Supabase Anda.
3. Klik menu **SQL Editor**.
4. Klik **New Query**.
5. Paste kode tersebut dan klik **Run**.
