import variable from "../Variables/default";

export default (variables = variable) => {
  const viewTheme = {
    ".padder": {
      padding: variables.contentPadding
    },
    flex: 1
  };

  return viewTheme;
};
