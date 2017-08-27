import {put} from "redux-saga/effects";
import {reset} from "redux-form";
import {alarmFormName} from "../components/forms/AlarmForm";

export const types = {
  alarmFormSubmit: "alarmFormSubmit",
  addAlarm: "addAlarm",
  removeAlarm: "removeAlarm"
};
export const actions = {
  [types.alarmFormSubmit]: null,
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
export const selectors = {
  all: (state) => state
};

export const sagas = {
  [types.alarmFormSubmit]: [formSubmit]
};

function* formSubmit(action) {
  yield put({type: types.addAlarm, payload: action.payload});
  yield put(reset(alarmFormName))
}

export default {
  types, actions, reducers, sagas, selectors
}




