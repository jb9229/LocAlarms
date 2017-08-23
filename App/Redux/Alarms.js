import {API} from "../Services/Api";

export const types = {
  addAlarm: "add_alarm",
  removeAlarm: "remove_alarm"
};
export const actions = {
  [types.addAlarm]: null,
  [types.removeAlarm]: null
};
export const reducers = {
  reducer: {
    [types.addAlarm]: (state: any[], {payload}) => {
      return [...state, payload];
    }
  }, initialState: []
};

export const sagas = {
  [types.addAlarm]: [logger, API]
};

function* logger(_, action) {
  console.log("this is action", action);
}

export default {
  types, actions, reducers, sagas
}




