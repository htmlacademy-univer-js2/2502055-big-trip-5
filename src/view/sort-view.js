import AbstractView from '../framework/view/abstract-view.js';

function createNewSortTemplate(currentSortType) {
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
            ${[
    { type: 'day', label: 'Day', isDisabled: false },
    { type: 'event', label: 'Event', isDisabled: true },
    { type: 'time', label: 'Time', isDisabled: false },
    { type: 'price', label: 'Price', isDisabled: false },
    { type: 'offer', label: 'Offers', isDisabled: true }
  ].map(({ type, label, isDisabled }) => `
              <div class="trip-sort__item  trip-sort__item--${type}">
                <input
                  id="sort-${type}"
                  class="trip-sort__input  visually-hidden"
                  type="radio"
                  name="trip-sort"
                  value="sort-${type}"
                  ${currentSortType === type ? 'checked' : ''}
                  ${isDisabled ? 'disabled' : ''}
                >
                <label class="trip-sort__btn" for="sort-${type}">${label}</label>
              </div>
            `).join('')}
          </form>`;
}

export default class SortView extends AbstractView {
  #currentSortType = null;
  #handleSortTypeChange = null;

  constructor({ currentSortType, onSortTypeChange }) {
    super();
    this.#currentSortType = currentSortType;
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  get template() {
    return createNewSortTemplate(this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName === 'INPUT' && !evt.target.disabled) {
      const sortType = evt.target.value.replace('sort-', '');
      this.#handleSortTypeChange(sortType);
    }
  };

  updateCurrentSortType = (sortType) => {
    this.#currentSortType = sortType;
    const inputs = this.element.querySelectorAll('input');
    inputs.forEach((input) => {
      input.checked = input.value === `sort-${sortType}`;
    });
  };
}
