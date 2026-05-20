const API_BASE = 'http://localhost:3000/api';

export const apiService = {
  async fetchEmployees(page: number, limit: number) {
    const res = await fetch(`${API_BASE}/employees?page=${page}&limit=${limit}`);
    return res.json();
  },

  async fetchEmployeeDetail(id: number) {
    const res = await fetch(`${API_BASE}/employees/${id}`);
    return res.json();
  },

  async fetchDepartments() {
    const res = await fetch(`${API_BASE}/departments`);
    return res.json();
  },

  async fetchSalaries(page: number, limit: number) {
    const res = await fetch(`${API_BASE}/salaries?page=${page}&limit=${limit}`);
    return res.json();
  },

  async fetchTitles(page: number, limit: number) {
    const res = await fetch(`${API_BASE}/titles?page=${page}&limit=${limit}`);
    return res.json();
  },

  async fetchManagers(page: number, limit: number) {
    const res = await fetch(`${API_BASE}/managers?page=${page}&limit=${limit}`);
    return res.json();
  },

  async searchEmployees(term: string) {
    const res = await fetch(`${API_BASE}/employees/search?last_name=${term}`);
    return res.json();
  }
};
