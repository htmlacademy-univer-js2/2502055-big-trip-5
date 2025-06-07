import AbstractView from '../framework/view/abstract-view.js';

function createEmptyMessageTemplate(message) {
  return `<p class="trip-events__msg">${message}</p>`;
}

export default class EmptyMessageView extends AbstractView {
  #message = '';

  constructor(message) {
    super();
    this.#message = message;
  }

  get template() {
    return createEmptyMessageTemplate(this.#message);
  }
}
