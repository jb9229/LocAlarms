import React, {Component} from 'react';
import {Modal, StatusBar, StyleSheet, TouchableOpacity, View as RView} from 'react-native';
import {ReduxNavigation} from '../navigation/ReduxNavigation';
import {connect} from 'react-redux';
import {actionDispatcher} from '../redux';
import {View} from "native-base";
import {AlarmService} from "../services/Alarm";
import Color from "color";
import {Theme} from "../theme";
import {isDefined} from "../lib/NullCheck";
import autobind from "autobind-decorator";
import moment from "moment";

@connect(null, actionDispatcher)
export class RootContainer extends Component {
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
    this.props.alarms.deactivateAlarm(this.state.activeAlarm.id, moment());
    this.setState({activeAlarm: null});
  }

  render() {
    return (
      <View>
        <StatusBar barStyle='light-content'/>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isDefined(this.state.activeAlarm)}
          onRequestClose={() => {
          }}>
          <View style={styles.modal}>
            <TouchableOpacity style={styles.stopBtn} onPress={this.cancelAlarm}>
              <RView style={styles.stopBtnIcon}/>
            </TouchableOpacity>
          </View>
        </Modal>
        <ReduxNavigation/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: Color(Theme.brandDanger).alpha(0.9).string(),
    justifyContent: "center",
    alignItems: "center"
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
