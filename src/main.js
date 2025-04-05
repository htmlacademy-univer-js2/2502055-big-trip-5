import FilterView from './view/filter-view.js';
import InfoView from './view/trip-info-view.js';
import RoutePresenter from './presenter/route-presenter.js';
import CreateEventFormView from './view/create-form-view.js';
import {render, RenderPosition} from './render.js';
import PointsModel from './model/point-model.js';

const pointsModel = new PointsModel();
const mainElement = document.querySelector('.page-main');
const infoContainer = document.querySelector('.trip-main');
const filterContainer = document.querySelector('.trip-controls__filters');
const tripContainer = mainElement.querySelector('.page-body__container');

const routePresenter = new RoutePresenter({routeContainer: tripContainer, pointsModel});

render(new CreateEventFormView(), infoContainer);
render(new InfoView(), infoContainer, RenderPosition.AFTERBEGIN);
render(new FilterView(), filterContainer);
routePresenter.init();
