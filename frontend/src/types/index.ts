export interface Employee {
  emp_no: number;
  birth_date: string;
  first_name: string;
  last_name: string;
  gender: string;
  hire_date: string;
  salaries?: Salary[];
  titles?: Title[];
  dept_emp?: {
    from_date: string;
    departments: {
      dept_name: string;
    };
  }[];
}

export interface Salary {
  emp_no: number;
  salary: number;
  from_date: string;
  to_date: string;
  first_name?: string;
  last_name?: string;
}

export interface Title {
  emp_no: number;
  title: string;
  from_date: string;
  to_date: string;
  first_name?: string;
  last_name?: string;
}

export interface Department {
  dept_no: string;
  dept_name: string;
}

export interface Manager {
  emp_no: number;
  first_name: string;
  last_name: string;
  dept_name: string;
  from_date: string;
  to_date: string;
}

export interface PaginationMeta {
  total: number;
  limit: number;
  page?: number;
}
