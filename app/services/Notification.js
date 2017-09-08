import PushNotification from "react-native-push-notification";
import {DeviceEventEmitter} from "react-native";
import type {Alarm} from "./Alarm";
import _ from "lodash";

PushNotification.configure({

  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    console.log('TOKEN:', token);
  },

  // (required) Called when a remote or local notification is opened or received
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);
  },

  senderID: "YOUR GCM SENDER ID",
  permissions: {
    alert: true,
    badge: true,
    sound: true
  },
  popInitialNotification: true,
  requestPermissions: true
});

export class NotificationService {
  static activeAlarmNotifications = [];

  static start(cancelAction: (alarmId: string) => any) {
    PushNotification.registerNotificationActions(['Cancel']);
    DeviceEventEmitter.addListener('notificationActionReceived', ({dataJSON}) => {
      const actionData = JSON.parse(dataJSON);
      _.remove(NotificationService.activeAlarmNotifications, (id) => id === actionData.data.id);
      cancelAction(actionData.data.id);
    });
  }

  static warnClose(alarm: Alarm) {
    if (!_.includes(NotificationService.activeAlarmNotifications, alarm.id)) {
      NotificationService.activeAlarmNotifications.push(alarm.id);
      PushNotification.localNotification({
        autoCancel: false, // (optional) default: true
        ongoing: true, // (optional) set whether this is an "ongoing" notification
        title: `${alarm.name} is upcoming`, // (optional, for iOS this is only used in apple watch, the title will be the app name on other iOS devices)
        message: `${alarm.name} is upcoming`, // (required)
        actions: '["Cancel"]',  // (Android only) See the doc for notification actions to know more,
        data: alarm
      });
    }
  }
}
