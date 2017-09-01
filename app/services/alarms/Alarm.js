import type {GeoData, GeoLocation} from "../Geo";
import moment, {Moment} from "moment";
import _ from "lodash";
import {GeoService} from "../Geo";

export type Time = {
  hours: number,
  minutes: number
}

export type Date = {
  year: number,
  day: number // number of days since start of year
};

export const ScheduleTypes = {
  ONCE: "Once",
  DAILY: "Daily"
};

/**
 * Time is seconds since midnight
 */
export type Schedule = {
  type: ScheduleTypes.ONCE | ScheduleTypes.DAILY;
  startDate: Moment,
  endDate?: Moment,
  startTime: number,
  endTime: number
}

export function generateActiveSchedule(schedule: Schedule, windowStart: ?Moment): { start: Moment, end: Moment }[] {
  let result = [];
  let start = moment.max(windowStart, schedule.startDate);
  switch (schedule.type) {
    case ScheduleTypes.ONCE: {
      result.push({start: start.add(schedule.startTime, "seconds"), end: start.add(schedule.endTime, "seconds")});
      break;
    }
    case ScheduleTypes.DAILY: {
      let current = start;
      _.times(15, _.constant(null)).forEach(() => {
        result.push({start: current.add(schedule.startTime, "seconds"), end: current.add(schedule.endTime, "seconds")});
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
    GeoService.subscribe((geo: GeoData) => {
      getAlarms().forEach((alarm: Alarm) => {
        const now = moment();
        if (inWindow(now, generateActiveSchedule(alarm.schedule, now))) {
          AlarmService.subscribers.forEach((fn) => fn(alarm))
        }
      })
    })
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
