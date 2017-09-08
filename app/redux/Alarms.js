import {delay} from "redux-saga";
import {all, call, put} from "redux-saga/effects";
import {reset as resetForm} from "redux-form";
import {alarmFormName} from "../components/forms/AlarmForm";
import uuid from "uuid/v4";
import type {Alarm} from "../services/Alarm";
import {AlarmService} from "../services/Alarm";
import _ from "lodash";
import {AudioService} from "../services/Audio";

const types = {
  alarmFormSubmit: "alarmFormSubmit",
  addAlarm: "addAlarm",
  editAlarm: "editAlarm",
  deleteAlarm: "deleteAlarm",
  deactivateAlarm: "deactivateAlarm"
};
const actions = {
  [types.alarmFormSubmit]: (alarm, initialAlarm?) => ({alarm, initialAlarm}),
  [types.addAlarm]: null,
  [types.editAlarm]: null,
  [types.deleteAlarm]: null,
  [types.deactivateAlarm]: (id: string, now: string) => ({id, now})
};
const reducers = {
  [types.addAlarm]: (state: any[], {payload: alarm}) => [...state, alarm],
  [types.editAlarm]: (state: any[], {payload: alarm}) => state.map((elem: Alarm) => elem.id === alarm.id ? alarm : elem),
  [types.deleteAlarm]: (state: any[], {payload: id}) => state.filter((elem: Alarm) => elem.id !== id),
  [types.deactivateAlarm]: (state: any[], {payload: {id, now}}) => state.map((alarm: Alarm) => {
      return alarm.id === id ? {...alarm, schedule: {...alarm.schedule, lastDeactivated: now}} : alarm;
    }
  )
};
const selectors = {
  all: (state) => state
};

const sagas = {
  [types.alarmFormSubmit]: [formSubmit],
  [types.deactivateAlarm]: [deactivateAlarm]
};

function* formSubmit(actionCreators, action) {
  if (action.payload.initialAlarm) {
    yield put(actionCreators.editAlarm(_.merge({}, action.payload.initialAlarm, action.payload.alarm)));
  } else {
    yield put(actionCreators.addAlarm(_.merge({}, action.payload.alarm, {id: uuid()})));
  }
  yield all([
    call(function* () {
      yield call(delay, 500); // visual delay
      yield put(resetForm(alarmFormName));
    }),
    call(AlarmService.update)
  ]);
}

function* deactivateAlarm() {
  yield all([
    call(AudioService.stop, AlarmService.ALARM_AUDIO_ID),
    call(AlarmService.update)
  ]);
}

export default {
  types, actions, reducers, sagas, selectors
};
