import {delay} from "redux-saga";
import {put, call} from "redux-saga/effects";
import {reset as resetForm} from "redux-form";
import {alarmFormName} from "../components/forms/AlarmForm";
import {arrPush, arrRemove, arrReplace} from "../lib/Operators";
import uuid from "uuid/v4";
import {AlarmService} from "../services/alarms/Alarm";
import {GeoService} from "../services/Geo";

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
  yield delay(500); // visual delay
  yield put(resetForm(alarmFormName));
  const geo = yield call(GeoService.getLocation);
  AlarmService.updateSubscribers(geo);
}

export default {
  types, actions, reducers, sagas, selectors
};




