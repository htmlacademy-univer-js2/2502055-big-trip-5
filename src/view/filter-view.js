import AbstractView from '../framework/view/abstract-view.js';

function createNewFilterTemplate(currentFilter) {
  return `<div class="trip-main__trip-controls  trip-controls">
            <div class="trip-controls__filters">
              <h2 class="visually-hidden">Filter events</h2>
              <form class="trip-filters" action="#" method="get">
                ${['everything', 'future', 'present', 'past'].map((filter) => `
                  <div class="trip-filters__filter">
                    <input
                      id="filter-${filter}"
                      class="trip-filters__filter-input  visually-hidden"
                      type="radio"
                      name="trip-filter"
                      value="${filter}"
                      ${filter === currentFilter ? 'checked' : ''}
                    >
                    <label class="trip-filters__filter-label" for="filter-${filter}">${filter.charAt(0).toUpperCase() + filter.slice(1)}</label>
                  </div>
                `).join('')}
                <button class="visually-hidden" type="submit">Accept filter</button>
              </form>
            </div>
          </div>`;
}

export default class FilterView extends AbstractView {
  #currentFilter = null;
  #handleFilterChange = null;

  constructor({currentFilter, onFilterChange}) {
    super();
    this.#currentFilter = currentFilter;
    this.#handleFilterChange = onFilterChange;

    this.element.addEventListener('change', this.#filterChangeHandler);
  }

  get template() {
    return createNewFilterTemplate(this.#currentFilter);
  }

  #filterChangeHandler = (evt) => {
    if (evt.target.tagName === 'INPUT') {
      this.#handleFilterChange(evt.target.value);
    }
  };
}
