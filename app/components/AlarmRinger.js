import React, {Component} from "react";
import {Modal, StyleSheet, TouchableOpacity, View} from "react-native";
import {isDefined} from "../lib/NullCheck";
import Color from "color";
import {Theme} from "../theme";
import {AlarmService} from "../services/Alarm";
import autobind from "autobind-decorator";
import PropTypes from "prop-types";

export class AlarmRinger extends Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      activeAlarm: null
    };
    AlarmService.subscribe((alarm) => {
      this.setState({
        activeAlarm: alarm
      });
    });
  }

  @autobind
  cancelAlarm() {
    this.props.onClose(this.state.activeAlarm.id);
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
    flex:1
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
