import React, {Component} from "react";
import {Modal, StyleSheet, TouchableOpacity, View} from "react-native";
import {isDefined} from "../lib/Operators";
import Color from "color";
import {Theme} from "../theme";
import type {GeoData} from "../lib/Types";
import autobind from "autobind-decorator";
import PropTypes from "prop-types";
import {cancelAlarm, checkAlarms, subscribe} from "../lib/checkAlarms";

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

  constructor(props) {
    super(props);
    subscribe((alarm) => {
      this.setState({
        activeAlarm: alarm
      });
    });
  }

  componentWillReceiveProps(next) {
    const geo: ?GeoData = next.geo;
    if (geo) {
      checkAlarms();
    }
  }

  @autobind
  cancelAlarm() {
    this.setState({activeAlarm: null});
    cancelAlarm();
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
