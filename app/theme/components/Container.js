import {Dimensions, Platform} from "react-native";

import variable from "../material";

const deviceHeight = Dimensions.get("window").height;
export default (variables = variable) => {
  const theme = {
    flex: 1,
    height: Platform.OS === "ios" ? deviceHeight : deviceHeight - 20,
    backgroundColor: variables.cardDefaultBg
  };

  return theme;
};
