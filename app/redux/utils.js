import {all, takeLatest} from "redux-saga/effects";
import {createActions, handleActions} from "redux-actions";
import {combineReducers as combReducers} from "redux";
import {createSelector} from "reselect";
import {objectMap} from "../lib/Operators";

export const combineSagas = (obj: { [string]: any }) => all([].concat.apply([], Object.keys(obj).map((key) => {
  return Object.keys(obj[key]).map((key1) => {
    return takeLatest(key + "/" + key1, ...obj[key][key1])
  })
})));
export const combineActions = (actionMap: any) => createActions(actionMap);
export const combineReducers = (reducers) => combReducers(objectMap(reducers, (val, key) => val.reducer ? handleActions(val.reducer, val.initialState) : val));
export const combineSelectors = (selectors) => objectMap(selectors, (val, key) => objectMap(val, (selectFn) => createSelector((state) => state[key], selectFn)));
