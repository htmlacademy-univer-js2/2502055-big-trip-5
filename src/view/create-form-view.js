import {createElement} from '../render.js';

function createNewAddEventTemplate() {
  return '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';
}

export default class CreateEventFormView {
  getTemplate() {
    return createNewAddEventTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeELement() {
    this.element = null;
  }
}
