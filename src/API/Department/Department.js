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
        users: [{ id: 1, full_name: 'Ahmed Mohamed' }],
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
        users: [{ id: 2, full_name: 'Sara Ali' }],
        children: []
      }
    ];
  }

  async getAll(params = {}) {
    console.log('Fake Department API: getAll', params);
    let filteredData = [...this.data];

    if (params.search) {
      const searchLower = String(params.search).toLowerCase();
      filteredData = filteredData.filter(item => {
        return Object.values(item).some(val => 
          val && String(val).toLowerCase().includes(searchLower)
        );
      });
    }

    if (params.sort) {
      const parts = params.sort.split('|');
      if (parts.length === 2) {
        const [sortBy, sortDir] = parts;
        filteredData.sort((a, b) => {
          if (a[sortBy] < b[sortBy]) return sortDir === 'asc' ? -1 : 1;
          if (a[sortBy] > b[sortBy]) return sortDir === 'asc' ? 1 : -1;
          return 0;
        });
      }
    }

    const recordsFiltered = filteredData.length;

    if (params.page && params.perPage) {
      const start = (params.page - 1) * params.perPage;
      filteredData = filteredData.slice(start, start + parseInt(params.perPage));
    }

    return {
      data: filteredData,
      total: this.data.length,
      recordsTotal: this.data.length,
      recordsFiltered: recordsFiltered
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
  
  async from(item, isUpdate, isFormData) {
    console.log('Fake Department API: from', { item, isUpdate, isFormData });
    
    // In a real API, this would be a POST or PUT request
    // For mock purposes, we update the local data array
    if (isUpdate) {
      const index = this.data.findIndex(d => d.id === item.id);
      if (index !== -1) {
        this.data[index] = { ...this.data[index], ...item };
      }
    } else {
      const newId = this.data.length > 0 ? Math.max(...this.data.map(d => d.id)) + 1 : 1;
      const newItem = {
        ...item,
        id: newId,
        created_at: new Date().toISOString(),
        users: [],
        children: []
      };
      this.data.push(newItem);
    }

    return {
      data: {
        message: 'Success',
        item: item // In real API, this might return the saved object
      }
    };
  }

  async importFileData(fields) {
    return true;
  }
}

export default Department;
