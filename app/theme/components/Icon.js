import variable from "../variables/default";

export default (variables = variable) => {
  const iconTheme = {
    ".inverse": {
      color: variables.inverseTextColor
    },
    fontSize: variables.iconFontSize,
    color: variables.textColor
  };

  return iconTheme;
};
