import {applyMiddleware, compose, createStore} from 'redux'
import {autoRehydrate} from 'redux-persist'
import Config from '../Config/DebugConfig'
import createSagaMiddleware from 'redux-saga'
import RehydrationServices from '../Services/RehydrationServices'
import ReduxPersist from '../Config/ReduxPersist'
import ScreenTracking from './ScreenTrackingMiddleware'

export default (rootReducer, rootSaga) => {
  const middleware = [];
  const enhancers = [];

  middleware.push(ScreenTracking);

  const sagaMonitor = Config.useReactotron ? console.tron.createSagaMonitor() : null;
  const sagaMiddleware = createSagaMiddleware({sagaMonitor});
  middleware.push(sagaMiddleware);

  enhancers.push(applyMiddleware(...middleware));

  if (ReduxPersist.active) {
    enhancers.push(autoRehydrate())
  }

  // if Reactotron is enabled (default for __DEV__), we'll create the store through Reactotron
  const createAppropriateStore = Config.useReactotron ? console.tron.createStore : createStore;
  const store = createAppropriateStore(rootReducer, compose(...enhancers));


  if (ReduxPersist.active) {
    RehydrationServices.updateReducers(store)
  }
  sagaMiddleware.run(rootSaga);

  return store
}
