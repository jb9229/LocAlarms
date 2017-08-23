import {DrawerNavigator} from 'react-navigation'

import styles from './Styles/NavigationStyles'
import {HomeContainer} from "../Containers/Home";
import {AddAlarmContainer} from "../Containers/AddAlarm";

// Manifest of possible screens
const PrimaryNav = DrawerNavigator({
  AddAlarm: {screen: AddAlarmContainer},
  Home: {screen: HomeContainer}
}, {
  headerMode: 'none',
  navigationOptions: {
    headerStyle: styles.header
  }
});

export default PrimaryNav
