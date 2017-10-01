import React, {Component} from 'react';
import {Alert, BackHandler} from "react-native";
import {addNavigationHelpers} from 'react-navigation';
import {connect} from 'react-redux';
import AppNavigation, {Routes} from './AppNavigation';
import {locService} from "../lib/Services";

const getCurrentRouteName = (navigationState) => {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  return route.routeName;
};

@connect((state) => ({nav: state.nav}), null)
export class ReduxNavigation extends Component {
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      const {dispatch, nav} = this.props;
      if (getCurrentRouteName(nav) === Routes.home) {
        Alert.alert(
          'Close app?',
          'Your alarms will not activate when the app is closed.',
          [
            {text: 'Cancel'},
            {
              text: 'Ok', onPress: () => {
              locService.stopService();
              BackHandler.exitApp();
            }, style: 'cancel'
            }
          ],
          {cancelable: false}
        );
        return true;
      }
      dispatch({type: 'Navigation/BACK'});
      return true;
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress');
  }

  render() {
    return <AppNavigation navigation={addNavigationHelpers({dispatch: this.props.dispatch, state: this.props.nav})}/>;
  }
}
