import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
dayjs.extend(duration);
dayjs.extend(relativeTime);

const formatEditDate = (date) => {
  if (!date) {
    return '';
  }
  return dayjs(date).format('DD/MM/YY HH:mm');
};

const createDestinationsDatalist = (destinations) =>
  destinations.map((dest) => `<option value="${dest.city}"></option>`).join('');

const drawDestinationInfo = (destination) => {
  if (!destination.description) {
    return '';
  }
  let html = `
    <section class="event__section event__section--destination">
      <h3 class="event__section-title event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description}</p>`;

  if (destination.photos.length) {
    html += `
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${destination.photos.map((url) => `<img class="event__photo" src="${url}" alt="Event photo">`).join('')}
        </div>
      </div>`;
  }

  return `${html}</section>`;
};

const getAvailableOffers = (offers, pointType) =>
  offers.filter((offer) => offer.type === pointType);

export default class EditEventView extends AbstractStatefulView {
  #destinations = null;
  #offers = null;
  #handleSubmit = null;
  #handleClose = null;
  #handleDelete = null;
  #datepickerStart = null;
  #datepickerEnd = null;

  constructor({point, destinations, offers, onSubmit, onClose, onDelete}) {
    super();
    this._state = this.#parsePointToState(point);
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleSubmit = onSubmit;
    this.#handleClose = onClose;
    this.#handleDelete = onDelete;

    this._restoreHandlers();
  }

  get template() {
    const {type, destination, startDate, endDate, price} = this._state;
    const availableOffers = getAvailableOffers(this.#offers, type);
    const isNewPoint = !this.#handleDelete;

    return `
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${this.#renderEventTypes(type)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group event__field-group--destination">
            <label class="event__label event__type-output" for="event-destination-1">${type}</label>
            <input class="event__input event__input--destination" id="event-destination-1"
                   type="text" name="event-destination" value="${destination.city}"
                   list="destination-list-1" required>
            <datalist id="destination-list-1">${createDestinationsDatalist(this.#destinations)}</datalist>
          </div>

          <div class="event__field-group event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input event__input--time" id="event-start-time-1"
                   type="text" name="event-start-time" value="${formatEditDate(startDate)}" required>
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input event__input--time" id="event-end-time-1"
                   type="text" name="event-end-time" value="${formatEditDate(endDate)}" required>
          </div>

          <div class="event__field-group event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>&euro;
            </label>
            <input class="event__input event__input--price" id="event-price-1"
                   type="number" name="event-price" value="${price}" min="0" required>
          </div>

          <button class="event__save-btn btn btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${isNewPoint ? 'Cancel' : 'Delete'}</button>
          ${!isNewPoint ? '<button class="event__rollup-btn" type="button"><span class="visually-hidden">Close</span></button>' : ''}
        </header>

        <section class="event__details">
          ${this.#renderOffers(availableOffers)}
          ${drawDestinationInfo(destination)}
        </section>
      </form>
    `;
  }

  #parsePointToState(point) {
    return {...point};
  }

