class Position {
  constructor() {
    this.data = [
      { id: 1, name: 'رئيس قسم' },
      { id: 2, name: 'مدير إدارة' }
    ];
  }

  async getAll(params = {}) {
    console.log('Fake Position API: getAll', params);
    let filteredData = [...this.data];

    if (params.search) {
      const searchLower = String(params.search).toLowerCase();
      filteredData = filteredData.filter(item => {
        return Object.values(item).some(val => 
          val && String(val).toLowerCase().includes(searchLower)
        );
      });
    }

    return filteredData;
  }
}

export default Position;
