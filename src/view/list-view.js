import {createElement} from '../render.js';

function createNewListTemplate() {
  return `<ul class="trip-events__list">
    </ul>`;
}

export default class ListView {
  getTemplate() {
    return createNewListTemplate();
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
