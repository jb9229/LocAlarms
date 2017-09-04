import type {GeoData, GeoLocation} from "./Geo";
import {GeoService} from "./Geo";
import moment from "moment";
import {AudioService} from "./Audio";
import {NotificationService} from "./Notification";
import type {Schedule} from "./Schedule";
import {ScheduleService} from "./Schedule";

export class AlarmService {
  static subscribers = [];
  static getAlarms: () => Alarm[];
  static ALARM_AUDIO_ID = "alarm";

  static start(getAlarms: () => Alarm[], cancelAlarm: (alarmId: string) => any) {
    AlarmService.getAlarms = getAlarms;
    GeoService.subscribe((geo: GeoData) => {
      AlarmService.update(geo);
    });
    NotificationService.start(cancelAlarm);
  }

  static update(geo: ?GeoData) {
    const now = moment();
    const updateSubscribers = (geo: GeoData) => {
      AlarmService.getAlarms().forEach((alarm: Alarm) => {
        const shouldActivate = ScheduleService.inWindow(now, ScheduleService.generateActiveSchedule(alarm.schedule, now));
        const inRange = GeoService.inRadius(alarm.location, alarm.radius, geo.coords);
        if (shouldActivate && inRange) {
          AudioService.loop(require("../res/audio/analogue.mp3"), AlarmService.ALARM_AUDIO_ID);
          AlarmService.subscribers.forEach((fn) => fn(alarm));
        } else if (shouldActivate && GeoService.coordsToMeters(alarm.location, geo.coords) <= (alarm.radius * 1.5)) {
          NotificationService.warnClose(alarm)
        }
      });
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
