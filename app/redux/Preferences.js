const types = {
  setSound: "setSound"
};
const actions = {
  [types.setSound]: null
};
const reducers = {
  [types.setSound]: (state, {payload: fileName}) => ({...state, alarmSound: fileName})
};

export default {
  actions, reducers
};
