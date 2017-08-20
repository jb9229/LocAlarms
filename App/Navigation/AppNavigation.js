import {StackNavigator} from 'react-navigation'

import styles from './Styles/NavigationStyles'
import {Home, HomeContainer} from "../Containers/Home";

// Manifest of possible screens
const PrimaryNav = StackNavigator({
  Home: {screen: HomeContainer}
}, {
  // Default config for all screens
  headerMode: 'none',
  initialRouteName: 'Home',
  navigationOptions: {
    headerStyle: styles.header
  }
});

export default PrimaryNav
