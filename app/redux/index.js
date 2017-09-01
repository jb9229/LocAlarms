import {applyMiddleware, bindActionCreators, compose} from 'redux'
import {reducer as navReducer} from "./Navigator"
import alarmRedux from "./Alarms";
import {combineActions, combineReducers, combineSagas, combineSelectors} from "./utils";
import {reducer as formReducer} from "redux-form";
import {objectMap} from "../lib/Operators";
import Config from '../config/DebugConfig'
import createSagaMiddleware from 'redux-saga'
import {persistReducer, persistStore} from "redux-persist";
import storage from 'redux-persist/es/storage'

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
  const ReduxConfig = {
    key: 'root',
    storage,
    blacklist: ['nav', 'form']
  };

  const rootReducer = persistReducer(ReduxConfig, combineReducers({
    nav: navReducer,
    alarms: alarmRedux.reducers,
    form: formReducer
  }, initialState));
  const middleware = [];
  const enhancers = [];
  const sagaMonitor = Config.useReactotron ? console.tron.createSagaMonitor() : null;
  const sagaMiddleware = createSagaMiddleware({sagaMonitor});
  middleware.push(sagaMiddleware);
  enhancers.push(applyMiddleware(...middleware));

  const createAppropriateStore = Config.useReactotron ? console.tron.createStore : createStore;
  const store = createAppropriateStore(rootReducer, compose(...enhancers));
  persistStore(store, ReduxConfig, () => store.dispatch(actionCreators.startup()));
  sagaMiddleware.run(rootSaga);
  return store;
};

export const selectors = combineSelectors({
  alarms: alarmRedux.selectors
});

export const actionDispatcher = (dispatch) => objectMap(actionCreators, (value) => bindActionCreators(value, dispatch));

export const propsMerger = (stateProps, dispatchProps, additionalProps) =>
  Object.assign({}, additionalProps, Object.keys(dispatchProps).reduce((result, key) => {
    return Object.assign({}, result, {[key]: Object.assign({}, {actions: dispatchProps[key]}, result[key])})
  }, objectMap(stateProps, (val) => ({state: val}))));
