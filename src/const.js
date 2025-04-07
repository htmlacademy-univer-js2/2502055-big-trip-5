const defaultDestination = {
  city: '',
  description: '',
  photos: []
};

const emptyPoint = {
  type: 'Flight',
  startDate: '',
  endDate: '',
  price: 0,
  destination: defaultDestination,
  offers: [],
  isFavorite: false
};

export {emptyPoint};
