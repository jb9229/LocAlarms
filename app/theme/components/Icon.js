import variable from "../material";

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
