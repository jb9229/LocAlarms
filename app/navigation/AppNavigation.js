import React from "react";
import {DrawerNavigator, StackNavigator} from 'react-navigation'
import {HomeContainer} from "../containers/Home";
import {AddAlarmContainer} from "../containers/AddAlarm";
import {Preferences} from "../containers/Preferences";
import {AppDrawer} from "./AppDrawer";

// Manifest of possible screens
const PrimaryNav = DrawerNavigator({
  Home: {
    screen: StackNavigator({
      Main: {screen: HomeContainer},
      AddAlarm: {screen: AddAlarmContainer}
    }, {
      headerMode: 'none'
    })
  },
  Preferences: {screen: Preferences},
}, {
  headerMode: 'none',
  contentComponent: props => <AppDrawer {...props}/>
});

export default PrimaryNav
