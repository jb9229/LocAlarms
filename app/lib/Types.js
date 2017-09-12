import {beep, buzzer, digital} from "../res";
import Sound from "react-native-sound";

export const ScheduleTypes = {
  ONCE: "Once",
  DAILY: "Daily"
};
export const SoundFiles = {
  digital: "Digital",
  buzzer: "Buzzer",
  beep: "Beep"
};

export function getSoundFile(name): Sound {
  switch (name) {
    case SoundFiles.digital:
      return digital;
    case SoundFiles.buzzer:
      return buzzer;
    case SoundFiles.beep:
      return beep;
    default:
      return digital;
  }
}

export type Schedule = {
  type: ScheduleTypes.ONCE | ScheduleTypes.DAILY;
  startDate: string,
  startTime: number,
  endTime: number,
  lastDeactivated: string
}
export type Preferences = {
  vibrate: boolean,
  alarmSound: string
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
export type Alarm = {
  id: string;
  name: string;
  location: GeoLocation;
  radius: number;
  hasSchedule: boolean;
  schedule: ?Schedule;
  preferences: Preferences
}
