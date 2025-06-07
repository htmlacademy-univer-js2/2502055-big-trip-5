import AbstractView from '../framework/view/abstract-view.js';
import {operatePrice} from '../utils.js';

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

const operateFavoriteButton = (flag) => {
  if (flag) {
    return 'event__favorite-btn--active';
  }

  return '';
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

function createNewPointTemplate(point) {
  const {type, startDate, endDate, destination, offers, isFavorite} = point;

  return `<li class="trip-events__item">
              <div class="event">
                <time class="event__date" datetime="${getDate(startDate)}">${formatDate(getDate(startDate))}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${type} ${destination.city}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${startDate}">${getTime(startDate)}</time>
                    &mdash;
                    <time class="event__end-time" datetime="${endDate}">${getTime(endDate)}</time>
                  </p>
                  <p class="event__duration">${calculateDuration(startDate, endDate)}</p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${operatePrice(point)}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">
                  ${generateOffersHtml(offers)}
                </ul>
                <button class="event__favorite-btn ${operateFavoriteButton(isFavorite)}" type="button">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                  </svg>
                </button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
          </li>`;
}

export default class PointView extends AbstractView {
  #handleEditClick = null;
  #handleFavoriteClick = null;
  #point = null;

  constructor({ point, onEditClick, onFavoriteClick }) {
    super();
    this.#point = point;
    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);

    this.element.querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createNewPointTemplate(this.#point);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
