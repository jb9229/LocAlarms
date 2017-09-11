const types = {
  setShowArchived: "setShowArchived"
};

const actions = {
  [types.setShowArchived]: null
};

const reducers = {
  [types.setShowArchived]: (state, {payload: showArchived}) => ({...state, showArchived})
};

export default {
  actions, reducers
}
