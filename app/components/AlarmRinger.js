import React, {Component} from "react";
import {Modal, StyleSheet, TouchableOpacity, View} from "react-native";
import {isDefined} from "../lib/NullCheck";
import Color from "color";
import {Theme} from "../theme";
import type {Alarm} from "../services/Alarm";
import {AlarmService} from "../services/Alarm";
import autobind from "autobind-decorator";
import PropTypes from "prop-types";
import moment from "moment";
import type {GeoData} from "../services/Geo";
import {GeoService} from "../services/Geo";
import {ScheduleService} from "../services/Schedule";
import {AudioService} from "../services/Audio";
import {NotificationService} from "../services/Notification";

export class AlarmRinger extends Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    alarms: PropTypes.array.isRequired,
    geo: PropTypes.object
  };

  state = {
    activeAlarm: null
  };

  componentWillReceiveProps(next) {
    const geo: ?GeoData = next.geo;
    if (geo) {
      const now = moment();
      next.alarms.forEach((alarm: Alarm) => {
        const shouldActivate = ScheduleService.inWindow(now, ScheduleService.generateActiveSchedule(alarm.schedule, now));
        const inRange = GeoService.inRadius(alarm.location, alarm.radius, geo.coords);
        if (shouldActivate && inRange) {
          this.setState({
            activeAlarm: alarm
          }, () => {
            AudioService.loop(require("../res/audio/analogue.mp3"), AlarmService.ALARM_AUDIO_ID);
          });
        } else if (shouldActivate && GeoService.coordsToMeters(alarm.location, geo.coords) <= (alarm.radius * 1.5)) {
          NotificationService.warnClose(alarm);
        }
      });
    }
  }

  @autobind
  cancelAlarm() {
    this.props.onClose(this.state.activeAlarm.id);
    AudioService.stop(AlarmService.ALARM_AUDIO_ID);
    this.setState({activeAlarm: null});
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
