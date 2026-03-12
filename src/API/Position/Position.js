class Position {
  constructor() {
    this.data = [
      { id: 1, name: 'رئيس قسم' },
      { id: 2, name: 'مدير إدارة' }
    ];
  }

  async getAll(params = {}) {
    console.log('Fake Position API: getAll', params);
    return this.data;
  }
}

export default Position;
