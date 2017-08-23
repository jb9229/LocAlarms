import {DrawerNavigator, StackNavigator} from 'react-navigation'

import styles from './Styles/NavigationStyles'
import {HomeContainer} from "../Containers/Home";
import {AddAlarmContainer} from "../Containers/AddAlarm";
import {Preferences} from "../Containers/Preferences";

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
  headerMode: 'none'
});

export default PrimaryNav
