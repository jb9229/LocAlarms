export class GeoService {
  static subscribers = [];
  static watchID = navigator.geolocation.watchPosition((location) => {
    GeoService.pushLocation(location);
  });

  static getLocation() {
    return new Promise<GeoData>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve)
    });
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
