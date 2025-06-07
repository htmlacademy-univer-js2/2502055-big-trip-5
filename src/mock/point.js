import { getRandomArrayElement} from '../utils';
import { mockDestinations } from './destinations';

const mockPoints = [
  {
    id: 0,
    type: 'Taxi',
    startDate: '2025-04-05T10:00',
    endDate: '2025-04-05T10:20',
    price: 0,
    destination: getRandomArrayElement(mockDestinations),
    offers: [{type: 'Taxi', label: 'Order Uber', price: 20}],
    isFavorite: true
  },
  {
    id: 1,
    type: 'Check-in',
    startDate: '2025-12-12T11:00',
    endDate: '2025-12-12T13:00',
    price: 560,
    destination: getRandomArrayElement(mockDestinations),
    offers: [{type: 'Check-in', label : 'Add breakfast', price : 66}],
    isFavorite: false
  },
  {
    id: 2,
    type: 'Drive',
    startDate: '2025-04-06T11:00',
    endDate: '2025-04-07T19:01',
    price: 0,
    destination: getRandomArrayElement(mockDestinations),
    offers: [{type: 'Drive', label : 'Rent a car', price : 400}],
    isFavorite: false
  },
  {
    id: 3,
    type: 'Restaurant',
    startDate: '2025-04-07T20:00',
    endDate: '2025-04-07T21:10',
    price: 89,
    destination: getRandomArrayElement(mockDestinations),
    offers: [],
    isFavorite: false
  },
  {
    id: 4,
    type: 'Sightseeing',
    startDate: '2025-04-09T13:15',
    endDate: '2025-04-09T17:10',
    price: 125,
    destination: getRandomArrayElement(mockDestinations),
    offers: [],
    isFavorite: true
  },
  {
    id: 5,
    type: 'Ship',
    startDate: '2025-06-07T13:15',
    endDate: '2025-06-07T19:10',
    price: 1300,
    destination: getRandomArrayElement(mockDestinations),
    offers: [],
    isFavorite: true
  },
];

const getRandomPoint = () => getRandomArrayElement(mockPoints);

export {getRandomPoint, mockPoints};
