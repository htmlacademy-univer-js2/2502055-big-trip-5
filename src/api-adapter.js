/* eslint-disable camelcase */
// api.js
import ApiService from './framework/api-service.js';

const AUTHORIZATION = 'Basic pavl3nus:1234';
const END_POINT = 'https://24.objects.htmlacademy.pro/big-trip';

export default class Api {
  constructor() {
    this._apiService = new ApiService(END_POINT, AUTHORIZATION);
    this._destinations = null;
    this._offers = null;
  }

  async init() {
    try {
      [this._destinations, this._offers] = await Promise.all([
        this.getDestinations(),
        this.getOffers()
      ]);

      return this.getPoints();
    } catch (err) {
      throw new Error('Error initializing data');
    }
  }

  async getPoints() {
    const response = await this._apiService._load({url: 'points'});
    const points = await ApiService.parseResponse(response);
    return this._adaptPointsToClient(points);
  }

  async getDestinations() {
    const response = await this._apiService._load({url: 'destinations'});
    const destinations = await ApiService.parseResponse(response);
    this._destinations = this._adaptDestinationsToClient(destinations);
    return this._destinations;
  }

  async getOffers() {
    const response = await this._apiService._load({url: 'offers'});
    const offers = await ApiService.parseResponse(response);
    this._offers = this._adaptOffersToClient(offers);
    return this._offers;
  }

  async updatePoint(point) {
    const response = await this._apiService._load({
      url: `points/${point.id}`,
      method: 'PUT',
      body: JSON.stringify(this._adaptPointToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    const updatedPoint = await ApiService.parseResponse(response);

    return this._adaptPointsToClient([updatedPoint])[0];
  }

  _adaptPointsToClient(points) {
    return points.map((point) => ({
      id: point.id,
      type: point.type,
      startDate: point.date_from,
      endDate: point.date_to,
      price: point.base_price,
      destination: this._destinations.find((d) => d.id === point.destination),
      offers: this._getOffersForPoint(point),
      isFavorite: point.is_favorite
    }));
  }

  _getOffersForPoint(point) {
    const offerType = this._offers.find((offer) => offer.type === point.type);
    if (!offerType) {
      return [];
    }

    return point.offers
      .map((offerId) => offerType.offers.find((offer) => offer.id === offerId))
      .filter(Boolean)
      .map((offer) => ({
        type: point.type,
        label: offer.title,
        price: offer.price,
        id: offer.id
      }));
  }

  _adaptDestinationsToClient(destinations) {
    return destinations.map((destination) => ({
      id: destination.id,
      city: destination.name,
      description: destination.description,
      photos: destination.pictures.map((picture) => picture.src)
    }));
  }

  _adaptOffersToClient(offers) {
    return offers.map((offerType) => ({
      type: offerType.type,
      offers: offerType.offers.map((offer) => ({
        id: offer.id,
        title: offer.title,
        price: offer.price
      }))
    }));
  }

  _adaptPointToServer(point) {
    return {
      id: point.id,
      base_price: point.price,
      date_from: new Date(point.startDate),
      date_to: new Date(point.endDate),
      destination: point.destination.id,
      is_favorite: point.isFavorite || false,
      offers: point.offers.map((offer) => offer.id),
      type: point.type.toLowerCase()
    };
  }
}
