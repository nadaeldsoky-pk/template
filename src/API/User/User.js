class User {
  constructor() {
    this.data = [
      { id: 1, name: ' nor ali', full_name: 'nor ali', department_id: 1, department_name: 'قسم تقنية المعلومات' },
      { id: 2, name: 'nada nor', full_name: 'nada nor', department_id: 2, department_name: 'قسم الموارد البشرية' }
    ];
  }

  async getAll(params = {}) {
    console.log('Fake User API: getAll', params);
    return {
      data: this.data,
      total: this.data.length,
      recordsTotal: this.data.length,
      recordsFiltered: this.data.length
    };
  }

  async getRole() {
    return {
      data: {
        role: 'admin',
        permissions: ['index', 'update', 'destroy', 'show']
      }
    };
  }
}

export default User;
