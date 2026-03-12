class User {
  constructor() {
    this.data = [
      { id: 1, name: 'أحمد محمد', full_name: 'أحمد محمد', department_id: 1, department_name: 'قسم تقنية المعلومات' },
      { id: 2, name: 'سارة علي', full_name: 'سارة علي', department_id: 2, department_name: 'قسم الموارد البشرية' }
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
