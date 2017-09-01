import React, {Component} from 'react';
import {StatusBar} from 'react-native';
import ReduxNavigation from '../navigation/ReduxNavigation';
import {connect} from 'react-redux';
import {actionDispatcher} from '../redux';
import {View} from "native-base";

@connect(null, actionDispatcher)
export class RootContainer extends Component {
  render() {
    return (
      <View>
        <StatusBar barStyle='light-content'/>
        <ReduxNavigation/>
      </View>
    );
  }
}
