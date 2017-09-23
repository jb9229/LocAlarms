import {store} from "../containers/App";
import moment from "moment";
import {DeviceEventEmitter, Vibration} from "react-native";
import type {Alarm} from "./Types";
import {getSoundFile} from "./Types";
import {generateActiveSchedule, inWindow} from "./Schedule";
import {coordsToMeters, inRadius} from "./Geo";
import _ from "lodash";
import {execEvery, isDefined} from "./Operators";
import {actionCreators} from "../redux/index";
import Notification from "react-native-push-notification";

let playingSound, cancelVibrate, activateAlarmNotifications = [], warnedAlarms, activeAlarm, subscribers = [];

export function subscribe(fn) {
  subscribers.push(fn);
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
  if (_.includes(activateAlarmNotifications, activeAlarm)) {
    Notification.cancelLocalNotifications({alarm: activeAlarm});
    activateAlarmNotifications = _.without(activateAlarmNotifications, activeAlarm);
  }
  if (isDefined(activeAlarm)) dispatchStoreCancel(activeAlarm.id);
  if (playingSound) {
    playingSound.stop();
    playingSound = null;
  }
  if (isDefined(cancelVibrate)) {
    Vibration.cancel();
    cancelVibrate();
    cancelVibrate = null;
  }
}

function dispatchStoreCancel(id) {
  store.dispatch(actionCreators.alarms.deactivateAlarm(id, moment()));
}

export async function checkAlarms() {
  const {alarms} = store.getState();
  const geo = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
  const now = moment();
  alarms.forEach((alarm: Alarm) => {
      const inSchedule = inWindow(now, generateActiveSchedule(alarm, now));
      const inRange = inRadius(alarm.location, alarm.radius, geo.coords);
      if (inSchedule && inRange) {
        activeAlarm = alarm;
        subscribers.forEach((fn) => {
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
        if (alarm.preferences.vibrate && !isDefined(cancelVibrate)) {
          cancelVibrate = execEvery(() => {
            Vibration.vibrate();
          }, 750, true);
        }
        if (!_.includes(activateAlarmNotifications, alarm)) {
          activateAlarmNotifications.push(alarm);
          Notification.localNotification({
            ongoing: false,
            message: `${alarm.name} is ringing`,
            actions: '["Stop"]',
            alarm
          });
        }
      }
      else if (inSchedule && coordsToMeters(alarm.location, geo.coords) <= (alarm.radius * 1.5) && !_.includes(warnedAlarms, alarm)) {
        warnedAlarms.push(alarm);
        Notification.localNotification({
          ongoing: false, // (optional) set whether this is an "ongoing" notification
          message: `${alarm.name} is upcoming`, // (required)
          actions: '["Cancel"]',  // (Android only) See the doc for notification actions to know more,
          alarm
        });
      }
    }
  );
}

