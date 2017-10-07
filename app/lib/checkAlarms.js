import {store} from "../containers/App";
import moment from "moment";
import {DeviceEventEmitter} from "react-native";
import type {Alarm, GeoData} from "./Types";
import {getSoundFile} from "./Types";
import {generateActiveSchedule, inWindow} from "./Schedule";
import {coordsToMeters, inRadius} from "./Geo";
import _ from "lodash";
import {isDefined} from "./Operators";
import {actionCreators} from "../redux/index";
import Notification from "react-native-push-notification";
import {locService} from "./Services";

let playingSound, activateAlarmNotifications = [], warnedAlarms = [], activeAlarm, activeSubscribers = [],
  cancelSubscribers = [];

export function subscribeActive(fn) {
  activeSubscribers.push(fn);
}

export function subscribeCancel(fn) {
  cancelSubscribers.push(fn);
}

Notification.registerNotificationActions(['Cancel', 'Stop']);
DeviceEventEmitter.addListener('notificationActionReceived', ({dataJSON}) => {
  const data = JSON.parse(dataJSON);
  const alarm: Alarm = data.alarm;
  Notification.cancelLocalNotifications({alarm});
  if (data.action === "Stop") {
    cancelAlarm();
  } else {
    warnedAlarms = _.without(warnedAlarms, alarm);
    dispatchStoreCancel(alarm.id);
  }
});

export function cancelAlarm() {
  cancelSubscribers.forEach((fn) => fn());
  if (_.includes(activateAlarmNotifications, activeAlarm)) {
    Notification.cancelLocalNotifications({alarm: activeAlarm});
    activateAlarmNotifications = _.without(activateAlarmNotifications, activeAlarm);
  }
  if (isDefined(activeAlarm)) dispatchStoreCancel(activeAlarm.id);
  if (playingSound) {
    playingSound.stop();
    playingSound = null;
  }
  locService.cancelVibrate();
}

function dispatchStoreCancel(id) {
  store.dispatch(actionCreators.alarms.deactivateAlarm(id, moment()));
}

export async function checkAlarms(alarmList: ?Alarm[], geoData: GeoData) {
  let alarms, geo;
  if (!isDefined(alarmList)) alarms = store.getState().alarms;
  else alarms = alarmList;
  if (!isDefined(geoData)) geo = await new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(resolve);
  });
  else geo = geoData;
  const now = moment();
  alarms.forEach((alarm: Alarm) => {
      const inSchedule = inWindow(now, generateActiveSchedule(alarm, now));
      const inRange = inRadius(alarm.location, alarm.radius, geo.coords);
      if (inSchedule && inRange) {
        activeAlarm = alarm;
        activeSubscribers.forEach((fn) => {
          fn(alarm);
        });
        if (!isDefined(playingSound)) {
          playingSound = getSoundFile(alarm.preferences.alarmSound);
          playingSound.play((success) => {
            if (!success) {
              playingSound.play();
            }
          });
        }
        if (alarm.preferences.vibrate) {
          locService.vibrate();
        }
        if (!_.includes(activateAlarmNotifications, alarm)) {
          activateAlarmNotifications.push(alarm);
          Notification.localNotification({
            ongoing: false,
            message: `${alarm.name} is ringing`,
            smallIcon: "ic_alarm_icon",
            actions: '["Stop"]',
            alarm
          });
        }
      }
      else if (inSchedule && coordsToMeters(alarm.location, geo.coords) <= (alarm.radius * 1.5) && !_.includes(warnedAlarms, alarm)) {
        warnedAlarms.push(alarm);
        Notification.localNotification({
          ongoing: false, // (optional) set whether this is an "ongoing" notification
          smallIcon: "ic_alarm_icon",
          message: `${alarm.name} is upcoming`, // (required)
          actions: '["Cancel"]',  // (Android only) See the doc for notification actions to know more,
          alarm
        });
      }
    }
  );
}

