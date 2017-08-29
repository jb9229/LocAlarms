import variable from "../material";

export default (variables = variable) => {
  const iconTheme = {
    ".inverse": {
      color: variables.inverseTextColor
    },
    ".small": {
      fontSize: variables.iconFontSize - 10
    },
    fontSize: variables.iconFontSize,
    color: variables.textColor
  };

  return iconTheme;
};
