import { getRandomNumber } from './utils.js';

const defaultDestination = {
  city: '',
  description: '',
  photos: []
};

const emptyPoint = {
  id: getRandomNumber(0, 500),
  type: 'Flight',
  startDate: '',
  endDate: '',
  price: 0,
  destination: defaultDestination,
  offers: [],
  isFavorite: false
};

const MESSAGES = {
  'past': 'There are no past events now',
  'future': 'There are no future events now',
  'present': 'There are no present events now',
  'everything': 'Click New Event to create your first point'
};

export {emptyPoint, MESSAGES};
