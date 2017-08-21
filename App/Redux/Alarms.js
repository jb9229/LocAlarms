import {List} from "immutable";
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
    [types.addAlarm]: (state: List, {payload}) => {
      return state.push(payload);
    }
  }, initialState: List()
};

export const sagas = {
  [types.addAlarm]: [logger, API]
};

export function* logger(api, action) {
  console.log("this is action", action);
}




