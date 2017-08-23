import {Http} from "./Http";

export class GeoService {
  static subscribers = [];
  static watchID = navigator.geolocation.watchPosition((location) => {
    GeoService.pushLocation(location);
  });

  static getLocation(callback: (geo: GeoData) => any): void {
    navigator.geolocation.getCurrentPosition(data => callback(data), () => callback({
      coords: {
        latitude: 0,
        longitude: 0,
        accuracy: 0,
        altitude: 0,
        altitudeAccuracy: 0,
        heading: 0,
        speed: 0,
      },
      timestamp: 0
    }))
  }

  static subscribe(success: (GeoData) => any) {
    GeoService.subscribers.push(success);
    navigator.geolocation.getCurrentPosition((location) => {
      success(location)
    })
  }

  static destroy() {
    GeoService.subscribers = [];
    navigator.geolocation.clearWatch(GeoService.watchID);
  }

  static pushLocation(location: GeoData) {
    GeoService.subscribers.forEach((callback) => {
      callback(location);
    })
  }

  static geocode(location: GeoLocation): Promise<any[]> {
    return Http.getRequest("https://maps.googleapis.com/maps/api/geocode/json", {
      key: "AIzaSyAtdwFVNtWYJYMmSsHeOW_dSlNTKiXFv08",
      latlng: `${location.latitude},${location.longitude}`
    }).then(res => res.result);
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
