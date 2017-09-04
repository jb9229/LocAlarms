import {Http} from "./Http";

export class GeoService {
  static subscribers = [];
  static watchID = navigator.geolocation.watchPosition((location) => {
    GeoService.pushLocation(location);
  });

  static getLocation(): Promise<GeoData> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }

  static subscribe(success: (GeoData) => any) {
    GeoService.subscribers.push(success);
    navigator.geolocation.getCurrentPosition((location) => {
      success(location);
    });
  }

  static destroy() {
    GeoService.subscribers = [];
    navigator.geolocation.clearWatch(GeoService.watchID);
  }

  static pushLocation(location: GeoData) {
    GeoService.subscribers.forEach((callback) => {
      callback(location);
    });
  }

  static geocode(location: GeoLocation): Promise<any[]> {
    return Http.getRequest("https://maps.googleapis.com/maps/api/geocode/json", {
      key: "AIzaSyAtdwFVNtWYJYMmSsHeOW_dSlNTKiXFv08",
      latlng: `${location.latitude},${location.longitude}`
    });
  }

  static search(address: string, radius): Promise<{ formatted_address: string, geometry: { location: { lat: number, lng: number } } }[]> {
    return GeoService.getLocation().then((geo: GeoData) => {
      return Http.getRequest("https://maps.googleapis.com/maps/api/place/textsearch/json", Object.assign({
        key: "AIzaSyAtdwFVNtWYJYMmSsHeOW_dSlNTKiXFv08",
        query: address
      }, radius ? {
        location: `${geo.coords.latitude},${geo.coords.longitude}`,
        radius: 10000
      } : {}));
    }).then((res) => res.results);
  }

  static coordsToMeters(locA: GeoLocation, locB: GeoLocation) {  // generally used geo measurement function
    const [lat1, lon1, lat2, lon2] = [locA.latitude, locA.longitude, locB.latitude, locB.longitude];
    let R = 6378.137; // Radius of earth in KM
    let dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    let dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;
    return d * 1000; // meters
  }

  static inRadius(center: GeoLocation, radius: number, target: GeoLocation) {
    return GeoService.coordsToMeters(center, target) <= radius;
  }
}

export type GeoData = {
  coords: GeoLocation & {
    accuracy: number,
    altitude: number,
    altitudeAccuracy: number,
    heading: number,
    speed: number,
  },
  timestamp: number
}

export type GeoLocation = {
  latitude: number,
  longitude: number
}
