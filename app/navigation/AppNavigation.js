import React from "react";
import {StackNavigator} from 'react-navigation';
import {Home} from "../containers/Home";
import {AlarmEditor} from "../containers/AlarmEditor";
import {Preferences} from "../containers/Preferences";

export const Routes = {
  home: "Home",
  alarmEditor: "AlarmEditor",
  preferences: "Preferences"
};


export default StackNavigator({
  [Routes.home]: {screen: Home},
  [Routes.alarmEditor]: {screen: AlarmEditor},
  [Routes.preferences]: {screen: Preferences}
}, {
  headerMode: "none"
});
