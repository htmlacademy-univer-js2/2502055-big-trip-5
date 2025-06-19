import { render, remove, RenderPosition } from '../framework/render.js';
import ListView from '../view/list-view.js';
import RouteView from '../view/route-view.js';
import SortView from '../view/sort-view.js';
import AddNewButtonView from '../view/add-new-button-view.js';
import InfoView from '../view/trip-info-view.js';
import EmptyMessageView from '../view/empty-message-views.js';
import {emptyPoint, MESSAGES } from '../const.js';
import { sortByDate, sortByDuration, sortByPrice } from '../utils.js';
import PointPresenter from './point-presenter.js';
import EditEventView from '../view/edit-form-view.js';

export default class RoutePresenter {
  #routeComponent = new RouteView();
  #pointsListComponent = new ListView();
  #headerContainer = null;
  #routeContainer = null;
  #pointsModel = null;
  #sortView = null;
  #newPointForm = null;
  #currentSortType = 'day';
  #filteredPoints = [];
  #emptyMessage = null;
  #pointPresenters = new Map();
  #infoView = null;
  #filterModel = null;

  constructor({ routeContainer, pointsModel, headerContainer, filterModel}) {
    this.#filterModel = filterModel;
    this.#routeContainer = routeContainer;
    this.#pointsModel = pointsModel;
    this.#headerContainer = headerContainer;
    this.#filterModel.addObserver(this.#handleModelEvent.bind(this));

    this.#sortView = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });
  }

  async init() {
    await this.#pointsModel.init();
    this.points = this.#pointsModel.points;
    this.destinations = this.#pointsModel.destinations;
    this.offers = this.#pointsModel.offers;

    this.#renderHeader();
    this.#renderRouteComponents();
    this.#filterPoints();
    this.#sortPoints();
    this.#renderPointsList();
    this.#updateHeaderInfo();

  }

  #handleModelEvent = () => {
    this.#currentSortType = 'day';
    this.#sortView.updateCurrentSortType('day');
    this.#updatePointsData();
  };

  #renderHeader() {
    this.#infoView = new InfoView(this.points);
    this.#updateHeaderInfo();
    render(this.#infoView, this.#headerContainer.element);
    render(this.#addNewBtn, this.#headerContainer.element);
  }

  #renderRouteComponents() {
    render(this.#routeComponent, this.#routeContainer);
    render(this.#sortView, this.#routeComponent.element);
    render(this.#pointsListComponent, this.#routeComponent.element);
  }

  #renderPointsList() {
    if (this.#filteredPoints.length === 0) {
      this.#renderEmptyMessage(this.#filterModel.filter);
      return;
    }

    this.#filteredPoints.forEach((point) => this.#renderPoint(point));
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      container: this.#pointsListComponent.element,
      destinations: this.destinations,
      offers: this.offers,
      onDataChange: this.#handlePointsChange,
      onModeChange: this.#handleModeChange,
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #updateHeaderInfo() {
    if (this.#infoView) {
      remove(this.#infoView);
    }

    this.#infoView = new InfoView(this.#filteredPoints);
    render(this.#infoView, this.#headerContainer.element, RenderPosition.AFTERBEGIN);
  }

  #updatePointsData() {
    this.points = this.#pointsModel.points;
    this.#applyFilterAndUpdate();
  }

  #clearPointsList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    if (this.#emptyMessage) {
      remove(this.#emptyMessage);
      this.#emptyMessage = null;
    }
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointsChange = async (actionType, updatedPoint) => {
    switch (actionType) {
      case 'UPDATE':
        await this.#pointsModel.updatePoint(updatedPoint);
        break;
      case 'DELETE':
        await this.#pointsModel.deletePoint(updatedPoint.id);
        this.#pointPresenters.get(updatedPoint.id).destroy();
        this.#pointPresenters.delete(updatedPoint.id);
        break;
      case 'ADD':
        await this.#pointsModel.addPoint(updatedPoint);
        break;
    }

    this.#updatePointsData();
  };

  #applyFilterAndUpdate = () => {
    this.#filterPoints();
    this.#sortPoints();
    this.#clearPointsList();
    this.#renderPointsList();
    this.#updateHeaderInfo();
  };

  #filterPoints() {
    const now = new Date();
    switch (this.#filterModel.filter) {
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
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#sortPoints();
    this.#clearPointsList();
    this.#renderPointsList();
    this.#sortView.updateCurrentSortType(sortType);
  };

  #sortPoints() {
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
  }

  #renderEmptyMessage(filterType) {
    const message = MESSAGES[filterType];
    this.#emptyMessage = new EmptyMessageView(message);
    render(this.#emptyMessage, this.#routeComponent.element);
  }

  #renderNewPointForm = () => {
    this.#newPointForm = new EditEventView({
      point: emptyPoint,
      destinations: this.destinations,
      offers: this.offers,
      isNewPoint: true,
      onSubmit: this.#handleFormSubmit,
      onClose: this.#handleAbortion
    });
    render(this.#newPointForm, this.#routeContainer, RenderPosition.AFTERBEGIN);
  };

  #addNewEventButtonClick = () => {
    this.#filterModel.setFilter('everything');
    this.#currentSortType = 'day';
    this.#sortView.updateCurrentSortType('day');
    this.#applyFilterAndUpdate();
    this.#addNewBtn.element.disabled = true;
    this.#handleModeChange();
    this.#renderNewPointForm();
  };

  #handleFormSubmit = async (point) => {
    try {
      this.#newPointForm.setSaving();
      await this.#handlePointsChange('ADD', point);
      this.#addNewBtn.element.disabled = false;
      remove(this.#newPointForm);
    } catch {
      this.#newPointForm.shake();
      this.#newPointForm.resetButtonState();
    }
  };

  #handleAbortion = () => {
    this.#addNewBtn.element.disabled = false;
    remove(this.#newPointForm);
  };

  #addNewBtn = new AddNewButtonView({ onClick: this.#addNewEventButtonClick });
}
