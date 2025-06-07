import { mockPoints } from '../mock/point.js';
import { mockDestinations } from '../mock/destinations.js';
import { mockOffers } from '../mock/offers.js';


export default class PointsModel {
  #points = mockPoints;
  #destinations = mockDestinations;
  #offers = mockOffers;

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  updatePoint(updatedPoint) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);
    if (index !== -1) {
      this.#points[index] = updatedPoint;
    }
  }

  deletePoint(pointId) {
    try {
      const index = this.#points.findIndex((p) => p.id === pointId);
      if (index === -1) {
        throw new Error(`Point with id ${pointId} not found`);
      }

      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1)
      ];
      return true;
    } catch (error) {
      return false;
    }
  }

  addPoint(point) {
    this.#points.push(point);
  }
}
