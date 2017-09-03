import type {GeoData, GeoLocation} from "../Geo";
import {GeoService} from "../Geo";
import moment, {Moment} from "moment";
import _ from "lodash";

export const timeToString = (x: number) => {
  const hours = Math.floor(x / 60);
  const minutes = x - hours * 60;
  const pm = hours > 12;
  return `${pm ? hours - 12 : hours}:${minutes} ${pm ? "PM" : "AM"}`;
};
export const stringToTime = (x: string) => {
  let [hours, _, minutes, _1, time] = x.split(/([: ])/);
  [hours, minutes] = [parseInt(hours), parseInt(minutes)];
  if (time === "PM") hours += 12;
  return hours * 60 + minutes;
};
export const currentTimeToMinutes = () => {
  const now = moment();
  return now.get("hours") * 60 + now.get("minutes");
};

export const ScheduleTypes = {
  ONCE: "Once",
  DAILY: "Daily"
};

/**
 * Time is minutes since midnight
 * Dates are in string format
 */
export type Schedule = {
  type: ScheduleTypes.ONCE | ScheduleTypes.DAILY;
  startDate: string,
  endDate?: string,
  startTime: number,
  endTime: number
}

export function generateActiveSchedule(schedule: Schedule, windowStart: ?Moment): { start: Moment, end: Moment }[] {
  let result = [];
  switch (schedule.type) {
    case ScheduleTypes.ONCE: {
      const start = moment(schedule.startDate);
      result.push({start: start.add(schedule.startTime, "minutes"), end: start.add(schedule.endTime, "minutes")});
      break;
    }
    case ScheduleTypes.DAILY: {
      let current = windowStart;
      _.times(15, _.constant(null)).forEach(() => {
        result.push({start: current.add(schedule.startTime, "minutes"), end: current.add(schedule.endTime, "minutes")});
        current = current.add(1, "day");
      });
      break;
    }
  }
  return result;
}

export function inWindow(moment: Moment, activeScheduleWindows: { start: Moment, end: Moment }[]) {
  return activeScheduleWindows.reduce((inWindow: boolean, window: { start: Moment, end: Moment }) => {
    return inWindow || moment.isAfter(window.start) && moment.isBefore(window.end);
  }, false);
}


export class AlarmService {
  static subscribers = [];

  static start(getAlarms: () => Alarm[]) {
    console.log(getAlarms());
    GeoService.subscribe((geo: GeoData) => {
      getAlarms().forEach((alarm: Alarm) => {
        const now = moment();
        if (inWindow(now, generateActiveSchedule(alarm.schedule, now)) && GeoService.inRadius(alarm.location, alarm.radius, geo.coords)) {
          AlarmService.subscribers.forEach((fn) => fn(alarm));
        }
      });
    });
  }

  static subscribe(alarmActivate: (alarm: Alarm) => any) {
    AlarmService.subscribers.push(alarmActivate);
  }
}

export type Alarm = {
  name: string;
  location: GeoLocation;
  radius: number;
  schedule: Schedule;
}
