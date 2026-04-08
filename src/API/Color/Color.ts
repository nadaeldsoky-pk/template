// @ts-nocheck
class Color {
  constructor() {
    this.data = [
      { id: 1, name: 'Red', hexcolor: '#FF0000' },
      { id: 2, name: 'Blue', hexcolor: '#0000FF' },
      { id: 3, name: 'Green', hexcolor: '#00FF00' }
    ];
  }

  async getAll(params = {}) {
    console.log('Fake Color API: getAll', params);
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

export default Color;
