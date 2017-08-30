import {put} from "redux-saga/effects";
import {reset as resetForm} from "redux-form";
import {alarmFormName} from "../components/forms/AlarmForm";
import {arrPush, arrRemove, arrReplace} from "../lib/Operators";
import uuid from "uuid/v4";
import {actionCreators} from "./index";

export const types = {
  alarmFormSubmit: "alarmFormSubmit",
  addAlarm: "addAlarm",
  editAlarm: "editAlarm",
  deleteAlarm: "deleteAlarm"
};
export const actions = {
  [types.alarmFormSubmit]: (alarm, id: string) => ({alarm, id}),
  [types.addAlarm]: null,
  [types.editAlarm]: null,
  [types.deleteAlarm]: null
};
export const reducers = {
  reducer: {
    [types.addAlarm]: (state: any[], {payload: alarm}) => arrPush(state, alarm),
    [types.editAlarm]: (state: any[], {payload: alarm}) => arrReplace(state, (elem) => elem.id === alarm.id, alarm),
    [types.deleteAlarm]: (state: any[], {payload: id}) => arrRemove(state, (elem) => elem.id === id)
  }, initialState: []
};
export const selectors = {
  all: (state) => state
};

export const sagas = {
  [types.alarmFormSubmit]: [formSubmit]
};

function* formSubmit(action) {
  if (action.payload.id) {
    yield put(actionCreators.alarms.editAlarm({...action.payload.alarm, id: action.payload.id}));
  } else {
    yield put(actionCreators.alarms.addAlarm({...action.payload.alarm, id: uuid()}));
  }
  yield put(resetForm(alarmFormName))
}

export default {
  types, actions, reducers, sagas, selectors
}




