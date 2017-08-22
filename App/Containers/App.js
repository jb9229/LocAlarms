import '../Config'
import DebugConfig from '../Config/DebugConfig'
import React, {Component} from 'react'
import {Provider} from 'react-redux'
import RootContainer from './RootContainer'
import createStore from '../Redux'
import {StyleProvider} from "native-base";

import getTheme from "../Theme/Componenets";
import material from "../Theme/Variables/material";

const store = createStore();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <StyleProvider style={getTheme(material)}>
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
