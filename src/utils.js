import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(duration);
dayjs.extend(relativeTime);

const getRandomNumber = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const getRandomArrayElement = (array) => array[getRandomNumber(0, array.length - 1)];

const operatePrice = (point) => {
  let price = point.price;
  for (const offer of point.offers) {
    price += offer.price;
  }

  return price;
};

const getTotalPrice = (points) => {
  let total = 0;
  for (const point of points) {
    total += operatePrice(point);
  }

  return total.toString();
};

const getTripDates = (points) => {
  if (points.length === 0) {
    return '';
  }

  const startDate = dayjs(points[0].startDate).format('DD MMM');
  const endDate = dayjs(points[points.length - 1].endDate).format('DD MMM');

  return `${startDate} — ${endDate}`;
};

dayjs.extend(duration);
dayjs.extend(relativeTime);

const getTime = (date) => dayjs(date).format('HH:mm');
const getDate = (date) => dayjs(date).format('YYYY-MM-DD');
const formatDate = (date) => dayjs(date).format('DD MMM');

const calculateDuration = (startDate, endDate) => {
  const diff = dayjs(endDate).diff(dayjs(startDate));
  const durationObj = dayjs.duration(diff);

  const days = durationObj.days();
  const hours = durationObj.hours();
  const minutes = durationObj.minutes();

  if (durationObj.asMinutes() < 60) {
    return `${minutes.toString().padStart(2, '0')}M`;
  } else if (durationObj.asMinutes() < 1440) {
    if (minutes === 0) {
      return `${hours.toString().padStart(2, '0')}H`;
    }
    return `${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M`;
  } else {
    return `${days.toString().padStart(2, '0')}D ${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M`;
  }
};

const getTripName = (points) => {
  switch (points?.length) {
    case 0: return '';
    case 1: return `${points[0].destination.city}`;
    case 2: return `${points[0].destination.city} — ${points[1].destination.city}`;
    case 3: return `${points[0].destination.city} — ${points[1].destination.city} — ${points[2].destination.city}`;
    default: return `${points[0].destination.city} — ... — ${points[points.length - 1].destination.city}`;
  }
};

const sortByDate = (objects) => Array.from(
  objects.sort((a, b) => {
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);

    return dateA - dateB;
  }));

const sortByPrice = (objects) => Array.from(
  objects.sort((a, b) => {
    const priceA = operatePrice(a);
    const priceB = operatePrice(b);

    return priceB - priceA;
  }));

const sortByDuration = (objects) => Array.from(
  objects.sort((a, b) => {
    const durA = new Date(a.endDate) - new Date(a.startDate) ;
    const durB = new Date(b.endDate) - new Date(b.startDate);

    return durB - durA;
  }));

export {getRandomArrayElement, getRandomNumber, operatePrice, getTotalPrice,
  getTripName, getTripDates, sortByDate, sortByDuration, sortByPrice, getTime, getDate, formatDate, calculateDuration,};
