export class GeoService {
  static subscribers = [];
  static watchID = navigator.geolocation.watchPosition((location) => {
    GeoService.pushLocation(location);
  });


  static subscribe(success: (Geolocation) => any) {
    GeoService.subscribers.push(success);
    navigator.geolocation.getCurrentPosition((location) => {
      success(location)
    })
  }

  static destroy() {
    GeoService.subscribers = [];
    navigator.geolocation.clearWatch(GeoService.watchID);
  }

  static pushLocation(location: Geolocation) {
    GeoService.subscribers.forEach((callback) => {
      callback(location);
    })
  }
}

export type Geolocation = {
  coords: {
    accuracy: number,
    altitude: number,
    altitudeAccuracy: number,
    heading: number,
    latitude: number,
    longitude: number,
    speed: number,
  },
  timestamp: number
}
