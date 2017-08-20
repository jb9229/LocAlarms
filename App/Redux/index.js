import {combineReducers} from 'redux'
import configureStore from './CreateStore'
import rootSaga from './Sagas'
import {reducer as navReducer} from "./NavigationRedux"
import {reducer as githubReducer} from "./GithubRedux"
import {reducer as searchReducer} from "./SearchRedux"
import {reducer as alarmReducer} from "./Reducers/Alarms"
export default () => {
  /* ------------- Assemble The Reducers ------------- */
  const rootReducer = combineReducers({
    nav: navReducer,
    github: githubReducer,
    search: searchReducer,
    alarms: alarmReducer
  });

  return configureStore(rootReducer, rootSaga)
}
