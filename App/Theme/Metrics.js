import {Dimensions, Platform} from "react-native";

const Metrics = {
  screenHeight: Dimensions.get("window").height ,
  screenWidth:Dimensions.get("window").width,
  navHeaderHeight: Platform.select({ios: 64, android: 50})
};

export default Metrics;
