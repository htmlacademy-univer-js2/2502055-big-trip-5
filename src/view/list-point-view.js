import AbstractView from '../framework/view/abstract-view.js';
import {operatePrice, getDate, getTime, calculateDuration, formatDate} from '../utils.js';

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
