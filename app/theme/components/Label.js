import variable from "../material";

export default (variables = variable) => {
  const labelTheme = {
    ".focused": {
      width: 0
    },
    ".error": {
      color: variables.inputErrorBorderColor
    },
    fontSize: 17
  };

  return labelTheme;
};
