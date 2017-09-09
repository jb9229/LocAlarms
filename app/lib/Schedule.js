import moment, {Moment} from "moment";
import {isDefined} from "./Operators";
import _ from "lodash";
import type {Schedule} from "./Types";
import {ScheduleTypes} from "./Types";

export function generateActiveSchedule(schedule: Schedule, winStart: ?Moment): { start: Moment, end: Moment }[] {
  const windowStart = moment(winStart);
  let result = [];
  switch (schedule.type) {
    case ScheduleTypes.ONCE: {
      const start = moment(schedule.startDate);
      result.push({
        start: addMoment(start, schedule.startTime, "m"),
        end: addMoment(start, schedule.endTime, "m")
      });
      break;
    }
    case ScheduleTypes.DAILY: {
      let current = windowStart.startOf("d");
      if (current.isSameOrAfter(moment(schedule.startDate))) {
        for (let i = 0; i < 5; i++) { // generates 5 days ahead
          result.push({
            start: addMoment(current, schedule.startTime, "m"),
            end: addMoment(current, schedule.endTime, "m")
          });
          current = addMoment(current, 1, "d");
        }
      }
      break;
    }
  }
  return result.filter((range) => !(isDefined(schedule.lastDeactivated) && moment(schedule.lastDeactivated).isSame(range.start, "d")));
}


export function inWindow(moment: Moment, activeScheduleWindows: { start: Moment, end: Moment }[] | { start: Moment, end: Moment }) {
  if (_.isArray(activeScheduleWindows))
    return activeScheduleWindows.reduce((inWindow: boolean, window: { start: Moment, end: Moment }) => {
      return inWindow || moment.isBetween(window.start, window.end);
    }, false);
  else
    return moment.isBetween(activeScheduleWindows.start, activeScheduleWindows.end);
}

function addMoment(mmt, quantity, unit) {
  return moment(mmt).add(quantity, unit);
}

export function timeToString(x: number) {
  const hours = Math.floor(x / 60);
  const minutes = x - hours * 60;
  const pm = hours > 12;
  return `${pm ? hours - 12 : hours}:${minutes} ${pm ? "PM" : "AM"}`;
}

export function stringToTime(x: string) {
  let [hours, _, minutes, _1, time] = x.split(/([: ])/);
  [hours, minutes] = [parseInt(hours), parseInt(minutes)];
  if (time === "PM") hours += 12;
  else if (time === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

export function currentTimeToMinutes() {
  const now = moment();
  return now.get("hours") * 60 + now.get("minutes");
}

