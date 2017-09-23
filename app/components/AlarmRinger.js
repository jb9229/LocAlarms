import React, {Component} from "react";
import {Modal, StyleSheet, TouchableOpacity, View} from "react-native";
import {isDefined} from "../lib/Operators";
import Color from "color";
import {Theme} from "../theme";
import autobind from "autobind-decorator";
import PropTypes from "prop-types";
import {cancelAlarm, checkAlarms, subscribeActive, subscribeCancel} from "../lib/checkAlarms";

export class AlarmRinger extends Component {
  state = {
    activeAlarm: null
  };

  constructor(props) {
    super(props);
    subscribeActive((alarm) => {
      this.setState({
        activeAlarm: alarm
      });
    });
    subscribeCancel(() => {
      this.setState({activeAlarm: null});
    })
  }

  componentWillReceiveProps(next) {
    checkAlarms(next.alarms);
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
