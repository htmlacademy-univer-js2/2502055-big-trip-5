const getRandomNumber = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const getRandomArrayElement = (array) => array[getRandomNumber(0, array.length - 1)];

const getTime = (str) => {
  const date = new Date(str);
  const hrs = date.getHours().toString().padStart(2, '0');
  const mins = date.getMinutes().toString().padStart(2, '0');
  return `${hrs}:${mins}`;
};

const getDate = (str) => {
  const date = new Date(str);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDate = (str) => {
  const month = str.split('-')[1];
  const day = str.split('-')[2];
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  return `${day} ${months[parseInt(month, 10) - 1]}`;
};

const formatEditDate = (str) => {
  if (str.length === 0) {
    return str;
  }

  const [date, time] = str.split('T');
  const [year, month, day] = date.split('-');
  const shortYear = year.slice(2);
  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${shortYear} ${time}`;
};

const calculateDuration = (start, end) => {

  const startDate = new Date(start);
  const endDate = new Date(end);

  const разницаМс = endDate - startDate;
  const totalMinutes = Math.floor(разницаМс / (1000 * 60));

  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;

  if (totalMinutes < 60) {
    return `${minutes.toString().padStart(2, '0')}M`;
  } else if (totalMinutes < 1440) {
    if (minutes === 0) {
      return `${hours.toString().padStart(2, '0')}H`;
    }
    return `${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M`;
  } else {
    return `${days.toString().padStart(2, '0')}D ${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M`;
  }
};

const generateOffersHtml = (offers) => {
  let offersHtml = '';
  for (let i = 0; i < offers.length; ++i) {
    offersHtml += `<li class="event__offer">
                      <span class="event__offer-title">${offers[i].label}</span>
                      &plus;&euro;&nbsp;
                      <span class="event__offer-price">${offers[i].price}</span>
                    </li>`;
  }
  return offersHtml;
};

const getAvailableOffers = (offers, point) => {
  const availableOffers = [];
  for (const offer of offers) {
    if (offer.type === point.type) {
      availableOffers.push(offer);
    }
  }

  return availableOffers;
};

const getOffersAsHtml = (offers, point) => {
  let html = '';

  if (offers.length !== 0) {
    html = `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">`;
    for (const offer of offers) {
      let flag = '';
      if (point.offers.some((o) => o.label === offer.label)) {
        flag = 'checked';
      }
      html += `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="${'somethinghere'}" type="checkbox" name="event-offer-luggage" ${flag}>
      <label class="event__offer-label" for="event-offer-luggage-1">
        <span class="event__offer-title">${offer.label}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`;
    }
    html += '</div></section>';
  }

  return html;
};

const operateFavoriteButton = (flag) => {
  if (flag) {
    return 'event__favorite-btn--active';
  }

  return '';
};

const operatePrice = (point) => {
  let price = point.price;
  for (const offer of point.offers) {
    price += offer.price;
  }

  return price;
};

const createDestinationsDatalist = (destinations) => {
  let html = '';
  for (const destination of destinations) {
    html += `<option value="${destination.city}"></option>`;
  }

  return html;
};

const drawDestinationInfo = (destination) => {
  let html = '';

  if (destination.description.length !== 0) {
    html = `<section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${destination.description}</p>`;
    if (destination.photos.length !== 0) {
      html += '<div class="event__photos-container"><div class="event__photos-tape">';
      for (const url of destination.photos) {
        html += `<img class="event__photo" src="${url}" alt="Event photo"></img>`;
      }
      html += '</div></div>';
    }
    html += '</section>';
  }

  return html;
};

const getTotalPrice = (points) => {
  let total = 0;
  for (const point of points) {
    total += operatePrice(point);
  }

  const priceField = document.querySelector('.trip-info__cost-value');
  priceField.innerHTML = total.toString();
};

export {getRandomArrayElement, getRandomNumber, calculateDuration, getTime, getDate, formatDate, generateOffersHtml, operateFavoriteButton, operatePrice, createDestinationsDatalist, formatEditDate, getAvailableOffers, getOffersAsHtml, drawDestinationInfo, getTotalPrice};
