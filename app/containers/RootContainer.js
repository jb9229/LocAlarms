import React, {Component} from 'react';
import {StatusBar} from 'react-native';
import {ReduxNavigation} from '../navigation/ReduxNavigation';
import {View} from "native-base";
import {AlarmRinger} from "../components/AlarmRinger";
import moment from "moment";
import {actionDispatcher} from "../redux";
import {connect} from "react-redux";
import {namespaces, stateSelector} from "../redux/index";

@connect(stateSelector(namespaces.status, namespaces.alarms), actionDispatcher)
export class RootContainer extends Component {
  constructor(props) {
    super(props);
    this.props.actions.status.startup();
  }

  render() {
    return (
      <View>
        <StatusBar barStyle='light-content'/>
        <AlarmRinger alarms={this.props.state.alarms}
                     alarmSound={require("../res/audio/analogue.mp3")}
                     cancelAlarm={(id) => {
                       this.props.actions.alarms.deactivateAlarm(id, moment())
                     }}
                     onClose={(id) => {
                       this.props.actions.alarms.deactivateAlarm(id, moment());
                     }}
                     geo={this.props.state.status.location}/>
        <ReduxNavigation/>
      </View>
    );
  }
}
