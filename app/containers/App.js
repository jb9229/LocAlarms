import '../config'
import DebugConfig from '../config/DebugConfig'
import React, {Component} from 'react'
import {Provider} from 'react-redux'
import {RootContainer} from './RootContainer'
import {createStore} from '../redux'
import {StyleProvider, View} from "native-base";

import getTheme from "../theme/components";
import {Theme} from "../theme";
import {PersistGate} from 'redux-persist/es/integration/react'

const {store, persistor} = createStore();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate
          loading={<View/>}
          persistor={persistor}>
          <StyleProvider style={getTheme(Theme)}>
            <RootContainer/>
          </StyleProvider>
        </PersistGate>
      </Provider>
    )
  }
}

console.ignoredYellowBox = ['Setting a timer'];
// allow reactotron overlay for fast design in dev mode
export default DebugConfig.useReactotron
  ? console.tron.overlay(App)
  : App
