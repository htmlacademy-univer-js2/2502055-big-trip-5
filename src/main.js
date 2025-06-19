import RoutePresenter from './presenter/route-presenter.js';
import PointsModel from './model/point-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filter-model.js';
import HeaderView from './view/header-view.js';
import { render} from './framework/render.js';
import Api from './api-adapter.js';

const apiAdaprter = new Api();
const pointsModel = new PointsModel(apiAdaprter);
const filterModel = new FilterModel();
const mainElement = document.querySelector('.page-main');
const headerElement = document.querySelector('.page-header__container');
const tripContainer = mainElement.querySelector('.page-body__container');
const headerContainer = new HeaderView();
render(headerContainer, headerElement);
const filterPresenter = new FilterPresenter({
  filterContainer: headerContainer,
  filterModel: filterModel
});

const routePresenter = new RoutePresenter({routeContainer: tripContainer,
  pointsModel: pointsModel,
  headerContainer: headerContainer,
  filterModel: filterModel});


filterPresenter.init();
routePresenter.init();
