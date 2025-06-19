export default class PointsModel {
  #apiAdapter = null;
  #points = [];
  #destinations = [];
  #offers = [];
  #isLoading = true;
  #isFailed = false;

  constructor(apiService) {
    this.#apiAdapter = apiService;
  }

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  get isLoading() {
    return this.#isLoading;
  }

  get isFailed() {
    return this.#isFailed;
  }

  async init() {
    try {
      [this.#destinations, this.#offers] = await Promise.all([
        this.#apiAdapter.getDestinations(),
        this.#apiAdapter.getOffers()
      ]);

      this.#points = await this.#apiAdapter.getPoints();
      this.#isFailed = false;
    } catch (err) {
      this.#isFailed = true;
      throw new Error('Failed to initialize model data');
    } finally {
      this.#isLoading = false;
    }
  }

  async updatePoint(update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const response = await this.#apiAdapter.updatePoint(update);

      this.#points = [
        ...this.#points.slice(0, index),
        response,
        ...this.#points.slice(index + 1)
      ];

      return response;
    } catch (err) {
      throw new Error('Can\'t update point');
    }
  }

  async deletePoint(pointId) {
    const index = this.#points.findIndex((point) => point.id === pointId);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      await this.#apiAdapter.deletePoint(pointId);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1)
      ];
    } catch (err) {
      throw new Error('Can\'t delete point');
    }
  }

  async addPoint(update) {
    try {
      const response = await this.#apiAdapter.addPoint(update);
      this.#points = [response, ...this.#points];
      return response;
    } catch (err) {
      throw new Error('Can\'t add point');
    }
  }
}
