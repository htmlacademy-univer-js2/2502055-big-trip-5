import {render} from '../render.js';
import ListView from '../view/list-view.js';
import RouteView from '../view/route-view.js';
import SortView from '../view/sort-view.js';
import PointView from '../view/list-point-view.js';
import EditEventView from '../view/edit-form-view.js';
import {getTotalPrice} from '../utils.js';


export default class RoutePresenter {
  routeComponent = new RouteView();
  pointsListComponent = new ListView();

  constructor({routeContainer, pointsModel}) {
    this.routeContainer = routeContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    this.points = this.pointsModel.getPoints();
    this.destinations = this.pointsModel.getDestinations();
    this.offers = this.pointsModel.getOffers();
    render(this.routeComponent, this.routeContainer);
    render(new SortView(), this.routeComponent.getElement());
    render(this.pointsListComponent, this.routeComponent.getElement());
    render(new EditEventView({destinations: this.destinations, offers: this.offers, isEdit: false}), this.pointsListComponent.getElement());
    for (let i = 0; i < this.points.length; i++){
      render(new PointView({point : this.points[i]}), this.pointsListComponent.getElement());
    }
    getTotalPrice(this.points);
  }

}
