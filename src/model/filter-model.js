export default class FilterModel {
  #filter = 'everything';
  #observers = [];

  get filter() {
    return this.#filter;
  }

  addObserver(observer) {
    this.#observers.push(observer);
  }

  setFilter(filterType, notify = true) {
    if (this.#filter !== filterType) {
      this.#filter = filterType;
      if (notify) {
        this.#notifyObservers();
      }
    }
  }

  #notifyObservers() {
    this.#observers.forEach((observer) => observer());
  }
}
