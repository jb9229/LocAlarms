import {all, takeLatest} from "redux-saga/effects";
import {createActions, handleActions} from "redux-actions";
import {combineReducers as combReducers} from "redux";

export const combineSagas = (obj: { [string]: any }) => all([].concat.apply([], Object.keys(obj).map((key) => {
  return Object.keys(obj[key]).map((key1) => {
    return takeLatest(key + "/" + key1, ...obj[key][key1])
  })
})));
export const combineActions = (actionMap: any) => createActions(actionMap);
export const combineReducers = (reducers: { [string]: { reducer: any, initialState: any } }) =>
  combReducers(Object.keys(reducers).reduce((map, key) => {
    if (reducers[key].reducer) {
      return Object.assign({}, map, {[key]: handleActions(reducers[key].reducer, reducers[key].initialState)})
    } else {
      return Object.assign({}, map, {[key]: reducers[key]})
    }
  }, {}));

