import type {GeoData, GeoLocation} from "../Geo";
import {GeoService} from "../Geo";
import moment, {Moment} from "moment";
import _ from "lodash";
import {isDefined} from "../../lib/NullCheck";
import {AudioService} from "../Audio";

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
  endTime: number,
  lastDeactivated: string
}


export class ScheduleService {
  static generateActiveSchedule(schedule: Schedule, windowStart: ?Moment): { start: Moment, end: Moment }[] {
    let result = [];
    switch (schedule.type) {
      case ScheduleTypes.ONCE: {
        const start = moment(schedule.startDate);
        result.push({
          start: ScheduleService.addMoment(start, schedule.startTime, "m"),
          end: ScheduleService.addMoment(start, schedule.endTime, "m")
        });
        break;
      }
      case ScheduleTypes.DAILY: {
        let current = windowStart;
        _.times(15, _.constant(null)).forEach(() => {
          result.push({
            start: ScheduleService.addMoment(current, schedule.startTime, "m"),
            end: ScheduleService.addMoment(current, schedule.endTime, "m")
          });
          current = ScheduleService.addMoment(current, 1, "d");
        });
        break;
      }
    }
    return result.filter((range) => !(isDefined(schedule.lastDeactivated) && ScheduleService.inWindow(moment(schedule.lastDeactivated), range)));
  }

  static inWindow(moment: Moment, activeScheduleWindows: { start: Moment, end: Moment }[] | { start: Moment, end: Moment }) {
    if (_.isArray(activeScheduleWindows))
      return activeScheduleWindows.reduce((inWindow: boolean, window: { start: Moment, end: Moment }) => {
        return inWindow || moment.isAfter(window.start) && moment.isBefore(window.end);
      }, false);
    else
      return moment.isAfter(activeScheduleWindows.start) && moment.isBefore(activeScheduleWindows.end);
  }

  static addMoment(mmt, quantity, unit) {
    return moment(mmt).add(quantity, unit);
  }

  static timeToString(x: number) {
    const hours = Math.floor(x / 60);
    const minutes = x - hours * 60;
    const pm = hours > 12;
    return `${pm ? hours - 12 : hours}:${minutes} ${pm ? "PM" : "AM"}`;
  };

  static stringToTime(x: string) {
    let [hours, _, minutes, _1, time] = x.split(/([: ])/);
    [hours, minutes] = [parseInt(hours), parseInt(minutes)];
    if (time === "PM") hours += 12;
    else if (time === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  static currentTimeToMinutes() {
    const now = moment();
    return now.get("hours") * 60 + now.get("minutes");
  };
}


export class AlarmService {
  static subscribers = [];
  static getAlarms: () => Alarm[];
  static ALARM_AUDIO_ID = "alarm";

  static start(getAlarms: () => Alarm[]) {
    AlarmService.getAlarms = getAlarms;
    GeoService.subscribe((geo: GeoData) => {
      AlarmService.update(geo);
    });
  }

  static update(geo: ?GeoData) {
    const now = moment();
    const updateSubscribers = (geo: GeoData) => {
      const anyAlarmActivated = AlarmService.getAlarms().reduce((anyActivated: boolean, alarm: Alarm) => {
        const shouldActivate = ScheduleService.inWindow(now, ScheduleService.generateActiveSchedule(alarm.schedule, now)) && GeoService.inRadius(alarm.location, alarm.radius, geo.coords);
        if (shouldActivate) {
          AudioService.loop(require("../../res/audio/analogue.mp3"), AlarmService.ALARM_AUDIO_ID);
          AlarmService.subscribers.forEach((fn) => fn(alarm));
        }
        return anyActivated || shouldActivate;
      }, false);
      if (!anyAlarmActivated) AudioService.stop(AlarmService.ALARM_AUDIO_ID)
    };
    if (geo) updateSubscribers(geo);
    else GeoService.getLocation().then((geo: GeoData) => {
      updateSubscribers(geo);
    });
  }

  static subscribe(alarmActivate: (alarm: Alarm) => any) {
    AlarmService.subscribers.push(alarmActivate);
  }
}

export type Alarm = {
  id: string;
  name: string;
  location: GeoLocation;
  radius: number;
  schedule: Schedule;
}
