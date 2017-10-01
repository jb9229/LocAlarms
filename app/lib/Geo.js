import {getRequest} from "./Http";
import type {GeoData, GeoLocation} from "./Types";

const key = "AIzaSyDKUfvIkz5ygXIOjLmuBwcLk07CPYQ-bkQ";

export function geocode(location: GeoLocation): Promise<any[]> {
  return getRequest("https://maps.googleapis.com/maps/api/geocode/json", {
    key,
    latlng: `${location.latitude},${location.longitude}`
  });
}

export function search(address: string, radius: number, geo: GeoData): Promise<{ formatted_address: string, geometry: { location: { lat: number, lng: number } } }[]> {
  return getRequest("https://maps.googleapis.com/maps/api/place/textsearch/json", Object.assign({
    key,
    query: address
  }, radius ? {
    location: `${geo.coords.latitude},${geo.coords.longitude}`,
    radius: 10000
  } : {})).then((res) => res.results);
}

export function coordsToMeters(locA: GeoLocation, locB: GeoLocation) {  // generally used geo measurement function
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

export function inRadius(center: GeoLocation, radius: number, target: GeoLocation) {
  return coordsToMeters(center, target) <= radius;
}

