import Observable from '../framework/observable.js';

export default class FilterModel extends Observable {
  #filter = 'everything';

  get filter() {
    return this.#filter;
  }

  setFilter(filterType, notify = true) {
    if (this.#filter !== filterType) {
      this.#filter = filterType;
      if (notify) {
        this._notify('filter-change', this.#filter);
      }
    }
  }
}