  #renderEventTypes(currentType) {
    const types = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
    return types.map((type) => `
      <div class="event__type-item">
        <input id="event-type-${type}-1" class="event__type-input visually-hidden"
               type="radio" name="event-type" value="${type}" ${type === currentType.toLowerCase() ? 'checked' : ''}>
        <label class="event__type-label event__type-label--${type}" for="event-type-${type}-1">
          ${type.charAt(0).toUpperCase() + type.slice(1)}
        </label>
      </div>
    `).join('');
  }

  #renderOffers(availableOffers) {
    if (!availableOffers.length) {
      return '';
    }
    return `
      <section class="event__section event__section--offers">
        <h3 class="event__section-title event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${availableOffers.map((offer) => `
            <div class="event__offer-selector">
              <input class="event__offer-checkbox visually-hidden"
                     id="offer-${offer.label.replace(/\s+/g, '-').toLowerCase()}"
                     type="checkbox" name="event-offer"
                     ${this._state.offers.some((o) => o.label === offer.label) ? 'checked' : ''}>
              <label class="event__offer-label" for="offer-${offer.label.replace(/\s+/g, '-').toLowerCase()}">
                <span class="event__offer-title">${offer.label}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${offer.price}</span>
              </label>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }

  #startDateChangeHandler = ([userDate]) => {
    const formattedDate = dayjs(userDate).format('YYYY-MM-DDTHH:mm');
    this.updateElement({
      startDate: formattedDate
    });
    this.#datepickerEnd.set('minDate', userDate);

    const formattedDisplayDate = dayjs(userDate).format('DD/MM/YY HH:mm');
    this.element.querySelector('[name="event-start-time"]').value = formattedDisplayDate;
  };

  #endDateChangeHandler = ([userDate]) => {
    const formattedDate = dayjs(userDate).format('YYYY-MM-DDTHH:mm');
    this.updateElement({
      endDate: formattedDate
    });

    const formattedDisplayDate = dayjs(userDate).format('DD/MM/YY HH:mm');
    this.element.querySelector('[name="event-end-time"]').value = formattedDisplayDate;
  };

  #initDatepickers() {
    const commonConfig = {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      altInput: true,
      altFormat: 'd/m/y H:i',
      // eslint-disable-next-line camelcase
      time_24hr: true,
      allowInput: true,
      locale: {
        firstDayOfWeek: 1
      }
    };

    const defaultStartDate = this._state.startDate
      ? dayjs(this._state.startDate).format('DD/MM/YY HH:mm')
      : '';
    const defaultEndDate = this._state.endDate
      ? dayjs(this._state.endDate).format('DD/MM/YY HH:mm')
      : '';

    const startDateElement = this.element.querySelector('[name="event-start-time"]');
    this.#datepickerStart = flatpickr(startDateElement, {
      ...commonConfig,
      defaultDate: defaultStartDate,
      onChange: this.#startDateChangeHandler
    });

    const endDateElement = this.element.querySelector('[name="event-end-time"]');
    this.#datepickerEnd = flatpickr(endDateElement, {
      ...commonConfig,
      defaultDate: defaultEndDate,
      minDate: this._state.startDate,
      onChange: this.#endDateChangeHandler
    });

    if (defaultStartDate) {
      startDateElement.value = defaultStartDate;
    }
    if (defaultEndDate) {
      endDateElement.value = defaultEndDate;
    }
  }

  _restoreHandlers() {
    this.element.querySelectorAll('.event__type-input').forEach((input) =>
      input.addEventListener('change', this.#typeChangeHandler)
    );

    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);

    this.element.querySelectorAll('.event__offer-checkbox').forEach((checkbox) =>
      checkbox.addEventListener('change', this.#offerChangeHandler)
    );

    this.element.querySelector('.event__input--price')
      .addEventListener('change', this.#priceChangeHandler);

    this.element.addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#formResetHandler);

    if (this.#handleClose) {
      this.element.querySelector('.event__rollup-btn')?.addEventListener('click', this.#closeClickHandler);
    }

    this.#initDatepickers();
  }

  #typeChangeHandler = (evt) => {
    this.updateElement({
      type: evt.target.value.charAt(0).toUpperCase() + evt.target.value.slice(1),
      offers: []
    });
  };

  #destinationChangeHandler = (evt) => {
    const destination = this.#destinations.find((d) => d.city === evt.target.value);
    if (destination) {
      this.updateElement({destination});
    }
  };

  #offerChangeHandler = (evt) => {
    const offerLabel = evt.target.nextElementSibling.querySelector('.event__offer-title').textContent;
    const newOffers = [...this._state.offers];
    const offerIndex = newOffers.findIndex((o) => o.label === offerLabel);

    if (evt.target.checked && offerIndex === -1) {
      newOffers.push(this.#offers.find((o) => o.label === offerLabel && o.type === this._state.type));
    } else if (!evt.target.checked && offerIndex !== -1) {
      newOffers.splice(offerIndex, 1);
    }

    this.updateElement({offers: newOffers});
  };

  #priceChangeHandler = (evt) => {
    this.updateElement({
      price: parseInt(evt.target.value, 10)
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleSubmit(this._state);
  };

  #formResetHandler = (evt) => {
    evt.preventDefault();
    this.#handleClose();
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClose();
  };

  removeElement() {
    super.removeElement();

    if (this.#datepickerStart) {
      this.#datepickerStart.destroy();
      this.#datepickerStart = null;
    }

    if (this.#datepickerEnd) {
      this.#datepickerEnd.destroy();
      this.#datepickerEnd = null;
    }
  }
}
