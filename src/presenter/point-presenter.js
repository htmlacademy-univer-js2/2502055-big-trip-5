import { replace, remove, render } from '../framework/render.js';
import PointView from '../view/list-point-view.js';
import EditEventView from '../view/edit-form-view.js';

export default class PointPresenter {
  #point = null;
  #pointComponent = null;
  #editPointComponent = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #destinations = null;
  #offers = null;

  constructor({ container, destinations, offers, onDataChange, onModeChange }) {
    this.container = container;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;
    this.#renderPoint();
  }

  #renderPoint() {
    const prevPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#editPointComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    if (prevPointComponent === null || prevEditPointComponent === null) {
      render(this.#pointComponent, this.container);
      return;
    }

    if (this.container.contains(prevPointComponent.element)) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.container.contains(prevEditPointComponent.element)) {
      replace(this.#editPointComponent, prevEditPointComponent);
    }

    remove(prevPointComponent);
    remove(prevEditPointComponent);
  }

  resetView() {
    if (this.#editPointComponent) {
      this.#replaceFormToPoint();
    }
  }

  #replacePointToForm() {
    this.#handleModeChange();
    this.#editPointComponent = new EditEventView({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      isNewPoint: false,
      onSubmit: this.#handleFormSubmit,
      onDelete: this.#handlePointDeletion,
      onClose: this.#handleFormClose
    });

    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToPoint() {
    if (!this.#pointComponent?.element || !this.#editPointComponent?.element) {
      return;
    }

    const formParent = this.#editPointComponent.element.parentElement;

    if (!formParent) {
      this.#pointComponent.element.style.display = '';
      document.removeEventListener('keydown', this.#escKeyDownHandler);
      return;
    }

    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointComponent) {
      remove(this.#pointComponent);
    }

    if (this.#editPointComponent) {
      remove(this.#editPointComponent);
    }

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  #handleEditClick = () => {
    this.#replacePointToForm();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange('UPDATE', { ...this.#point, isFavorite: !this.#point.isFavorite });
  };

  #handleFormSubmit = (point) => {
    this.#handleDataChange('UPDATE', point);
    this.#replaceFormToPoint();
  };

  #handlePointDeletion = () => {
    this.#handleDataChange('DELETE', this.#point);
  };

  #handleFormClose = () => {
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };
}
