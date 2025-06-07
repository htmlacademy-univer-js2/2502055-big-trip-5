import {replace, remove, render, RenderPosition} from '../framework/render.js';
import ListView from '../view/list-view.js';
import RouteView from '../view/route-view.js';
import SortView from '../view/sort-view.js';
import PointView from '../view/list-point-view.js';
import EditEventView from '../view/edit-form-view.js';
import AddNewButtonView from '../view/add-new-button-view.js';
import HeaderView from '../view/header-view.js';
import InfoView from '../view/trip-info-view.js';
import EmptyMessageView from '../view/empty-message-views.js';
import FilterView from '../view/filter-view.js';
import {emptyPoint, MESSAGES} from '../const.js';
import { sortByDate, sortByDuration, sortByPrice } from '../utils.js';

export default class RoutePresenter {
  #routeComponent = new RouteView();
  #pointsListComponent = new ListView();
  #headerComponent = new HeaderView();
  #activePointForm = null;
  #headerContainer = null;
  #routeContainer = null;
  #pointsModel = null;
  #filterView = null;
  #sortView = null;
  #currentFilter = 'everything';
  #currentSortType = 'day';
  #filteredPoints = null;
  #emptyMessage = new EmptyMessageView('everything');

  constructor({routeContainer, pointsModel, headerContainer}) {
    this.#routeContainer = routeContainer;
    this.#pointsModel = pointsModel;
    this.#headerContainer = headerContainer;
    this.#filterView = new FilterView({
      currentFilter: this.#currentFilter,
      onFilterChange: this.#handleFilterChange
    });
    this.#sortView = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });
  }

  init() {
    this.points = this.#pointsModel.points;
    this.#filteredPoints = this.points;
    this.destinations = this.#pointsModel.destinations;
    this.offers = this.#pointsModel.offers;
    render(this.#headerComponent, this.#headerContainer);
    render(new InfoView(this.points), this.#headerComponent.element);
    render(this.#filterView, this.#headerComponent.element);
    render(this.#addNewBtn, this.#headerComponent.element, RenderPosition.BEFOREEND);
    render(this.#routeComponent, this.#routeContainer);
    render(this.#sortView, this.#routeComponent.element);
    this.#renderPointsList();
  }

  #renderNewPointForm() {
    this.#activePointForm = new EditEventView({
      point: emptyPoint,
      destinations: this.destinations,
      offers: this.offers,
      onSubmit: () => {},
      onAbortion: () => {
        this.#addNewBtn.element.disabled = false;
        remove(this.#activePointForm);
      }});
    render(this.#activePointForm, this.#pointsListComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderPoint(point) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replacePointToForm();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const editPointComponent = new EditEventView({
      point: point,
      destinations: this.destinations,
      offers: this.offers,
      onClick: () => {
        replacePointToForm();
      },
      onAbortion: () => {
        remove(editPointComponent);
        this.points.pop(point);
      },
      onSubmit: () => {
        this.#activePointForm = null;
        replacePointToForm();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
    });

    const pointComponent = new PointView({
      point: point,
      onClick: () => {
        this.#activePointForm = editPointComponent;
        replaceFormToPoint();
        document.addEventListener('keydown', escKeyDownHandler);
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
    this.#renderNewPointForm();
  };

  #addNewBtn = new AddNewButtonView({onClick: this.#addNewEventButtonClick});

  #handleFilterChange = (filterType) => {
    this.#currentFilter = filterType;
    this.#currentSortType = 'day';
    this.#sortView.updateCurrentSortType('day');
    this.#filterPoints();
    this.#sortPoints();
    this.#clearPointsList();
    this.#renderPointsList();
  };

  #filterPoints = () => {
    const now = new Date();
    switch (this.#currentFilter) {
      case 'future':
        this.#filteredPoints = this.points.filter((point) => new Date(point.startDate) > now);
        break;
      case 'present':
        this.#filteredPoints = this.points.filter((point) =>
          new Date(point.startDate) <= now && new Date(point.endDate) >= now
        );
        break;
      case 'past':
        this.#filteredPoints = this.points.filter((point) => new Date(point.endDate) < now);
        break;
      default:
        this.#filteredPoints = [...this.points];
    }
  };

  #renderPointsList = () => {
    render(this.#pointsListComponent, this.#routeComponent.element);
    if (this.#filteredPoints.length === 0) {
      this.#renderEmptyMessage(this.#currentFilter);
    } else {
      this.#filteredPoints.forEach((point) => this.#renderPoint(point));
    }
  };

  #renderEmptyMessage = (filterType) => {
    const message = MESSAGES[filterType];
    this.#emptyMessage = new EmptyMessageView(message);
    render(this.#emptyMessage, this.#routeComponent.element);
  };

  #clearPointsList = () => {
    remove(this.#emptyMessage);
    this.#pointsListComponent.element.innerHTML = '';
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#sortPoints();
    this.#clearPointsList();
    this.#renderPointsList();
  };

  #sortPoints = () => {
    switch (this.#currentSortType) {
      case 'day':
        this.#filteredPoints = sortByDate(this.#filteredPoints);
        break;
      case 'time':
        this.#filteredPoints = sortByDuration(this.#filteredPoints);
        break;
      case 'price':
        this.#filteredPoints = sortByPrice(this.#filteredPoints);
        break;
      default:
        this.#filteredPoints = sortByDate(this.#filteredPoints);
    }
  };
}
