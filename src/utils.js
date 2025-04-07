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

  const priceField = document.querySelector('.trip-info__cost-value');
  priceField.innerHTML = total.toString();
};

export {getRandomArrayElement, getRandomNumber, operatePrice, getTotalPrice};
