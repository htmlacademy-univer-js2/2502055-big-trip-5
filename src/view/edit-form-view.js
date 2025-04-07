import AbstractView from '../framework/view/abstract-view.js';

const formatEditDate = (str) => {
  if (str.length === 0) {
    return str;
  }

  const [date, time] = str.split('T');
  const [year, month, day] = date.split('-');
  const shortYear = year.slice(2);
  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${shortYear} ${time}`;
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


function createEditEventTemplate(point, destinations, offers, onClick) {
  const {type, startDate, endDate, price, destination} = point;
  let editBtn = '';
  let denyBtnText = 'Cancel';

  if (onClick) {
    editBtn = `<button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
    </button>`;
    denyBtnText = 'Delete';
  }

  return `<form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>

                        <div class="event__type-item">
                          <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
                          <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
                          <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
                          <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
                          <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
                          <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
                          <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
                          <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
                          <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
                          <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
                        </div>
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${type}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.city}" list="destination-list-1">
                    <datalist id="destination-list-1">
                      ${createDestinationsDatalist(destinations)}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatEditDate(startDate)}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatEditDate(endDate)}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">${denyBtnText}</button>
                  ${editBtn}
                </header>
                <section class="event__details">
                      ${getOffersAsHtml(getAvailableOffers(offers, point), point)}
                      ${drawDestinationInfo(destination)}
                </section>
              </form>`;
}

export default class EditEventView extends AbstractView {
  #handleClick = null;
  #handleSubmit = null;
  #handleAbortion = null;
  #point = null;

  constructor({point, destinations, offers, onClick = null, onSubmit, onAbortion}) {
    super();
    this.#point = point;
    this.destinations = destinations;
    this.offers = offers;
    if (onClick) {
      this.#handleClick = onClick;
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
    }

    this.#handleSubmit = onSubmit;
    this.element.addEventListener('submit', this.#submitHandler);
    this.#handleAbortion = onAbortion;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#abortionHandler);
  }

  get point() {
    return this.#point;
  }

  get template() {
    return createEditEventTemplate(this.point, this.destinations, this.offers, this.#handleClick);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  };

  #submitHandler = (evt) => {
    evt.preventDefault();
    this.#handleSubmit();
  };

  #abortionHandler = (evt) => {
    evt.preventDefault();
    this.#handleAbortion();
  };
}
