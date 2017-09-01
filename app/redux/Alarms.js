import {delay} from "redux-saga";
import {put} from "redux-saga/effects";
import {reset as resetForm} from "redux-form";
import {alarmFormName} from "../components/forms/AlarmForm";
import {arrPush, arrRemove, arrReplace} from "../lib/Operators";
import uuid from "uuid/v4";

const types = {
  alarmFormSubmit: "alarmFormSubmit",
  addAlarm: "addAlarm",
  editAlarm: "editAlarm",
  deleteAlarm: "deleteAlarm"
};
const actions = {
  [types.alarmFormSubmit]: (alarm, id: string) => ({alarm, id}),
  [types.addAlarm]: null,
  [types.editAlarm]: null,
  [types.deleteAlarm]: null
};
const reducers = {
  [types.addAlarm]: (state: any[], {payload: alarm}) => arrPush(state, alarm),
  [types.editAlarm]: (state: any[], {payload: alarm}) => arrReplace(state, (elem) => elem.id === alarm.id, alarm),
  [types.deleteAlarm]: (state: any[], {payload: id}) => arrRemove(state, (elem) => elem.id === id)
};
const selectors = {
  all: (state) => state
};

const sagas = {
  [types.alarmFormSubmit]: [formSubmit]
};

function* formSubmit(actionCreators, action) {
  if (action.payload.id) {
    yield put(actionCreators.editAlarm({...action.payload.alarm, id: action.payload.id}));
  } else {
    yield put(actionCreators.addAlarm({...action.payload.alarm, id: uuid()}));
  }
  yield delay(500);
  yield put(resetForm(alarmFormName))
}

export default {
  types, actions, reducers, sagas, selectors
}




