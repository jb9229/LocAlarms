import {applyMiddleware, compose, createStore} from 'redux'
import {autoRehydrate} from 'redux-persist'
import Config from '../config/DebugConfig'
import createSagaMiddleware from 'redux-saga'
import RehydrationServices from '../services/RehydrationServices'
import ReduxPersist from '../config/ReduxPersist'
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

  const createAppropriateStore = Config.useReactotron ? console.tron.createStore : createStore;
  const store = createAppropriateStore(rootReducer, compose(...enhancers));


  if (ReduxPersist.active) {
    RehydrationServices.updateReducers(store)
  }
  sagaMiddleware.run(rootSaga);

  return store
}
