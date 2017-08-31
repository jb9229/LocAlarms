import '../config'
import DebugConfig from '../config/DebugConfig'
import React, {Component} from 'react'
import {Provider} from 'react-redux'
import {RootContainer} from './RootContainer'
import {createStore} from '../redux'
import {StyleProvider} from "native-base";

import getTheme from "../theme/components";
import {Colors} from "../theme";

const store = createStore();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <StyleProvider style={getTheme(Colors)}>
          <RootContainer/>
        </StyleProvider>
      </Provider>
    )
  }
}

console.ignoredYellowBox = ['Setting a timer'];
// allow reactotron overlay for fast design in dev mode
export default DebugConfig.useReactotron
  ? console.tron.overlay(App)
  : App
