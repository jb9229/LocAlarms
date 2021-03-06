import React, {Component} from 'react';
import {StatusBar, UIManager} from 'react-native';
import {ReduxNavigation} from '../navigation/ReduxNavigation';
import {Root, View} from "native-base";
import {AlarmRinger} from "../components/AlarmRinger";
import {actionDispatcher} from "../redux";
import {connect} from "react-redux";
import {namespaces, stateSelector} from "../redux/index";

@connect(stateSelector(namespaces.status, namespaces.alarms), actionDispatcher)
export class RootContainer extends Component {
  constructor(props) {
    super(props);
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  componentWillMount() {
    this.props.actions.status.startup();
    navigator.geolocation.getCurrentPosition((loc) => {
      this.props.actions.status.setLocation(loc);
    });
  }

  render() {
    return (
      <View>
        <StatusBar barStyle='light-content'/>
        <AlarmRinger alarms={this.props.state.alarms}/>
        <Root>
          <ReduxNavigation/>
        </Root>
      </View>
    );
  }
}
