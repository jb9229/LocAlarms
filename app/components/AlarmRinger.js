import React, {Component} from "react";
import {DeviceEventEmitter, Modal, StyleSheet, TouchableOpacity, Vibration, View} from "react-native";
import {execEvery, isDefined} from "../lib/Operators";
import Color from "color";
import {Theme} from "../theme";
import type {Alarm, GeoData} from "../lib/Types";
import {getSoundFile} from "../lib/Types";
import autobind from "autobind-decorator";
import PropTypes from "prop-types";
import moment from "moment";
import {coordsToMeters, inRadius} from "../lib/Geo";
import {generateActiveSchedule, inWindow} from "../lib/Schedule";
import Sound from "react-native-sound";
import Notification from "react-native-push-notification";
import _ from "lodash";

export class AlarmRinger extends Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    alarms: PropTypes.array.isRequired,
    geo: PropTypes.object,
    cancelAlarm: PropTypes.func.isRequired
  };

  state = {
    activeAlarm: null
  };

  playingSound: Sound = null;
  warnedAlarms = [];
  activateAlarmNotifications = [];
  cancelVibrate;

  constructor(props) {
    super(props);
    Notification.registerNotificationActions(['Cancel', 'Stop']);
    DeviceEventEmitter.addListener('notificationActionReceived', ({dataJSON}) => {
      const data = JSON.parse(dataJSON);
      const alarm: Alarm = data.alarm;
      Notification.cancelLocalNotifications({alarm});
      if (data.action === "Stop") {
        this.activateAlarmNotifications = _.without(this.activateAlarmNotifications, alarm);
        this.cancelAlarm();
      } else {
        this.warnedAlarms = _.without(this.warnedAlarms, alarm);
        this.props.cancelAlarm(alarm.id);
      }
    });
    execEvery(() => {
      console.log(this.props.geo);
      this.checkAlarms(this.props.alarms, this.props.geo);
    }, 60000, true);
  }

  componentWillReceiveProps(next) {
    const geo: ?GeoData = next.geo;
    if (geo) {
      this.checkAlarms(next.alarms, geo);
    }
  }

  @autobind
  checkAlarms(alarms, geo) {
    const now = moment();
    alarms.forEach((alarm: Alarm) => {
      const inSchedule = inWindow(now, generateActiveSchedule(alarm, now));
      const inRange = inRadius(alarm.location, alarm.radius, geo.coords);
      if (inSchedule && inRange) {
        this.setState({
          activeAlarm: alarm
        }, () => {
          if (!isDefined(this.playingSound)) {
            this.playingSound = getSoundFile(alarm.preferences.alarmSound);
            this.playingSound.play((success) => {
              if (!success) {
                this.playingSound.play();
              }
            });
          }
          if (alarm.preferences.vibrate && !isDefined(this.cancelVibrate)) {
            this.cancelVibrate = execEvery(() => {
              Vibration.vibrate();
            }, 750, true);
          }
          if (!_.includes(this.activateAlarmNotifications, alarm)) {
            this.activateAlarmNotifications.push(alarm);
            Notification.localNotification({
              ongoing: false,
              message: `${alarm.name} is ringing`,
              actions: '["Stop"]',
              alarm
            });
          }
        });
      } else if (inSchedule && coordsToMeters(alarm.location, geo.coords) <= (alarm.radius * 1.5) && !_.includes(this.warnedAlarms, alarm)) {
        this.warnedAlarms.push(alarm);
        Notification.localNotification({
          ongoing: false, // (optional) set whether this is an "ongoing" notification
          message: `${alarm.name} is upcoming`, // (required)
          actions: '["Cancel"]',  // (Android only) See the doc for notification actions to know more,
          alarm
        });
      }
    });
  }

  @autobind
  cancelAlarm() {
    if (_.includes(this.activateAlarmNotifications, this.state.activeAlarm)) {
      Notification.cancelLocalNotifications({alarm: this.state.activeAlarm});
      this.activateAlarmNotifications = _.without(this.activateAlarmNotifications, this.state.activeAlarm);
    }
    this.props.cancelAlarm(this.state.activeAlarm.id);
    if (this.playingSound) {
      this.playingSound.stop();
      this.playingSound = null;
    }
    this.setState({activeAlarm: null});
    if (isDefined(this.cancelVibrate)) {
      this.cancelVibrate();
      this.cancelVibrate = null;
    }
  }

  render() {
    return <Modal
      animationType="slide"
      transparent
      visible={isDefined(this.state.activeAlarm)}
      onRequestClose={() => {
      }}>
      <View style={styles.modal}>
        <TouchableOpacity style={styles.stopBtn} onPress={this.cancelAlarm}>
          <View style={styles.stopBtnIcon}/>
        </TouchableOpacity>
      </View>
    </Modal>;
  }
}


const styles = StyleSheet.create({
  modal: {
    backgroundColor: Color(Theme.brandDanger).alpha(0.9).string(),
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  stopBtn: {
    width: 100,
    height: 100,
    backgroundColor: Color(Theme.brandDanger).saturate(0.4).string(),
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center"
  },
  stopBtnIcon: {
    width: 40,
    height: 40,
    backgroundColor: "white"
  }
});
