// @ts-nocheck
class Team {
  constructor() {
    this.data = [
      { id: 1, name: 'فريق التطوير', initials: 'DT', avatarColor: '#42A5F5' },
      { id: 2, name: 'فريق التصميم', initials: 'DS', avatarColor: '#FFA726' },
      { id: 3, name: 'فريق الجودة', initials: 'QA', avatarColor: '#66BB6A' }
    ];
  }

  async getAll(params = {}) {
    console.log('Fake Team API: getAll', params);
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
}

export default Team;
