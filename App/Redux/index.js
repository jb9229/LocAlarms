import {bindActionCreators} from 'redux'
import configureStore from './CreateStore'
import {reducer as navReducer} from "./Navigator"
import {actions as alarmActions, reducers as alarmReducer, sagas as alarmSagas} from "./Alarms";
import {combineActions, combineReducers, combineSagas} from "./utils";
import {reducer as formReducer} from "redux-form";

function* rootSaga() {
  yield combineSagas({
    alarms: alarmSagas
  });
}


export default () => {
  const rootReducer = combineReducers({
    nav: navReducer,
    alarms: alarmReducer,
    form: formReducer
  });
  const store = configureStore(rootReducer, rootSaga);
  if (module.hot) { // enable hot reload
    module.hot.accept(() => {
      store.replaceReducer(rootReducer);
    });
  }
  return store
}

export const actionCreators = combineActions({
  alarms: alarmActions,
  startup: null
});

export const actionDispatcher = (dispatch) => Object.keys(actionCreators).reduce((map, key) => {
  return Object.assign({}, map, {[key]: bindActionCreators(actionCreators[key], dispatch)})
}, {});
