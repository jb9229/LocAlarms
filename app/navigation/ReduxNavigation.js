import React, {Component} from 'react';
import {BackHandler} from "react-native";
import {addNavigationHelpers} from 'react-navigation';
import {connect} from 'react-redux';
import AppNavigation, {Routes} from './AppNavigation';
import _ from "lodash";

const getCurrentRouteName = (navigationState) => {
  if (!navigationState) {
    return null
  }
  const route = navigationState.routes[navigationState.index];
  if (route.routes) {
    return getCurrentRouteName(route)
  }
  return route.routeName
};

@connect((state) => ({nav: state.nav}), null)
export class ReduxNavigation extends Component {
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      const {dispatch, nav} = this.props;
      if (_.includes([Routes.main, Routes.preferences], getCurrentRouteName(nav))) {
        return false;
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
