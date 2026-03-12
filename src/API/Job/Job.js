class Job {
  constructor() {
    this.data = [
      { id: 1, name: 'مدير نظام', is_manager: true },
      { id: 2, name: 'مطور برمجيات', is_manager: false },
      { id: 3, name: 'أخصائي موارد بشرية', is_manager: false }
    ];
  }

  async getAll(params = {}) {
    console.log('Fake Job API: getAll', params);
    return this.data;
  }
}

export default Job;
