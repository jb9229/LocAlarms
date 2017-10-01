import variable from "../material";

export default (variables = variable) => {
  const textTheme = {
    fontSize: variables.DefaultFontSize - 1,
    fontFamily: variables.fontFamily,
    color: variables.textColor,
    ".note": {
      color: "#a7a7a7",
      fontSize: variables.noteFontSize
    },
    ".subtitle": {
      fontSize: variables.titleFontSize - 3,
      fontWeight: "700"
    },
    ".branded": {
      color: variables.brandPrimary,
      fontWeight: "900"
    }
  };

  return textTheme;
};
