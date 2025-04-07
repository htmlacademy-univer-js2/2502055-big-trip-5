import RoutePresenter from './presenter/route-presenter.js';
import PointsModel from './model/point-model.js';

const pointsModel = new PointsModel();
const mainElement = document.querySelector('.page-main');
const headerElement = document.querySelector('.page-header');
const tripContainer = mainElement.querySelector('.page-body__container');
const headerContainer = headerElement.querySelector('.page-header__container');
const routePresenter = new RoutePresenter({routeContainer: tripContainer, pointsModel: pointsModel, headerContainer: headerContainer});

routePresenter.init();
