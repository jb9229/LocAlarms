import './app/config/ReactotronConfig';
import React from "react";
import {AppRegistry} from 'react-native';
import App from './app/containers/App';
AppRegistry.registerHeadlessTask('checkAlarms', () => require("./app/lib/Headless"));
AppRegistry.registerComponent('LocAlarms', () => App);
