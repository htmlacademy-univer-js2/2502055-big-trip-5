import {replace, remove, render, RenderPosition} from '../framework/render.js';
import ListView from '../view/list-view.js';
import RouteView from '../view/route-view.js';
import SortView from '../view/sort-view.js';
import PointView from '../view/list-point-view.js';
import EditEventView from '../view/edit-form-view.js';
import AddNewButtonView from '../view/add-new-button-view.js';
import HeaderView from '../view/header-view.js';
import InfoView from '../view/trip-info-view.js';
import {getTotalPrice} from '../utils.js';
import FilterView from '../view/filter-view.js';
import { emptyPoint } from '../const.js';

export default class RoutePresenter {
  #routeComponent = new RouteView();
  #pointsListComponent = new ListView();
  #headerComponent = new HeaderView();

  #headerContainer = null;
  #routeContainer = null;
  #pointsModel = null;

  constructor({routeContainer, pointsModel, headerContainer}) {
    this.#routeContainer = routeContainer;
    this.#pointsModel = pointsModel;
    this.#headerContainer = headerContainer;
  }

  init() {
    this.points = this.#pointsModel.points;
    this.destinations = this.#pointsModel.destinations;
    this.offers = this.#pointsModel.offers;
    render(this.#headerComponent, this.#headerContainer);
    render(new InfoView(), this.#headerComponent.element);
    render(new FilterView, this.#headerComponent.element);
    render(this.#addNewBtn, this.#headerComponent.element, RenderPosition.BEFOREEND);
    render(this.#routeComponent, this.#routeContainer);
    render(new SortView(), this.#routeComponent.element);
    render(this.#pointsListComponent, this.#routeComponent.element);
    for (let i = 0; i < this.points.length; i++){
      this.#renderPoint(this.points[i]);
    }
    getTotalPrice(this.points);
  }

  #renderPoint(point) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replacePointToForm();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new PointView({
      point: point,
      onClick: () => {
        replaceFormToPoint();
        document.addEventListener('keydown', escKeyDownHandler);
      },
    });

    const editPointComponent = new EditEventView({
      point: point,
      destinations: this.destinations,
      offers: this.offers,
      onClick: () => {
        replacePointToForm();
      },
      onAbortion: () => {
        remove(editPointComponent);
      },
      onSubmit: () => {
        replacePointToForm();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
    });

    function replacePointToForm() {
      replace(pointComponent, editPointComponent);
    }

    function replaceFormToPoint() {
      replace(editPointComponent, pointComponent);
    }

    render(pointComponent, this.#pointsListComponent.element);
  }

  #addNewEventButtonClick = () => {
    this.#addNewBtn.element.disabled = true;
    render(
      new EditEventView({
        point: emptyPoint,
        destinations: this.destinations,
        offers: this.offers,
        onSubmit: () => {},
        onAbortion: () => {}
      }),
      this.#pointsListComponent.element, RenderPosition.AFTERBEGIN);
  };

  #addNewBtn = new AddNewButtonView({onClick: this.#addNewEventButtonClick});

}
