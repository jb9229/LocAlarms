import variable from "../Variables/default";

export default (variables = variable) => {
  const pickerTheme = {
    ".note": {
      color: "#8F8E95"
    },
    width: 90,
    marginRight: -4
  };

  return pickerTheme;
};
