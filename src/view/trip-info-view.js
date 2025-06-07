import AbstractView from '../framework/view/abstract-view.js';
import { getTripName, getTotalPrice, getTripDates } from '../utils.js';

function createNewInfoTemplate(points) {
  return `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${getTripName(points)}</h1>

              <p class="trip-info__dates">${getTripDates(points)}</p>
            </div>

            <p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTotalPrice(points)}</span>
            </p>
          </section>`;
}

export default class InfoView extends AbstractView{
  constructor(points) {
    super();
    this.points = points;
  }

  get template() {
    return createNewInfoTemplate(this.points);
  }
}
