import {Dimensions, Platform} from "react-native";

export default {
  screenHeight: Dimensions.get("window").height,
  screenWidth: Dimensions.get("window").width,
  navHeaderHeight: Platform.select({ios: 64, android: 50})
};
