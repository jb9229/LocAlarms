import '../Config'
import DebugConfig from '../Config/DebugConfig'
import React, {Component} from 'react'
import {Provider} from 'react-redux'
import RootContainer from './RootContainer'
import createStore from '../Redux'

const store = createStore();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <RootContainer/>
      </Provider>
    )
  }
}

console.ignoredYellowBox = ['Setting a timer'];
// allow reactotron overlay for fast design in dev mode
export default DebugConfig.useReactotron
  ? console.tron.overlay(App)
  : App
