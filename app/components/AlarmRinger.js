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
  cancelVibrate;

  constructor(props) {
    super(props);
    Notification.registerNotificationActions(['Cancel']);
    DeviceEventEmitter.addListener('notificationActionReceived', ({dataJSON}) => {
      const alarm: Alarm = JSON.parse(dataJSON).alarm;
      Notification.cancelLocalNotifications({data: alarm});
      this.warnedAlarms = _.without(this.warnedAlarms, alarm);
      this.props.cancelAlarm(alarm.id);
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
      const shouldActivate = inWindow(now, generateActiveSchedule(alarm, now));
      const inRange = inRadius(alarm.location, alarm.radius, geo.coords);
      if (shouldActivate && inRange) {
        this.setState({
          activeAlarm: alarm
        }, () => {
          if (!this.playingSound) {
            this.playingSound = getSoundFile(alarm.preferences.alarmSound);
            this.playingSound.play();
          }
          if (alarm.preferences.vibrate && !isDefined(this.cancelVibrate)) {
            this.cancelVibrate = execEvery(() => {
              Vibration.vibrate();
            }, 750, true);
          }
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
    this.playingSound.stop();
    this.playingSound = null;
    this.setState({activeAlarm: null});
    if (isDefined(this.cancelVibrate)) {this.cancelVibrate(); this.cancelVibrate = null};
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
