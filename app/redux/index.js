import {applyMiddleware, bindActionCreators, compose} from 'redux';
import {reducer as navReducer} from "./Navigator";
import {combineActions, combineReducers, combineSagas} from "./utils";
import {reducer as formReducer} from "redux-form";
import {objectMap} from "../lib/Operators";
import {persistReducer, persistStore} from "redux-persist";
import Config from '../config/DebugConfig';
import createSagaMiddleware from 'redux-saga';
import storage from 'redux-persist/es/storage';

import alarmRedux from "./Alarms";
import statusRedux from "./Status";

export const namespaces = {
  alarms: "alarms",
  nav: "nav",
  form: "form",
  status: "status"
};
const initialState = {
  [namespaces.alarms]: [],
  [namespaces.status]: {ready: false, isConnected: true}
};

export const actionCreators = combineActions({
  [namespaces.alarms]: alarmRedux.actions,
  [namespaces.status]: statusRedux.actions
});

function* rootSaga() {
  yield combineSagas({
    [namespaces.alarms]: alarmRedux.sagas,
    [namespaces.status]: statusRedux.sagas
  }, actionCreators);
}

export const createStore = () => {
  const ReduxConfig = {
    key: 'root',
    storage,
    blacklist: [namespaces.nav, namespaces.form, namespaces.status]
  };

  const rootReducer = persistReducer(ReduxConfig, combineReducers({
    [namespaces.nav]: navReducer,
    [namespaces.alarms]: alarmRedux.reducers,
    [namespaces.form]: formReducer,
    [namespaces.status]: statusRedux.reducers
  }, initialState));
  const middleware = [];
  const enhancers = [];
  const sagaMonitor = Config.useReactotron ? console.tron.createSagaMonitor() : null;
  const sagaMiddleware = createSagaMiddleware({sagaMonitor});
  middleware.push(sagaMiddleware);
  enhancers.push(applyMiddleware(...middleware));

  const createAppropriateStore = Config.useReactotron ? console.tron.createStore : createStore;
  const store = createAppropriateStore(rootReducer, compose(...enhancers));
  let persistor = persistStore(store, ReduxConfig);
  sagaMiddleware.run(rootSaga);
  return {store, persistor};
};


export const actionDispatcher = (dispatch) => ({actions: objectMap(actionCreators, (value) => bindActionCreators(value, dispatch))});

export const stateSelector = (...namespaces) => ((state) => ({
  state: namespaces.reduce((x, namespace) => ({
    ...x,
    [namespace]: state[namespace]
  }), {})
}));
