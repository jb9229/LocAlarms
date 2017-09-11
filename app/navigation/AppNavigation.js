import React from "react";
import {StackNavigator} from 'react-navigation';
import {Home} from "../containers/Home";
import {AlarmEditor} from "../containers/AlarmEditor";

export const Routes = {
  home: "Home",
  alarmEditor: "AlarmEditor"

};


export default StackNavigator({
  [Routes.home]: {screen: Home},
  [Routes.alarmEditor]: {screen: AlarmEditor}
}, {
  headerMode: "none"
});
