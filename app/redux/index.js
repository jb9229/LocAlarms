import {bindActionCreators} from 'redux'
import configureStore from './CreateStore'
import {reducer as navReducer} from "./Navigator"
import alarmRedux from "./Alarms";
import {combineActions, combineReducers, combineSagas, combineSelectors} from "./utils";
import {reducer as formReducer} from "redux-form";
import {objectMap} from "../lib/Operators";

const initialState = {
  alarms: []
};

export const actionCreators = combineActions({
  alarms: alarmRedux.actions,
  startup: null
});

function* rootSaga() {
  yield combineSagas({
    alarms: alarmRedux.sagas
  }, actionCreators);
}


export const createStore = () => {
  return configureStore(combineReducers({
    nav: navReducer,
    alarms: alarmRedux.reducers,
    form: formReducer
  }, initialState), rootSaga)
};

export const selectors = combineSelectors({
  alarms: alarmRedux.selectors
});

export const actionDispatcher = (dispatch) => objectMap(actionCreators, (value) => bindActionCreators(value, dispatch));

export const propsMerger = (stateProps, dispatchProps, additionalProps) =>
  Object.assign({}, additionalProps, Object.keys(dispatchProps).reduce((result, key) => {
    return Object.assign({}, result, {[key]: Object.assign({}, {actions: dispatchProps[key]}, result[key])})
  }, objectMap(stateProps, (val) => ({state: val}))));
