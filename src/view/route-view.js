import AbstractView from '../framework/view/abstract-view.js';

function createRouteTemplate() {
  return `<section class="trip-events">
            <h2 class="visually-hidden">Trip events</h2>
          </section>`;
}

export default class RouteView extends AbstractView {
  get template() {
    return createRouteTemplate();
  }
}
