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
    return this.data;
  }
}

export default Color;
