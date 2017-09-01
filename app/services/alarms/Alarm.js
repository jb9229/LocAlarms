import type {GeoLocation} from "../Geo";
import {Moment} from "moment";

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

export function generateActiveSchedule(schedule: Schedule, windowStart: Moment, windowEnd?: Moment): { start: Moment, end: Moment }[] {
  let result = [];
  if (schedule.type === ScheduleTypes.ONCE) {
    if (windowStart.isBefore()) {
      return [];
    }
  } else {
    if (windowEnd) {
      let current: Moment = windowStart;
    }
  }
  return result;
}

export function inWindow(moment: Moment, activeScheduleWindows: { start: Moment, end: Moment }[]) {
  return activeScheduleWindows.reduce((inWindow: boolean, window: { start: Moment, end: Moment }) => {
    return inWindow || moment.isAfter(window.start) && moment.isBefore(window.end);
  }, false)
}

export type Alarm = {
  name: string;
  location: GeoLocation;
  radius: number;
  schedule: Schedule;
}
