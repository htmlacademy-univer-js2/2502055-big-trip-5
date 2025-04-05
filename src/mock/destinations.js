import { getRandomNumber } from '../utils';

const MIN_PHOTO_ID = 0;
const MAX_PHOTO_ID = 898;

const getRandomPhotoUrl = () => `https://loremflickr.com/248/152?random=${getRandomNumber(MIN_PHOTO_ID, MAX_PHOTO_ID)}`;

const mockDestinations = [
  {
    city: 'Moscow',
    photos: [getRandomPhotoUrl(), getRandomPhotoUrl()],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.'
  },
  {
    city: 'Berlin',
    photos: [],
    description: ''
  },
  {
    city: 'Amsterdam',
    photos: [getRandomPhotoUrl(), getRandomPhotoUrl(), getRandomPhotoUrl()],
    description: 'Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.'
  },
  {
    city: 'London',
    photos: [getRandomPhotoUrl()],
    description: 'Aliquam erat volutpat.'
  },
  {
    city: 'Krakow',
    photos: [getRandomPhotoUrl(), getRandomPhotoUrl(), getRandomPhotoUrl(), getRandomPhotoUrl()],
    description: 'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.'
  }
];

export {mockDestinations};
