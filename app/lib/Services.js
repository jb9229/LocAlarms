import {DeviceEventEmitter, NativeModules} from 'react-native';
import type {GeoData} from "./Types";
import {checkAlarms} from "./checkAlarms";

type locServiceType = {
  startService: () => Promise<void>,
  stopService: () => void,
  vibrate: () => void,
  cancelVibrate: () => void
}

const locService: locServiceType = NativeModules.GeoLocation;
const start = () => locService.startService().then(() => {
  DeviceEventEmitter.addListener("updateLocation", (geoData: GeoData) => {
    checkAlarms(null, geoData);
  });
});
export {start as startService, locService};
