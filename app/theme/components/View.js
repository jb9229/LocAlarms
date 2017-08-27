import variable from "../material";

export default (variables = variable) => {
  const viewTheme = {
    ".padder": {
      padding: variables.contentPadding
    },
    flex: 1,
    backgroundColor: variables.cardDefaultBg
  };

  return viewTheme;
};
