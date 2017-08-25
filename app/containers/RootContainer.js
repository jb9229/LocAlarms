import React, {Component} from 'react'
import {StatusBar} from 'react-native'
import ReduxNavigation from '../navigation/ReduxNavigation'
import {connect} from 'react-redux'
import {actionDispatcher} from '../redux'
import ReduxPersist from '../config/ReduxPersist'
import {View} from "native-base";

// Styles
class RootContainer extends Component {
  componentDidMount() {
    // if redux persist is not active fire startup action
    if (!ReduxPersist.active) {
      this.props.startup()
    }
  }

  render() {
    return (
      <View>
        <StatusBar barStyle='light-content'/>
        <ReduxNavigation/>
      </View>
    )
  }
}

export default connect(null, actionDispatcher)(RootContainer)
