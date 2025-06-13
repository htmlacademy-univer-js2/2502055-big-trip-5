import FilterView from '../view/filter-view.js';
import { render} from '../framework/render.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #filterView = null;

  constructor({ filterContainer, filterModel }) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
  }

  init() {
    this.#filterView = new FilterView({
      currentFilter: this.#filterModel.filter,
      onFilterChange: this.#handleFilterChange
    });

    render(this.#filterView, this.#filterContainer.element);
  }

  #handleFilterChange = (filterType) => {
    this.#filterModel.setFilter(filterType);
  };
}
