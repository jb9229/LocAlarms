import {Dimensions, Platform} from "react-native";

export const Metrics = {
  screenHeight: Dimensions.get("window").height ,
  screenWidth:Dimensions.get("window").width,
  navHeaderHeight: Platform.select({ios: 64, android: 50})
};
