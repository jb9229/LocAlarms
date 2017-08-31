import {Platform} from "react-native";

import variable from "../material";

export default (variables = variable) => {
  const titleTheme = {
    fontSize: variables.titleFontSize,
    fontFamily: variables.titleFontfamily,
    color: variables.titleFontColor,
    fontWeight: Platform.OS === "ios" ? "600" : undefined,
    textAlign: "center",
    ".inverse": {
      color: variables.textColor
    },
    ".thin": {
      fontWeight: "100",
      fontFamily: Platform.OS === 'android' ? 'sans-serif-light' : undefined
    },
    ".large": {
      fontSize: variables.titleFontSize + 10
    }
  };

  return titleTheme;
};
