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
    return {
      data: this.data,
      total: this.data.length,
      recordsTotal: this.data.length,
      recordsFiltered: this.data.length
    };
  }
}

export default Team;
