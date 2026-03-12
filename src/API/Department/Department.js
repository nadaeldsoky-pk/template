class Department {
  constructor() {
    this.data = [
      { 
        id: 1, 
        name: 'قسم تقنية المعلومات', 
        code: 'IT-001', 
        type: 'GRC',
        parent_id: null,
        manager_id: 1,
        number_of_employees: 10,
        vision: 'Vision test',
        mission: 'Mission test',
        message: 'Message test',
        objectives: 'Objectives test',
        responsibilities: 'Responsibilities test',
        created_at: new Date().toISOString(),
        users: [{ id: 1, full_name: 'أحمد محمد' }],
        children: []
      },
      { 
        id: 2, 
        name: 'قسم الموارد البشرية', 
        code: 'HR-001', 
        type: 'GRC',
        parent_id: null,
        manager_id: 2,
        number_of_employees: 5,
        created_at: new Date().toISOString(),
        users: [{ id: 2, full_name: 'سارة علي' }],
        children: []
      }
    ];
  }

  async getAll(params = {}) {
    console.log('Fake Department API: getAll', params);
    return {
      data: this.data,
      total: this.data.length,
      recordsTotal: this.data.length,
      recordsFiltered: this.data.length
    };
  }

  async exportToExcel(params = {}) {
    console.log('Fake Department API: exportToExcel', params);
    return true;
  }

  async exportToPdf(params = {}) {
    console.log('Fake Department API: exportToPdf', params);
    return true;
  }
  
  async fetchFileData(formData) {
    return { data: { file_columns: [], database_columns: [] } };
  }
  
  async importFileData(fields) {
    return true;
  }
}

export default Department;
