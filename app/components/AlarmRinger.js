import React, {Component} from "react";
import {DeviceEventEmitter, Modal, StyleSheet, TouchableOpacity, View, Vibration} from "react-native";
import {isDefined} from "../lib/Operators";
import Color from "color";
import {Theme} from "../theme";
import type {Alarm, GeoData} from "../lib/Types";
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
    alarmSound: PropTypes.number,
    cancelAlarm: PropTypes.func.isRequired
  };

  state = {
    activeAlarm: null
  };

  sound: Sound;

  warnedAlarms = [];
  vibrating = false;

  constructor(props) {
    super(props);
    this.sound = new Sound(this.props.alarmSound);

    Notification.registerNotificationActions(['Cancel']);
    DeviceEventEmitter.addListener('notificationActionReceived', ({dataJSON}) => {
      const alarm: Alarm = JSON.parse(dataJSON).alarm;
      Notification.cancelLocalNotifications({data: alarm});
      this.warnedAlarms = _.without(this.warnedAlarms, alarm);
      this.props.cancelAlarm(alarm.id);
    });
  }

  componentWillReceiveProps(next) {
    const geo: ?GeoData = next.geo;
    if (geo) {
      this.checkAlarms(next.alarms, geo);
    }
    if (next.alarmSound !== this.props.alarmSound) {
      this.sound = new Sound(next.alarmSound);
    }
  }

  checkAlarms(alarms, geo) {
    const now = moment();
    alarms.forEach((alarm: Alarm) => {
      const shouldActivate = inWindow(now, generateActiveSchedule(alarm.schedule, now));
      const inRange = inRadius(alarm.location, alarm.radius, geo.coords);
      if (shouldActivate && inRange) {
        this.setState({
          activeAlarm: alarm
        }, () => {
          this.sound.play();
          if (!this.vibrating) {Vibration.vibrate([2000], true); this.vibrating = true}
        });
      } else if (shouldActivate && coordsToMeters(alarm.location, geo.coords) <= (alarm.radius * 1.5) && !_.includes(this.warnedAlarms, alarm)) {
        this.warnedAlarms.push(alarm);
        Notification.localNotification({
          ongoing: false, // (optional) set whether this is an "ongoing" notification
          title: `${alarm.name} is upcoming`, // (optional, for iOS this is only used in apple watch, the title will be the app name on other iOS devices)
          message: `${alarm.name} is upcoming`, // (required)
          actions: '["Cancel"]',  // (Android only) See the doc for notification actions to know more,
          alarm
        });
      }
    });
  }

  @autobind
  cancelAlarm() {
    this.props.cancelAlarm(this.state.activeAlarm.id);
    this.sound.stop();
    this.setState({activeAlarm: null});
    Vibration.cancel();
    this.vibrating = false;
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
