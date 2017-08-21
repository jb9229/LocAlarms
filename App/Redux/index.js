import {bindActionCreators} from 'redux'
import configureStore from './CreateStore'
import {reducer as navReducer} from "./Navigator"
import {actions as alarmActions, reducers as alarmReducer, sagas as alarmSagas} from "./Alarms";
import {combineActions, combineReducers, combineSagas} from "./utils";

function* rootSaga() {
  yield combineSagas({
    alarms: alarmSagas
  });
}


export default () => {
  const rootReducer = combineReducers({
    nav: navReducer,
    alarms: alarmReducer
  });

  return configureStore(rootReducer, rootSaga)
}

export const actionCreators = combineActions({
  alarms: alarmActions
});

export const actionDispatcher = (dispatch) => Object.keys(actionCreators).reduce((map, key) => {
  return Object.assign({}, map, {[key]: bindActionCreators(actionCreators[key], dispatch)})
}, {});
