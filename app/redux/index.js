import {applyMiddleware, bindActionCreators, compose} from 'redux';
import {reducer as navReducer} from "./Navigator";
import alarmRedux from "./Alarms";
import {combineActions, combineReducers, combineSagas, combineSelectors} from "./utils";
import {reducer as formReducer} from "redux-form";
import {objectMap} from "../lib/Operators";
import Config from '../config/DebugConfig';
import createSagaMiddleware from 'redux-saga';
import {persistReducer, persistStore} from "redux-persist";
import storage from 'redux-persist/es/storage';

const initialState = {
  alarms: []
};
const namespaces = {
  alarms: "alarms",
  nav: "nav",
  form: "form"
};

export const actionCreators = combineActions({
  [namespaces.alarms]: alarmRedux.actions
});

function* rootSaga() {
  yield combineSagas({
    [namespaces.alarms]: alarmRedux.sagas
  }, actionCreators);
}

export const createStore = () => {
  const ReduxConfig = {
    key: 'root',
    storage,
    blacklist: [namespaces.nav, namespaces.form]
  };

  const rootReducer = persistReducer(ReduxConfig, combineReducers({
    [namespaces.nav]: navReducer,
    [namespaces.alarms]: alarmRedux.reducers,
    [namespaces.form]: formReducer
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

export const selectors = combineSelectors({
  [namespaces.alarms]: alarmRedux.selectors
});

export const actionDispatcher = (dispatch) => objectMap(actionCreators, (value) => bindActionCreators(value, dispatch));

export const propsMerger = (stateProps, dispatchProps, additionalProps) =>
  Object.assign({}, additionalProps, Object.keys(dispatchProps).reduce((result, key) => {
    return Object.assign({}, result, {[key]: Object.assign({}, {actions: dispatchProps[key]}, result[key])});
  }, objectMap(stateProps, (val) => ({state: val}))));
