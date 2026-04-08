// @ts-nocheck
class User {
  constructor() {
    this.data = [
      { id: 1, name: ' nor ali', full_name: 'nor ali', department_id: 1, department_name: 'قسم تقنية المعلومات' },
      { id: 2, name: 'nada nor', full_name: 'nada nor', department_id: 2, department_name: 'قسم الموارد البشرية' }
    ];
  }

  async getAll(params = {}) {
    console.log('Fake User API: getAll', params);
    let filteredData = [...this.data];

    if (params.search) {
      const searchLower = String(params.search).toLowerCase();
      filteredData = filteredData.filter(item => {
        return Object.values(item).some(val => 
          val && String(val).toLowerCase().includes(searchLower)
        );
      });
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

  async getRole() {
    return {
      data: {
        role: 'admin',
        permissions: ['index', 'update', 'destroy', 'show']
      }
    };
  }

  async from(item, isUpdate, isFormData) {
    console.log('Fake User API: from', { item, isUpdate, isFormData });
    
    // In a real API, this would be a POST or PUT request
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
        created_at: new Date().toISOString()
      };
      this.data.push(newItem);
    }

    return {
      data: {
        message: 'Success',
        item: item
      }
    };
  }

  activeDeactive(id) {
    console.log('Fake User API: activeDeactive', id);
    return Promise.resolve({
      status: true,
      data: { message: 'Status updated successfully' }
    });
  }

  poup(response, title) {
    if (response.message) {
      console.log(`POUP: ${title} - ${response.message}`);
    }
  }
}

export default User;
