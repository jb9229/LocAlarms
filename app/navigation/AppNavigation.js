import React from "react";
import {DrawerNavigator, StackNavigator} from 'react-navigation'
import {Home} from "../containers/Home";
import {AlarmEditor} from "../containers/AlarmEditor";
import {Preferences} from "../containers/Preferences";
import {AppDrawer} from "./AppDrawer";

export const Routes = {
  home: "Home",
  main: "Main",
  alarmEditor: "AlarmEditor",
  preferences: "Preferences",
  openDrawer: "DrawerOpen",
  closeDrawer: "DrawerClose"
};

// Manifest of possible screens
const PrimaryNav = DrawerNavigator({
  [Routes.home]: {
    screen: StackNavigator({
      [Routes.main]: {screen: Home},
      [Routes.alarmEditor]: {screen: AlarmEditor}
    }, {
      headerMode: 'none'
    })
  },
  [Routes.preferences]: {screen: Preferences},
}, {
  headerMode: 'none',
  contentComponent: props => <AppDrawer {...props}/>
});

export default PrimaryNav
