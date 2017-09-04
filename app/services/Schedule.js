import moment, {Moment} from "moment";
import {isDefined} from "../lib/NullCheck";

export const ScheduleTypes = {
  ONCE: "Once",
  DAILY: "Daily"
};
export type Schedule = {
  type: ScheduleTypes.ONCE | ScheduleTypes.DAILY;
  startDate: string,
  endDate?: string,
  startTime: number,
  endTime: number,
  lastDeactivated: string
}

export class ScheduleService {
  static generateActiveSchedule(schedule: Schedule, winStart: ?Moment): { start: Moment, end: Moment }[] {
    const windowStart = moment(winStart);
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
        let current = windowStart.startOf("d");
        if (current.isSameOrAfter(moment(schedule.startDate))) {
          for (let i = 0; i < 5; i++) { // generates 5 days ahead
            result.push({
              start: ScheduleService.addMoment(current, schedule.startTime, "m"),
              end: ScheduleService.addMoment(current, schedule.endTime, "m")
            });
            current = ScheduleService.addMoment(current, 1, "d");
          }
        }
        break;
      }
    }
    return result.filter((range) => !(isDefined(schedule.lastDeactivated) && moment(schedule.lastDeactivated).isSame(range.start, "d")));
  }

  static inWindow(moment: Moment, activeScheduleWindows: { start: Moment, end: Moment }[] | { start: Moment, end: Moment }) {
    if (_.isArray(activeScheduleWindows))
      return activeScheduleWindows.reduce((inWindow: boolean, window: { start: Moment, end: Moment }) => {
        return inWindow || moment.isBetween(window.start, window.end);
      }, false);
    else
      return moment.isBetween(activeScheduleWindows.start, activeScheduleWindows.end);
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
