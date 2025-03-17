import {render} from '../render.js';
import ListView from '../view/list-view.js';
import RouteView from '../view/route-view.js';
import SortView from '../view/sort-view.js';
import PointView from '../view/list-point-view.js';
import EditEventView from '../view/edit-form-view.js';


export default class RoutePresenter {
  routeComponent = new RouteView();
  pointsListComponent = new ListView();

  constructor({routeContainer}) {
    this.routeContainer = routeContainer;
  }

  init() {
    render(this.routeComponent, this.routeContainer);
    render(new SortView(), this.routeComponent.getElement());
    render(this.pointsListComponent, this.routeComponent.getElement());
    render(new EditEventView(), this.pointsListComponent.getElement());
    for (let i = 0; i < 3; i++){
      render(new PointView(), this.pointsListComponent.getElement());
    }
  }

}
