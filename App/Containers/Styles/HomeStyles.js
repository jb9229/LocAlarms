import {StyleSheet} from 'react-native'
import {ApplicationStyles, Metrics} from '../../Themes/'
import Colors from "../../Themes/Colors";

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    paddingBottom: Metrics.baseMargin
  },
  logo: {
    marginTop: Metrics.doubleSection,
    height: Metrics.images.logo,
    width: Metrics.images.logo,
    resizeMode: 'contain'
  },
  centered: {
    alignItems: 'center'
  },
  mapContainer: {
    height: Metrics.screenHeight * 0.6
  },
  alarmListContainer: {
    minHeight: Metrics.screenHeight * 0.4 - Metrics.navBarHeight,
    backgroundColor: Colors.background
  }
})
