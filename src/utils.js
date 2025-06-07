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
  if (!points?.length) {
    return '';
  }

  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];

  if (!firstPoint?.startDate || !lastPoint?.endDate) {
    return '';
  }

  try {
    const startDate = new Date(firstPoint.startDate);
    const endDate = new Date(lastPoint.endDate);

    if (isNaN(startDate) || isNaN(endDate)) {
      return '';
    }

    const formatDate = (date) => {
      const day = date.getDate();
      const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
      return `${day} ${month}`;
    };

    return `${formatDate(startDate)} — ${formatDate(endDate)}`;
  } catch {
    return '';
  }
};

const getTripName = (points) => {
  switch (points?.length) {
    case 0: return '';
    case 1: return points[0].destination.city;
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

export {getRandomArrayElement, getRandomNumber, operatePrice, getTotalPrice, getTripName, getTripDates, sortByDate, sortByDuration, sortByPrice};
