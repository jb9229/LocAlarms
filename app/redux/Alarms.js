import {delay} from "redux-saga";
import {call, put} from "redux-saga/effects";
import {reset as resetForm} from "redux-form";
import {alarmFormName} from "../components/forms/AlarmForm";
import uuid from "uuid/v4";
import type {Alarm} from "../lib/Types";
import _ from "lodash";

const types = {
  alarmFormSubmit: "alarmFormSubmit",
  addAlarm: "addAlarm",
  editAlarm: "editAlarm",
  deleteAlarm: "deleteAlarm",
  deactivateAlarm: "deactivateAlarm",
  reactivateAlarm: "reactivateAlarm"
};
const actions = {
  [types.alarmFormSubmit]: (alarm, initialAlarm?) => ({alarm, initialAlarm}),
  [types.addAlarm]: null,
  [types.editAlarm]: null,
  [types.deleteAlarm]: null,
  [types.deactivateAlarm]: (id: string, now: string) => ({id, now}),
  [types.reactivateAlarm]: null
};
const reducers = {
  [types.addAlarm]: (state: Alarm[], {payload: alarm}) => [...state, alarm],
  [types.editAlarm]: (state: Alarm[], {payload: alarm}) => state.map((elem: Alarm) => elem.id === alarm.id ? alarm : elem),
  [types.deleteAlarm]: (state: Alarm[], {payload: id}) => state.filter((elem: Alarm) => elem.id !== id),
  [types.deactivateAlarm]: (state: Alarm[], {payload: {id, now}}) => state.map((alarm: Alarm) => alarm.id === id ? {
    ...alarm,
    schedule: {...alarm.schedule, lastDeactivated: now}
  } : alarm),
  [types.reactivateAlarm]: (state: Alarm[], {payload: id}) => state.map((alarm: Alarm) => alarm.id === id ? {
    ...alarm,
    schedule: {...alarm.schedule, lastDeactivated: null}
  } : alarm)
};

const sagas = {
  [types.alarmFormSubmit]: [formSubmit]
};

function* formSubmit(actionCreators, action) {
  if (action.payload.initialAlarm) {
    yield put(actionCreators.editAlarm(_.merge({}, action.payload.initialAlarm, action.payload.alarm)));
  } else {
    yield put(actionCreators.addAlarm(_.merge({}, action.payload.alarm, {id: uuid()})));
  }
  yield call(delay, 500); // visual delay
  yield put(resetForm(alarmFormName));
}

export default {
  actions, reducers, sagas
};
