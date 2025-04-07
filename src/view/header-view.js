import AbstractView from '../framework/view/abstract-view.js';

function createHeaderContainerTemplate() {
  return '<div class="trip-main"></div>';
}

export default class HeaderView extends AbstractView {
  get template() {
    return createHeaderContainerTemplate();
  }
}
